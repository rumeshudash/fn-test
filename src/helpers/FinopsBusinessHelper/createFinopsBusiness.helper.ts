import { LISTING_ROUTES } from '@/constants/api.constants';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { gstinDataType } from '../CommonCardHelper/genericGstin.card.helper';
import { FormHelper } from '../BaseHelper/form.helper';
interface gstinBusinessInformation {
    gstin: string;
    mobile: string;
    email: string;
}

export default class CreateFinopsBusinessHelper extends BaseHelper {
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

    public async clickConfirmDialogAction(string: 'Yes!' | 'No') {
        await this._page.locator(`//span[text()='${string}']`).click();
    }

    public async checkConfirmDialogOpenOrNot() {
        await this.formHelper.dialogHelper.closeDialog();

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
    }

    public async fillBusinessInputInformation(
        data: gstinBusinessInformation,
        targetClick: 'email' | 'mobile' | 'gstin' = 'email'
    ): Promise<void> {
        console.log(chalk.blue('Filling gstin business information ....'));
        for (const [key, value] of Object.entries(data)) {
            await this.fillInput(value, {
                name: key,
            });
        }

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

    public async checkMandatoryFields(fields: string[]): Promise<void> {
        for (let field of fields) {
            expect(await this.isInputMandatory({ name: 'gstin' }), {
                message: `${field} mandatory checking...`,
            }).toBeTruthy();
        }
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

    public async checkToastMessage(): Promise<void> {
        await this._page.waitForTimeout(1000);
        const toast = await this._page.locator('div.ct-toast-success');
        expect(await toast.isVisible(), 'checking toast message').toBe(true);
        const textContent = await toast.textContent();
        console.log(chalk.blue('toast message is '), chalk.green(textContent));
    }
}
