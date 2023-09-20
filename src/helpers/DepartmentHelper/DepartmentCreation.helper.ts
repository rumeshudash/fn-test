import { formatDate } from '@/utils/common.utils';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { LISTING_ROUTES } from '@/constants/api.constants';
import { Logger } from '../BaseHelper/log.helper';

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
        await this._page.waitForURL(LISTING_ROUTES.DEPARTMENTS);
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
        Logger.success('Add department button clicked');
        const saveBtn = await this.submitButton('Save', {
            clickSubmit: false,
        });
        await expect(saveBtn, {
            message: 'Checking save button visibility',
        }).toBeVisible();
        Logger.success('Add department form is visible');
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
    }: {
        data: DepartmentCreationData;
        present: boolean;
    }) {
        Logger.info('Department listing page opened');

        await this.listingHelper.searchInList(data.NAME);
        const addedDepartmentRow = await this.listingHelper.findRowInTable(
            data.NAME,
            'NAME'
        );

        // if added department is not present
        if (!present) {
            await expect(addedDepartmentRow, {
                message: 'Checking department row visibility',
            }).not.toBeVisible();
            return;
        }

        await this.listingHelper.validateRow(addedDepartmentRow, data);
    }

    // navigate to tabs based on status
    public async navigateToTab(status: string) {
        Logger.info('Navigating to tab:' + status);
        await this._page
            .locator('//button[@role="tab"]')
            .getByText(status, { exact: true })
            .click();
        await this._page.waitForTimeout(1000);
    }

    // toggle department status from the row
    public async setStatus(name: string, status: string) {
        Logger.info('Toggling department status');
        await this.navigateTo('DEPARTMENTS');
        await this.tabHelper.clickTab('All');
        await this.statusHelper.setStatus(name, status);
        Logger.success('Department status toggled');
    }

    // check parent department form field
    public async checkParentDepartment() {
        const parentDepartment = this._page
            .locator('form')
            .getByText('Select a parent department');
        await expect(parentDepartment, {
            message: 'Checking parent department field visibility',
        }).toBeVisible();
        Logger.success('Parent department field is visible');
    }

    // check save and create another
    public async checkSaveAndCreateAnother() {
        const form = this._page.locator('form');
        await expect(form, {
            message: 'Checking form visibility on save and create another',
        }).toBeVisible();
        Logger.success('Form is still open after save and create another');
    }
}
