import { LISTING_ROUTES } from '@/constants/api.constants';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { gstinDataType } from '../CommonCardHelper/genericGstin.card.helper';
import { BaseHelper } from '../BaseHelper/base.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { FileHelper } from '../BaseHelper/file.helper';
import { NotesHelper } from '../BaseHelper/notes.helper';

export default class CreateFinopsBusinessHelper extends NotificationHelper {
    public listHelper: ListingHelper;
    public formHelper: FormHelper;

    constructor(page) {
        super(page);
        this.listHelper = new ListingHelper(page);
        this.formHelper = new FormHelper(page);
    }
    public async init() {
        const URL = LISTING_ROUTES['BUSINESSESS'];
        await this._page.goto(URL); // go to business page
        await this._page.waitForLoadState('networkidle');
    }

    public async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
    }

    public async checkEmailError(message?: string): Promise<void> {
        const errorMessage = await this.checkInputErrorMessage({
            name: 'email',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }
    public async checkMobileError(message?: string): Promise<void> {
        const errorMessage = await this.checkInputErrorMessage({
            name: 'mobile',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }
    public async checkGstinError(message?: string): Promise<void> {
        const errorMessage = await this.checkInputErrorMessage({
            name: 'gstin',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }

    public async ErrorMessageHandle(
        message: string,
        element: any
    ): Promise<void> {
        await this._page.waitForLoadState('networkidle');
        expect(await element.isVisible()).toBe(true);

        // for comparing two error message
        if (!message || !element) return;

        let textContent = await element.textContent();
        textContent = textContent.trim();

        if (textContent === message) return console.log(chalk.red(textContent));
        throw console.log(
            chalk.red(
                `"${textContent}" is not a valid error !! valid valid error should be "${message}"`
            )
        );
    }

    public async verifyBusinessName(
        cell: any,
        business_name: string
    ): Promise<void> {
        await expect(cell, {
            message: 'verifying business name',
        }).toHaveText(business_name);
    }

    public async verifyStatus(
        status: 'Active' | 'Inactive' = 'Active',
        row: any
    ): Promise<void> {
        expect(await this.listHelper.getCellText(row, 'STATUS'), {
            message: `Checking ${status} status`,
        }).toBe(status);
    }

    public async clickBusinessNameCell(cell: any): Promise<void> {
        await cell.click();
    }

    public async verifyTableData(data: gstinDataType): Promise<void> {
        const row = await this.listHelper.findRowInTable(data?.value, 'GSTIN');
        const name_cell = await this.listHelper.getCell(row, 'NAME');

        await this.verifyBusinessName(name_cell, data?.trade_name);

        await this.verifyStatus('Active', row);

        await this.listHelper.getCellText(row, 'ADDED AT'); //check created date present or not

        await this.VerifyTabClickable();
        await this.clickBusinessNameCell(name_cell);
    }

    public async VerifyTabClickable(): Promise<void> {
        await this.listHelper.tabHelper.clickTab('Inactive');
        await this.listHelper.tabHelper.clickTab('All');
        await this.listHelper.tabHelper.clickTab('Active');
    }

    // public async checkToastMessage(): Promise<void> {
    //     await this._page.waitForTimeout(1000);
    //     const toast = await this._page.locator('div.ct-toast-success');
    //     expect(await toast.isVisible(), 'checking toast message').toBe(true);
    //     const textContent = await toast.textContent();
    //     console.log(chalk.blue('toast message is '), chalk.green(textContent));
    // }
}

export class BusinessDetailsPageHelper extends CreateFinopsBusinessHelper {
    public breadCrumb: BreadCrumbHelper;
    public businessInfo;
    public dialog: DialogHelper;
    public tab: TabHelper;
    public fileUpload: FileHelper;
    public notesHelper: NotesHelper;
    constructor(businessInfo, page: any) {
        super(page);
        this.breadCrumb = new BreadCrumbHelper(page);
        this.businessInfo = businessInfo;
        this.dialog = new DialogHelper(page);
        this.tab = new TabHelper(page);
        this.fileUpload = new FileHelper(page);
        this.notesHelper = new NotesHelper(page);
    }

    public async parentRowLocator() {
        const row = await this.listHelper.findRowInTable(
            this.businessInfo.value,
            'GSTIN'
        );
        return row;
    }

    public async getBusiness(columnName: string) {
        const parentRow = await this.parentRowLocator();
        const business = await this.listHelper.getCell(parentRow, columnName);
        return business;
    }

    public async clickBusiness(columnName: string) {
        const parentRow = await this.getBusiness(columnName);
        let businessLink;
        switch (columnName) {
            case 'NAME':
                businessLink = parentRow.locator('//a');
                break;
            case 'GSTIN':
                businessLink = parentRow.locator('//div');
                break;
        }
        await businessLink.click();
    }

    public async getBusinessGstStatus(title: string) {
        const parentContainer = this.locate(
            '//div[contains(@class,"grid grid-cols-2")]'
        )._locator;

        const titleLocator = await parentContainer.locator(
            `//p[text()="${title}"]/following-sibling::p`
        );
        return titleLocator.innerText();
    }

    public async informationDetailsLocator() {
        return this.locate("//div[@data-title='detail_information']")._locator;
    }

    public async checkInformation(title: string) {
        const parentContainer = await this.informationDetailsLocator();
        const titleLocator = await parentContainer
            .locator(
                `//p[text()='${title}']/parent::div/parent::div/parent::div //span[contains(@id,"has-")]`
            )
            .innerText();
        return titleLocator;
    }

    public async editInformation(title: string) {
        const parentContainer = await this.informationDetailsLocator();
        const titleLocator = parentContainer.locator(
            `//p[text()='${title}']/parent::div/parent::div/parent::div`
        );
        const editButoton = titleLocator.locator('//a[text()="Edit"]');
        await editButoton.click();
    }

    public async parentBusinessDetailsRow(name: string) {
        const row = await this.listHelper.findRowInTable(name, 'NAME');
        return row;
    }

    public async getBusinessDetails(name: string) {
        const parentRow = await this.parentBusinessDetailsRow(name);
        const business_gst = await this.listHelper.getCell(parentRow, 'NUMBER');
        return await business_gst.innerText();
    }

    public async getBusinessDocuments(name: string) {
        const parentRow = await this.parentBusinessDetailsRow(name);
        const business_gst = await this.listHelper.getCell(
            parentRow,
            'NO. OF DOCUMENTS'
        );
        return business_gst.locator('//span').isVisible();
    }

    public async clickBusinessAction(name: string) {
        const parentRow = await this.parentBusinessDetailsRow(name);
        const business_gst = await this.listHelper.getCellButton(
            parentRow,
            'ACTION'
        );
        await business_gst.click();
    }

    public async contactPersonParent(email: string) {
        const row = (
            await this.listHelper.findRowInTable(email, 'EMAIL')
        ).first();
        return row;
    }

    public async getContactPerson(email: string, columnName: string) {
        const parentRow = await this.contactPersonParent(email);
        const business_gst = (
            await this.listHelper.getCell(parentRow, columnName)
        ).first();
        return await business_gst.innerText();
    }

    public notesParent(notesTitle: string) {
        return this.locate(
            `//div[text()[normalize-space()='${notesTitle}']]/parent::div/parent::div`
        )._locator.first();
    }

    public async getNotesAuthor(notesTitle: string) {
        const parentLocator = this.notesParent(notesTitle);
        const author = await parentLocator.locator('//p[1]').innerText();
        return author;
    }

    public async checkNotesDate(notesTitle: string) {
        const parentLocator = this.notesParent(notesTitle);
        const date_time = parentLocator.locator('//p[2]');
        await expect(
            date_time,
            chalk.red('Date time visibility')
        ).toBeVisible();
    }

    async optionsParentLocator() {
        return this._page.locator(
            '//div[contains(@class,"breadcrumbs")]/parent::div'
        );
    }

    async clickEditIcon() {
        await this._page.waitForTimeout(2000);
        const parentLocator = await this.optionsParentLocator();
        const edit_button = parentLocator.locator(
            '//button[@data-title="Edit"]'
        );
        if (await edit_button.isVisible()) await edit_button.click();
    }

    // public async getBusinessName() {
    //     const parentRow = await this.parentRowLocator();
    //     const business_name = await this.listHelper.getCell(parentRow, 'NAME');
    //     return business_name;
    // }
    // public async getBusinessGST() {
    //     const parentRow = await this.parentRowLocator();
    //     const business_gst = await this.listHelper.getCell(parentRow, 'GSTIN');
    //     return business_gst;
    // }

    // public async getBusinessStatus() {
    //     const parentRow = await this.parentRowLocator();
    //     const business_status = await this.listHelper.getCell(
    //         parentRow,
    //         'STATUS'
    //     );
    //     return business_status;
    // }

    // public async getActiveVendor() {
    //     const parentRow = await this.parentRowLocator();
    //     const active_vendor = await this.listHelper.getCell(
    //         parentRow,
    //         'ACTIVE VENDORS'
    //     );
    //     return active_vendor;
    // }

    // public async getDateAdded() {
    //     const parentRow = await this.parentRowLocator();
    //     const date_added = await this.listHelper.getCell(parentRow, 'ADDED AT');
    //     return date_added;
    // }
}
