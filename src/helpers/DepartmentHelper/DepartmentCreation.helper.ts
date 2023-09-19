import { formatDate } from '@/utils/common.utils';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { Logger } from '../BaseHelper/log.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { TabHelper } from '../BaseHelper/tab.helper';

export class DepartmentCreation extends FormHelper {
    public listingHelper: ListingHelper;
    public detailsHelper: DetailsPageHelper;
    public documentHelper: DocumentHelper;
    public tabHelper: TabHelper;
    public statusHelper: StatusHelper;
    public notificationHelper: NotificationHelper;

    constructor(page) {
        super(page);
        this.listingHelper = new ListingHelper(page);
        this.detailsHelper = new DetailsPageHelper(page);
        this.documentHelper = new DocumentHelper(page);
        this.tabHelper = new TabHelper(page);
        this.statusHelper = new StatusHelper(page);
        this.notificationHelper = new NotificationHelper(page);
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
        if (data.manager_id) {
            await this.selectOption({
                input: data.manager_id,
                name: 'manager_id',
            });
        }
        if (data.parent_id) {
            await this.selectOption({
                input: data.parent_id,
                name: 'parent_id',
            });
        }
        await this.clickButton('Save');
        Logger.success('Save button clicked');

        // check success message
        if (data.name) {
            this.notificationHelper.checkToastSuccess('Successfully created');
            Logger.success('Department toast message verified');
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
        await this.detailsHelper.validateDetailsPageInfo('Department Detail', [
            {
                selector: '//h3[@role="heading"]',
                text: department.name,
            },
            { selector: '#has-Manager', text: department.manager_id },
            { selector: '#has-Parent', text: department.parent_id },
        ]);
    }

    // check department addition in the row
    public async verifyDepartmentDetails(
        department,
        data: DepartmentCreationData,
        status: string
    ) {
        expect(department).not.toBeNull();
        const parentDepartment = await department.getByText(data.parent_id);
        expect(parentDepartment).not.toBeNull();
        const manager = await department.getByText(data.manager_id);
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
            await expect(addedDepartmentRow).not.toBeVisible();
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
    public async setStatus(name: string, status: string) {
        console.log(chalk.blue('Toggling department status'));
        await this.navigateTo('DEPARTMENTS');
        await this.tabHelper.clickTab('All');
        await this.statusHelper.setStatus(name, status);
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
