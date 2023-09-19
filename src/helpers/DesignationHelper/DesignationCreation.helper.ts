import { expect } from '@playwright/test';
import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { TabHelper } from '../BaseHelper/tab.helper';

export class DesignationHelper extends BaseHelper {
    // public designationInfo;
    public notification: NotificationHelper;
    public breadCrumb: BreadCrumbHelper;
    public tab: TabHelper;
    public form: FormHelper;
    public dialog: DialogHelper;
    public listing: ListingHelper;
    public status: StatusHelper;
    constructor(page: any) {
        super(page);
        // this.designationInfo = designationInfo;
        this.notification = new NotificationHelper(page);
        this.breadCrumb = new BreadCrumbHelper(page);
        this.tab = new TabHelper(page);
        this.form = new FormHelper(page);
        this.dialog = new DialogHelper(page);
        this.listing = new ListingHelper(page);
        this.status = new StatusHelper(page);
    }
    public async init() {
        await this.navigateTo('DESIGNATIONS');
    }
    async addDesignation() {
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();
    }
    // public async verifyDialog() {
    //     expect(
    //         this._page.getByRole('dialog'),
    //         chalk.red('dialog visibility')
    //     ).toBeVisible();
    // }

    // public async verifyNameField() {
    //     await this._page.waitForTimeout(1000);
    //     const name_field = this.locate('input', { name: 'name' })._locator;
    //     expect(
    //         await name_field.isVisible(),
    //         chalk.red('Name field visibility')
    //     ).toBe(true);
    // }
    // async fillNameField() {
    //     await this.verifyNameField();
    //     await this.fillText(this.designationInfo.name, { name: 'name' });
    // }
    public async verifyChangeStatus(status: string) {
        const itemStatus = this._page
            .getByRole('button', {
                name: status,
            })
            .first();
        expect(
            await itemStatus.isVisible(),
            chalk.red('Designation status visibility')
        );
    }

    // public async searchDesignation() {
    //     await this.fillText(this.designationInfo.name, {
    //         placeholder: 'Search ( min: 3 characters )',
    //     });
    //     await this._page.waitForTimeout(2000);
    // }

    private async _parentRow(name: string) {
        const row = await this.listing.findRowInTable(name, 'NAME');
        return row;
    }

    public async getColumnText(name: string, columnName: string) {
        const parentRowLocator = await this._parentRow(name);
        const cellText = await this.listing.getCellText(
            parentRowLocator,
            columnName
        );
        return cellText;
    }

    public async clickColumnText(name: string, columnName: string) {
        const linkText = await this.getColumnText(name, columnName);
        await this.click({ role: 'link', text: linkText });
    }

    public async verifyItem(rowName: string, columnName: string) {
        const row = await this.listing.findRowInTable(rowName, 'NAME');
        const cell = await this.listing.getCell(row, columnName);
        await expect(cell).toBeVisible();
    }

    public async clickEditColumn(rowName: string) {
        const row = await this.listing.findRowInTable(rowName, 'NAME');
        const buttonColumn = await this.listing.getCellButton(row, 'ACTION');
        await buttonColumn.click();
    }

    // private async _parentTable(title: string) {
    //     return this.locate(`//a[text()="${title}"]/parent::div/parent::div`, {
    //         exactText: true,
    //     })._locator;
    // }

    // public async verifyItemInList(title: string) {
    //     const parentTableLocator = await this._parentTable(title);
    //     const designation_name = parentTableLocator.locator('//a');

    //     const designation_status = parentTableLocator
    //         .locator('//button', {
    //             hasText: 'Active',
    //         })
    //         .first();

    //     const designation_date = parentTableLocator
    //         .locator(
    //             '//div[@class="table-cell align-middle"]/following-sibling::div'
    //         )
    //         .first();
    //     const itemAction = parentTableLocator
    //         .locator(
    //             '//div[contains(@class,"icon-container transition-all")]//div'
    //         )
    //         .first();

    //     await expect(
    //         designation_name,
    //         chalk.red('Designation Name visibility')
    //     ).toBeVisible();

    //     await expect(
    //         designation_status,
    //         chalk.red('Designation Status visibility')
    //     ).toBeVisible();

    //     await expect(
    //         designation_date,
    //         chalk.red('Designation date visibility')
    //     ).toBeVisible();

    //     await expect(
    //         itemAction,
    //         chalk.red('Designation action visibility')
    //     ).toBeVisible();
    // }

    //public async verifyDesignationPage() {
    //     await expect(
    //         this._page.locator("(//p[text()='Designation Detail'])[1]"),
    //         chalk.red('Designation page visibility')
    //     ).toBeVisible();
    //     const designationListItem = this._page.locator(
    //         '//div[contains(@class,"text-base font-semibold")]'
    //     );
    //     expect(
    //         await designationListItem.textContent(),
    //         chalk.red('Designation Name match')
    //     ).toBe(this.designationInfo.name);

    //     const identifier = this.locate('span', {
    //         id: 'has-Identifier',
    //     })._locator;
    //     await expect(
    //         identifier,
    //         chalk.red('Identifier visibility')
    //     ).toBeVisible();
    // }

    public async clickDesignationRowLink(cellText: string) {
        const row = await this.listing.findRowInTable(cellText, 'NAME');
        const link = await this.listing.getCellText(row, 'NAME');
        // await this.verifyItemInList(title);
        // const parentTableLocator = await this.parentTable(title);
        // const designationList = parentTableLocator.locator('//a');

        // await designationList.click();
        // await this._page.waitForTimeout(1000);
        await this.click({ role: 'link', text: link });
    }

    // public async clickAction() {
    //     const itemAction = this.locate(
    //         '(//div[contains(@class,"icon-container transition-all")]//div)[1]'
    //     );
    //     await itemAction.click();
    // }
}
