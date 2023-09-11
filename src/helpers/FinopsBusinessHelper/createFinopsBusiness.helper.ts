import { LISTING_ROUTES } from '@/constants/api.constants';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { gstinDataType } from '../CommonCardHelper/genericGstin.card.helper';
interface gstinBusinessInformation {
    gstin: string;
    mobile: string;
    email: string;
}

export default class CreateFinopsBusinessHelper extends BaseHelper {
    public listHelper: ListingHelper;
    constructor(page) {
        super(page);
        this.listHelper = new ListingHelper(page);
    }
    public async init() {
        const URL = LISTING_ROUTES['BUSINESSESS'];
        await this._page.goto(URL); // go to business page
        await this._page.waitForLoadState('networkidle');
    }

    public async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
    }

    public async clickModalCloseButton() {
        await this._page
            .locator(
                `//div[contains(@class,'col-flex overflow-y-hidden')]/following-sibling::button[1]`
            )
            .click();
    }

    public async clickConfirmDialogAction(string: 'Yes!' | 'No') {
        await this._page.locator(`//span[text()='${string}']`).click();
    }

    public async checkConfirmDialogOpenOrNot() {
        await this.clickModalCloseButton();

        const dialog = await this.locateByText(
            'Do you want to exit? The details you have entered will be deleted.'
        );
        await this._page.waitForLoadState('domcontentloaded');

        expect(await dialog.isVisible(), 'check confirm dialog open or not');

        await this.clickConfirmDialogAction('Yes!');
    }

    public async openBusinessForm() {
        const button = await this.locateByText('Add Business');

        expect(
            await button.isVisible(),
            'Add Business button not found !! '
        ).toBe(true);

        await button.click();
        console.log(chalk.blue('Open Add Business Form'));
        // await this._page.waitForTimeout(1000);
    }

    public async checkModalHeaderTitle() {
        await this.locateByRole('heading');

        expect(
            await this._locator.isVisible(),
            'check modal header title '
        ).toBe(true);
        const text = await this._locator.textContent();
        console.log(chalk.blue('Business Form Header is '), chalk.yellow(text));
    }
    public async checkFormIsOpen() {
        // const element = await this.locateByText('Add Business');
        const element = await this._page.getByRole('dialog');
        expect(await element.isVisible(), 'check form is open').toBe(true);
        // await this._page.waitForTimeout(1000);
        await this.checkModalHeaderTitle();

        console.log(chalk.blue('Checking Business Form Is Open Or Not'));
    }

    public async fillGstin(gstin: string): Promise<void> {
        await this.fillInput(gstin, { name: 'gstin' });
    }

    public async fillMobile(mobile: string): Promise<void> {
        await this.fillInput(mobile, { name: 'mobile' });
    }

    public async fillEmail(email: string): Promise<void> {
        await this.fillInput(email, { name: 'email' });
    }

    public async fillBusinessInputInformation(
        data: gstinBusinessInformation,
        targetClick: 'email' | 'mobile' | 'gstin' = 'email'
    ): Promise<void> {
        console.log(chalk.blue('Filling gstin business information ....'));
        await this.fillGstin(data.gstin);
        await this.fillEmail(data.email);
        await this.fillMobile(data.mobile);
        // if (targetClick === 'submit') return await this.submitButton();
        await this.click({
            selector: 'input',
            name: targetClick,
        });
    }

    public async submitButton() {
        const btnClick = this._page.getByRole('button', { name: 'Save' });
        expect(await btnClick.isEnabled(), {
            message: 'check save button enabled',
        }).toBe(true);

        await btnClick.click();
        await this._page.waitForLoadState('networkidle');
        // await this._page.waitForTimeout(1000);
        return btnClick;
    }

    public async checkDisableSubmit(): Promise<void> {
        const submitButton = await this.submitButton();
        expect(await submitButton.isEnabled(), {
            message: 'check save button disabled',
        }).toBe(false);
    }

    public async checkMandatoryFields(): Promise<void> {
        expect(await this.isInputMandatory({ name: 'gstin' }), {
            message: 'Gstin is required?',
        }).toBeTruthy();
        expect(await this.isInputMandatory({ name: 'mobile' }), {
            message: 'Mobile is required?',
        }).toBeTruthy();
        expect(await this.isInputMandatory({ name: 'email' }), {
            message: 'Email is required?',
        }).toBeTruthy();
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
        const status_cell = await this.listHelper.getCell(row, 'STATUS');
        await expect(status_cell, {
            message: 'Checking Status',
        }).toHaveText(status);
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

        await this.clickBusinessNameCell(name_cell);

        await this.VerifyTabClickable();
    }

    public async VerifyTabClickable(): Promise<void> {
        await this.listHelper.tabHelper.clickTab('Active');
        await this.listHelper.tabHelper.clickTab('Inactive');
        await this.listHelper.tabHelper.clickTab('All');
    }

    public async checkToastMessage(): Promise<void> {
        await this._page.waitForTimeout(1000);
        const toast = await this._page.locator('div.ct-toast-success');
        expect(await toast.isVisible(), 'checking toast message').toBe(true);
        const textContent = await toast.textContent();
        console.log(chalk.blue('toast message is '), chalk.green(textContent));
    }
}
