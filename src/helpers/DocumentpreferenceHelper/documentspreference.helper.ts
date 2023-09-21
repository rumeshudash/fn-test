import { ListingHelper } from '../BaseHelper/listing.helper';
import { expect } from '@playwright/test';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import chalk from 'chalk';
export class DocumentspreferenceHelper extends ListingHelper {
    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.notificationHelper = new NotificationHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }
    public async init() {
        await this.navigateTo('DOCUMENT_PREFERENCES');
    }

    public async searchTextInList(name: string) {
        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        const text = await this.getCellText(row, 'NAME');

        await this._page.waitForTimeout(1000);

        expect(text).toBe(name);
    }

    public async getTableHeader(name: string[]) {
        await this._page.waitForTimeout(1000);
        const RowNames = await this.getTableColumnNames();

        expect(RowNames).toEqual(name);
    }

    public async changeSatus(name: string, columnName: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, columnName);

        await this._page.waitForTimeout(1000);
    }

    public async clickAddBtn() {
        await this._page
            .locator(
                `//div[contains(@class,'flex-wrap justify-end')]//button[1]`
            )
            .click(); //During Empty list there is 2 button so we are using 1st button

        await this._page.waitForTimeout(1000);
    }

    public async getSelectOptions() {
        const locator = await this.dialogHelper.getLocator();

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
    public async addDocumentPreference() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const Array = await this.getSelectOptions();

            if (Array.length > 0) {
                await this.selectOption({
                    input: Array[0],
                    name: 'document_id',
                });
                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    public async addDocumentMendatory() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const Array = await this.getSelectOptions();
            if (Array.length > 0) {
                await this.selectOption({
                    input: Array[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'Document Mandatory' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }
    public async addDocumentFileMendatory() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const Array = await this.getSelectOptions();

            if (Array.length > 0) {
                await this.selectOption({
                    input: Array[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'Document Files Mandatory' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    public async addWithBothMandatory() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const Array = await this.getSelectOptions();
            if (Array.length > 0) {
                await this.selectOption({
                    input: Array[0],
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
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    public async addAndClickCheck() {
        const count = await this.getRowCount('NAME');

        if (count < 5) {
            await this.clickAddBtn();

            const Array = await this.getSelectOptions();

            if (Array.length > 0) {
                await this.selectOption({
                    input: Array[0],
                    name: 'document_id',
                });
                await this._page
                    .locator('label')
                    .filter({ hasText: 'save and create another' })
                    .click();

                await this._page.waitForTimeout(1000);

                await this.clickButton('Save');
            }
        } else {
            console.log(chalk.red('Maximum Document Preference Added'));
        }
    }

    public async checkRowCount() {
        await this.searchInList('');
        const count = await this.getRowCount('NAME');

        console.log(chalk.green('Total Row Count is ' + count));
    }
}
