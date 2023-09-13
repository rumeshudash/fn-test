import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { formatDate } from '@/utils/common.utils';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';

export class DepartmentCreation extends BaseHelper {
    public listingHelper: ListingHelper;
    public detailsHelper: DetailsPageHelper;
    public documentHelper: DocumentHelper;
    public tabHelper: TabHelper;

    constructor(page) {
        super(page);
        this.listingHelper = new ListingHelper(page);
        this.detailsHelper = new DetailsPageHelper(page);
        this.documentHelper = new DocumentHelper(page);
        this.tabHelper = new TabHelper(page);
    }

    public async init() {
        const isExpanded = await this._page
            .locator('.hamburger_button.hamburger_button--active')
            .isVisible();
        if (!isExpanded) {
            await this._page.locator('.hamburger_button').click();
        }
        await this._page
            .locator('.sidebar-item-title')
            .filter({ hasText: 'HR' })
            .click();
        await this._page
            .locator('.sidebar-item-title')
            .filter({ hasText: 'Departments' })
            .click();
        await this._page.waitForTimeout(1000);
    }

    // open add department form
    public async openDepartmentAddForm() {
        const container = this._page.locator(
            `//div[contains(@class,'breadcrumbs')]/ancestor::div[contains(@class,"justify-between")]`
        );
        await container
            .getByRole('button', {
                name: 'add_circle_outline Add Department',
            })
            .click();
        console.log(chalk.green('Add department button clicked'));
        await expect(this._page.locator('//button[text()="Save"]'), {
            message: 'Checking save button visibility',
        }).toBeVisible();
        console.log(chalk.green('Add department form is visible'));
    }

    // fill department values
    public async fillDepartment(
        data: DepartmentCreationData,
        update?: boolean
    ) {
        await this._page.waitForSelector(
            '//div[@role="dialog"]/descendant::form'
        );
        if (data.name) {
            await this.fillInput(data.name, {
                name: 'name',
            });
        }
        if (data.manager) {
            await this.selectOption({
                input: data.manager,
                name: 'manager_id',
            });
        }
        if (data.parent) {
            await this.selectOption({ input: data.parent, name: 'parent_id' });
        }
        await this.click({ role: 'button', name: 'Save' });
        console.log(chalk.green('Save button clicked'));

        // check success message
        if (data.name) {
            const toast = this._page.locator('div.ct-toast-success').first();
            expect(await toast.textContent(), {
                message: 'Checking toast message',
            }).toBe('Successfully created');
            console.log(chalk.green('Department toast message verified'));
        }
        // check err message if name empty
        if (!data.name && !update) {
            console.log(
                chalk.blue('Checking error message and button disabled')
            );
            const error = this._page.locator('span.label.text-error').first();
            expect(await error.textContent(), {
                message: 'Checking error message',
            }).toBe('Name is required');
            await expect(this._page.locator('//button[text()="Save"]'), {
                message: 'Checking save button visibility',
            }).toBeDisabled();
            console.log(
                chalk.green('Error message verified and button disabled')
            );
        }
    }

    // goto department details page
    public async validateDetailsPage(department: DepartmentCreationData) {
        this.detailsHelper.validateDetailsPageInfo('Department Detail', [
            {
                selector: '//h3[@role="heading"]',
                text: department.name,
            },
            { selector: '#has-Manager', text: department.manager },
            { selector: '#has-Parent', text: department.parent },
        ]);
    }

    // check department addition in the row
    public async verifyDepartmentDetails(
        department,
        data: DepartmentCreationData,
        status: string
    ) {
        expect(department).not.toBeNull();
        const parentDepartment = await department.getByText(data.parent);
        expect(parentDepartment).not.toBeNull();
        const manager = await department.getByText(data.manager);
        expect(manager).not.toBeNull();
        const statusButton = await department.locator('button').first();
        expect(await statusButton.textContent()).toBe(status);
        const formattedDate = formatDate(data.date, true);
        const date = await department.getByText(formattedDate);
        expect(date).not.toBeNull();
    }

    // verify if the department is present in the table
    public async verifyIfPresent({
        data,
        present,
        status,
    }: {
        data: DepartmentCreationData;
        present: boolean;
        status: string;
    }) {
        console.log(chalk.blue('Department listing page opened'));

        await this.listingHelper.searchInList(data.name);
        const addedDepartmentRow = await this.listingHelper.findRowInTable(
            data.name,
            'NAME'
        );

        // if added department is not present
        if (!present) {
            expect(addedDepartmentRow).not.toBeVisible();
            return;
        }

        await this.verifyDepartmentDetails(addedDepartmentRow, data, status);
    }

    // navigate to tabs based on status
    public async navigateToTab(status: string) {
        console.log(chalk.blue('Navigating to tab:' + status));
        await this._page
            .locator('//button[@role="tab"]')
            .getByText(status, { exact: true })
            .click();
        await this._page.waitForTimeout(1000);
    }

    // toggle department status from the row
    public async toggleStatus(name: string, status: string) {
        await this.navigateTo('DEPARTMENTS');
        await this.tabHelper.clickTab('All');
        console.log(chalk.blue('Toggling department status'));
        await this.listingHelper.searchInList(name);
        const department = await this.listingHelper.findRowInTable(
            name,
            'NAME'
        );
        const toggleButton = department.locator('button').first();
        if (
            (await toggleButton.textContent()) === 'Active' &&
            status === 'Inactive'
        ) {
            await toggleButton.click();
        } else if (
            (await toggleButton.textContent()) === 'Inactive' &&
            status === 'Active'
        ) {
            await toggleButton.click();
        } else {
            console.log(chalk.red('Department status is already ' + status));
        }
        expect(toggleButton).toHaveText(status);
        await this._page.waitForTimeout(1000);
        console.log(chalk.green('Department status toggled'));
    }

    // check parent department form field
    public async checkParentDepartment() {
        const parentDepartment = this._page
            .locator('form')
            .getByText('Select a parent department');
        await expect(parentDepartment).toBeVisible();
        console.log(chalk.green('Parent department field is visible'));
    }

    // check save and create another
    public async checkSaveAndCreateAnother() {
        const form = this._page.locator('form');
        await expect(form).toBeVisible();
        console.log(
            chalk.green('Form is still open after save and create another')
        );
    }
}
