import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { NotesHelper } from '../BaseHelper/notes.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { StatusHelper } from '../BaseHelper/status.helper';

export class ExpenseHeadHelper extends ListingHelper {
    /**
     * @description - Creating instance of all helpers
     */
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    public statusHelper: StatusHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);
        this.dialogHelper = new DialogHelper(page);
        this.statusHelper = new StatusHelper(page);
    }
    /**
     *
     * @description - Initializing the page
     */
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }

    /**
     *
     * @description - This functiion will performs the addition of the expense head
     *
     * @param {string} name - Name of the expense head
     * @param {string} parent - The optional feild parent of that particular expense head
     * @param {string}manager - The optional feild manager of that particular expense head
     * @param {string} abc - The optional feild date of that particular expense head
     */
    public async addExpenseHead(
        name: string,
        parent?: string,
        manager?: string,
        abc?: string
    ) {
        await this.fillText(name, {
            name: 'name',
        });
        if (parent) {
            await this.selectOption({
                input: parent,
                name: 'parent_id',
            });
        }
        if (manager) {
            await this.selectOption({
                input: manager,
                name: 'manager_id',
            });
        }
        if (abc) {
            await this.fillText(abc, {
                name: 'date',
            });
        }
        await this.clickButton('Save');
    }
    /**
     * @description - This function will search the expense head
     *
     * @param name - Name of the expense head
     */
    public async searchExpense(name: string) {
        await this.searchInList(name);
        await this._page.waitForTimeout(1000);
        await this.searchInList(name);
    }
    /**
     * @description - This function will change the status of the expense head active to inactive
     *
     * @param name - Name of the expense head
     */
    public async changeActiveStatus(name: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        await this.statusHelper.setStatus(name, 'Active');

        await this._page.waitForTimeout(1000);
    }
    /**
     *
     * @description - This function will change the status of the expense head inactive to active
     *
     * @param name - Name of the expense head
     */
    public async changeInactiveStatus(name: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        await this.statusHelper.setStatus(name, 'Inactive');

        await this._page.waitForTimeout(1000);
    }
    /**
     *
     * @description - This function will edit the expense head
     *
     * @param {string}name - Name of the expense head
     * @param {string}newname - New name of the expense head
     */
    public async editExpenseHead(name: string, newname: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'ACTION');

        await this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will add the expense head and click on the checkbox
     *
     * @param {string}name - Name of the expense head
     */
    public async addAndClickCheckbox(name: string) {
        await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });

        await this.saveAndCreateCheckbox();

        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will verify the tabs[All,Active,Inactive]
     *
     */
    public async verifyTabs() {
        await this.tabHelper.checkTabExists(['All', 'Active', 'Inactive']);
    }

    /**
     *
     * @description - This function will verify the table headers
     *
     */
    public async checkTableHeader() {
        const headers = await this.getTableColumnNames();

        expect(headers).toEqual([
            'S.N',
            'NAME',
            'APPROVAL MANAGER',
            'STATUS',
            'PARENT',
            'ACTION',
        ]);
    }
    /**
     *
     * @description - This function will fill the input and click the cross button and check warning is coming or not
     *
     * @param name - Name of the expense head
     */
    public async checkWarning(name: string) {
        // await this.clickButton('Add Expense Head');

        await this.fillText(name, {
            name: 'name',
        });

        await this.dialogHelper.checkConfirmDialogOpenOrNot();
    }
}
