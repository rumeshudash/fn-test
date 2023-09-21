import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import chalk from 'chalk';
import { FormHelper } from '../BaseHelper/form.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { expect } from '@playwright/test';

export class CustofeildHelper extends ListingHelper {
    /**
     *
     * @description - Creating instance of all helpers
     *
     */
    public tabHelper: TabHelper;
    public notificationHelper: NotificationHelper;

    public formHelper: FormHelper;

    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.tabHelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);

        this.formHelper = new FormHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }
    /**
     * @description - Initializing the page
     */
    public async init() {
        await this.navigateTo('CUSTOMEFEILDS');
    }
    /**
     *
     * @description - This function will clcik on the tab
     *
     * @param TabName - Name of the tab
     */
    public async clickOnTab(TabName: string) {
        await this.tabHelper.checkTabExists(TabName);
        await this.tabHelper.clickTab(TabName);
    }
    /**
     *
     * @description - This function will check the name and type of the custome feild after adding to the custome feild list
     *
     * @param {string} name - Name of the custome feild
     * @param {string} type- Type of the custome feild
     */
    public async checkNameAndType(name: string, type: string) {
        await this.searchInList(name);
        const row = await this.findRowInTable(name, 'FIELD NAME');
        const textName = await this.getCellText(row, 'FIELD NAME');

        const textType = await this.getCellText(row, 'FIELD TYPE');

        expect(textName).toEqual(name);

        expect(textType).toEqual(type);
    }
    /**
     *
     * @description - This function will add the custome feild with the choice type
     *
     * @param {string}name - Name of the custome feild
     * @param {string}type - Type of the custome feild
     * @param {string}choiceList -The name of the choice list
     * @param {number}priority - The priority of the custome feild
     */
    public async addWithChoiceType(
        name: string,
        type: string,
        choiceList: string,
        priority: number
    ) {
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            input: type,
            name: 'column_type_id',
        });

        await this.selectOption({
            input: choiceList,
            name: 'choice_type_id',
        });

        await this.fillText(priority, {
            name: 'priority',
        });
        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will add the custome feild
     *
     * @param {string} name - Name of the custome feild
     * @param {string} type - Type of the custome feild
     * @param {number}priority - The priority of the custome feild
     */
    public async addCustomeFeild(name: string, type: string, priority: number) {
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will add the custome feild with the text type
     *
     * @param {string}name - Name of the custome feild
     * @param {string} type - Type of the custome feild
     * @param {number}priority - The priority of the custome feild
     * @param {string} defaultValue - The default value of the custome feild for text type
     */
    public async addWithTextType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string | number
    ) {
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.fillText(defaultValue, {
                placeholder: 'Default Value',
            });
        }

        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will add the custome feild with the boolean type
     *
     * @param {string} name - Name of the custome feild
     * @param {string} type - Type of the custome feild
     * @param {number} priority - The priority of the custome feild
     * @param {string} defaultValue - The default value of the custome feild for boolean type True or False
     */
    public async addWitBooleanType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string
    ) {
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.click({ role: 'radio', name: defaultValue });
        }
        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will add the custome feild with the date type
     *
     * @param {string} name - Name of the custome feild
     * @param {string} type - Type of the custome feild
     * @param {number} priority - The priority of the custome feild
     * @param {Date} defaultValue - The default value of the custome feild for date type
     */
    public async addWithDateType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: Date
    ) {
        // await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this.click({ role: 'button', name: 'save' });
    }
    /**
     *
     * @description - This function will change the status of the custome feild active to inactive vice versa
     *
     * @param name - Name of the custome feild
     */
    public async changeStatus(name: string) {
        await this.searchInList(name);
        const row = await this.findRowInTable(name, 'FIELD NAME');
        await this.clickButtonInTable(row, 'STATUS');

        await this._page.waitForTimeout(1000);

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));
    }
    /**
     *
     * @description - This function will change the Mandatory status of the custome feild active to inactive vice versa
     *
     * @param name - Name of the custome feild
     *
     */
    public async changeMendatory(name: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
        const row = await this.findRowInTable(name, 'FIELD NAME');
        await this.clickButtonInTable(row, 'MANDATORY');

        await this._page.waitForTimeout(1000);

        const status = await this.getCellText(row, 'MANDATORY');

        console.log(chalk.green('Status is changed to ' + status));
    }
    /**
     *
     * @description - This function will check the edit button and click on it
     *
     * @param name - Name of the custome feild
     */
    public async checkEdit(name: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
        const row = await this.findRowInTable(name, 'FIELD NAME');
        await this.clickButtonInTable(row, 'ACTION');
    }
    /**
     *
     * @description - This function will change the name and priority of the custome feild
     *
     *
     * @param {string} name - Name of the custome feild
     * @param {string} type - Type of the custome feild
     *
     * @param {string} newname - New name of the custome feild
     */
    public async changeName(
        name: string,
        type: string,

        newname?: string
    ) {
        await this.checkNameAndType(name, type);

        await this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });

        await this._page.waitForTimeout(1000);

        await this.searchInList(newname);
    }
    /**
     *
     *@description - This function will change the priority of the custome feild
     *
     * @param {strung} name - Name of the custome feild
     * @param {string} type - Type of the custome feild
     * @param {number} newpriority - New priority of the custome feild
     */
    public async changePriority(
        name: string,
        type: string,

        newpriority?: number
    ) {
        await this.checkNameAndType(name, type);

        await this.fillText(newpriority, {
            name: 'priority',
        });

        await this.click({ role: 'button', name: 'save' });

        await this._page.waitForTimeout(1000);

        await this.searchInList(name);
    }
}
