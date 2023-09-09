import { LISTING_ROUTES } from '@/constants/api.constants';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';
interface gstinBusinessInformation {
    gstin: string;
    mobile: string;
    email: string;
}

export default class CreateFinopsBusinessHelper extends BaseHelper {
    async init() {
        const URL = LISTING_ROUTES['BUSINESSESS'];
        await this._page.goto(URL); // go to business page
        await this._page.waitForLoadState('networkidle');
    }

    async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
    }

    async clickModalCloseButton() {
        await this._page
            .locator(
                `//div[contains(@class,'col-flex overflow-y-hidden')]/following-sibling::button[1]`
            )
            .click();
    }

    async clickConfirmDialogAction(string: 'Yes!' | 'No') {
        await this._page.locator(`//span[text()='${string}']`).click();
    }

    async checkConfirmDialogOpenOrNot() {
        await this.clickModalCloseButton();

        const dialog = await this.locateByText(
            'Do you want to exit? The details you have entered will be deleted.'
        );
        await this._page.waitForLoadState('domcontentloaded');

        expect(await dialog.isVisible(), 'check confirm dialog open or not');

        await this.clickConfirmDialogAction('Yes!');
    }

    async openBusinessForm() {
        const button = await this.locateByText('Add Business');

        expect(
            await button.isVisible(),
            'Add Business button not found !! '
        ).toBe(true);

        await button.click();
        console.log(chalk.blue('Open Add Business Form'));
        // await this._page.waitForTimeout(1000);
    }

    async checkModalHeaderTitle() {
        await this.locateByRole('heading');

        expect(
            await this._locator.isVisible(),
            'check modal header title '
        ).toBe(true);
        const text = await this._locator.textContent();
        console.log(chalk.blue('Business Form Header is '), chalk.yellow(text));
    }
    async checkFormIsOpen() {
        // const element = await this.locateByText('Add Business');
        const element = await this._page.getByRole('dialog');
        expect(await element.isVisible(), 'check form is open').toBe(true);
        // await this._page.waitForTimeout(1000);
        await this.checkModalHeaderTitle();

        console.log(chalk.blue('Checking Business Form Is Open Or Not'));
    }

    async fillGstin(gstin: string) {
        await this.fillInput(gstin, { name: 'gstin' });
    }

    async fillMobile(mobile: string) {
        await this.fillInput(mobile, { name: 'mobile' });
    }

    async fillEmail(email: string) {
        await this.fillInput(email, { name: 'email' });
    }

    async fillBusinessInputInformation(
        data: gstinBusinessInformation,
        targetClick: 'email' | 'mobile' | 'gstin' = 'email'
    ) {
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
    async submitButton() {
        const btnClick = this._page.getByRole('button', { name: 'Save' });
        expect(await btnClick.isEnabled(), {
            message: 'check save button enabled',
        }).toBe(true);

        await btnClick.click();
        await this._page.waitForLoadState('networkidle');
        // await this._page.waitForTimeout(1000);
        return btnClick;
    }
    async checkDisableSubmit() {
        const submitButton = await this.submitButton();
        expect(await submitButton.isEnabled(), {
            message: 'check save button disabled',
        }).toBe(false);
    }

    async checkMandatoryFields() {
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

    async checkEmailError(message?: string) {
        const errorMessage = await this.checkInputErrorMessage({
            name: 'email',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }
    async checkMobileError(message?: string) {
        const errorMessage = await this.checkInputErrorMessage({
            name: 'mobile',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }
    async checkGstinError(message?: string) {
        const errorMessage = await this.checkInputErrorMessage({
            name: 'gstin',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }

    async ErrorMessageHandle(message: string, element: any) {
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
    async verifyTableData() {
        //@todo i will do after listing data check framework
        console.log(chalk.blue('Verifying table data'));
    }
    async checkToastMessage() {
        await this._page.waitForTimeout(1000);
        const toast = await this._page.locator('div.ct-toast-success');
        expect(await toast.isVisible(), 'checking toast message').toBe(true);
        const textContent = await toast.textContent();
        console.log(chalk.blue('toast message is '), chalk.green(textContent));
    }
}
