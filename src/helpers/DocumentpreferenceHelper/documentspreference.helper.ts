import { ListingHelper } from '../BaseHelper/listing.helper';
import { expect } from '@playwright/test';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { SignInHelper } from '../SigninHelper/signIn.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { ProcessSignup } from '../BaseHelper/signup.helper';
import { Page } from '@playwright/test';
import chalk from 'chalk';
export class DocumentspreferenceHelper extends ListingHelper {
    /**
     *
     * @description - Creating instnce of DialogHelper, NotificationHelper
     */
    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    public signInHelper: SignInHelper;

    constructor(page: any) {
        super(page);
        this.notificationHelper = new NotificationHelper(page);
        this.dialogHelper = new DialogHelper(page);

        this.signInHelper = new SignInHelper(page);
    }
    /**
     *
     * @description - Navigate to Document Preference Page
     */
    public async init() {
        await this.navigateTo('DOCUMENT_PREFERENCES');
    }

    /**
     * @description - This function will search text in list And check the text is present or not
     *
     * @param name - Name of the Document Preference
     *
     */

    public async checkTextInList(name: string) {
        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        const text = await this.getCellText(row, 'NAME');

        await this._page.waitForTimeout(1000);

        expect(text).toBe(name);
    }

    /**
     *@description - This function will check the table header Names
     *
     * @param {string[]} name - The Names of the Table Header
     */
    public async checkTableHeader(name: string[]) {
        await this._page.waitForTimeout(1000);
        const RowNames = await this.getTableColumnNames();

        expect(RowNames).toEqual(name);
    }

    /**
     *  @description - This function will change the status of the Document Preference
     *
     * @param {string} name - Name of the Document Preference
     * @param {string} columnName - Name of the Column
     */

    public async changeSatus(name: string, columnName: string) {
        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, columnName);

        await this._page.waitForTimeout(1000);
    }

    /**
     * @description - This function will click on Add new button
     *
     */
    public async clickAddBtn() {
        await this._page
            .locator(
                `//div[contains(@class,'flex-wrap justify-end')]//button[1]`
            )
            .click(); //During Empty list there is 2 button so we are using 1st button

        await this._page.waitForTimeout(1000);
    }

    /**
     * @description - This function will return the select options from the dropdown and return the array
     *
     * @returns {Promise<string[]>} - This function will return the array of the options
     *
     */
    public async getSelectOptions(): Promise<string[]> {
        const locator = this.dialogHelper.getLocator();

        await locator
            .locator(
                `(//div[contains(@class,'selectbox-control !bg-base-100')])[2]`
            )
            .click();
        const elements = await locator
            .locator(`//div[contains(@class,"MenuList")]`)
            .innerText();

        const newArray = elements.split('\n');

        return newArray;
    }

    /**
     * @description - This Function will add document preference with first items of select option
     *
     * @todo - Need to remove some of bypasses of the adding document preference
     *
     */
    public async addDocumentPreference() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const dataArray = await this.getSelectOptions();

            if (dataArray.length > 0) {
                await this.selectOption({
                    input: dataArray[0],
                    name: 'document_id',
                });
                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');

                await this.notificationHelper.checkToastSuccess(
                    'Successfully created document preference'
                );
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }
    /**
     * @description - This Function will add document preference with first items of select option with document mandatory checkbox clicked
     *
     * @todo - Need to remove some of bypasses of the adding document preference
     *
     */
    public async addDocumentMendatory() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const dataArray = await this.getSelectOptions();
            if (dataArray.length > 0) {
                await this.selectOption({
                    input: dataArray[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'Document Mandatory' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');

                await this.notificationHelper.checkToastSuccess(
                    'Successfully created document preference'
                );
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }
    /**
     * @description - This Function will add document preference with first items of select option with document files mandatory checkbox clicked
     *
     * @todo - Need to remove some of bypasses of the adding document preference
     *
     */
    public async addDocumentFileMendatory() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const dataArray = await this.getSelectOptions();

            if (dataArray.length > 0) {
                await this.selectOption({
                    input: dataArray[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'Document Files Mandatory' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');

                await this.notificationHelper.checkToastSuccess(
                    'Successfully created document preference'
                );
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    /**
     * @description - This Function will add document preference with first items of select option with both checkbox clicked
     *
     * @todo - Need to remove some of bypasses of the adding document preference
     *
     */
    public async addWithBothMandatory() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const dataArray = await this.getSelectOptions();
            if (dataArray.length > 0) {
                await this.selectOption({
                    input: dataArray[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'Document Mandatory' })
                    .click();

                await this._page
                    .locator('label')
                    .filter({ hasText: 'Document Files Mandatory' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');

                await this.notificationHelper.checkToastSuccess(
                    'Successfully created document preference'
                );
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    /**
     * @description - This Function will add document preference with first items of select option with  save and create another checkbox clicked
     *
     * @todo - Need to remove some of bypasses of the adding document preference
     *
     */
    public async addAndClickCheck() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const dataArray = await this.getSelectOptions();

            if (dataArray.length > 0) {
                await this.selectOption({
                    input: dataArray[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'save and create another' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');

                await this.notificationHelper.checkToastSuccess(
                    'Successfully created document preference'
                );
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    /**
     *
     * @returns {promise<number>} - T return the count of the rows in the table
     * @description - This function will return the count of the rows in the table
     */
    public async checkRowCount() {
        await this.searchInList('');
        const count = await this.getRowCount('NAME');

        return count;
    }
}
