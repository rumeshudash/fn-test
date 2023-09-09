import { LISTING_ROUTES } from '@/constants/api.constants';
import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
interface gstinBusinessInformation {
    gstin: string;
    mobile: string;
    email: string;
}

export default class CreateFinopsBusinessHelper extends BaseHelper {
    async init() {
        const URL = LISTING_ROUTES['BUSINESSESS'];
        await this._page.goto(URL); // go to business page
        await this._page.waitForTimeout(1000);
    }

    async openBusinessForm() {
        const button = await this.locateByText('Add Business');

        expect(
            await button.isVisible(),
            'Add Business button not found !! '
        ).toBe(true);

        await button.click();
        await this._page.waitForTimeout(1000);
    }

    async checkModalHeaderTitle(element: any) {
        const header_element = await element.locateByText('Add Business', {
            selector: 'div',
        });

        expect(
            await header_element.isVisible(),
            'Add Business header not found in form  !!'
        ).toBe(true);
    }
    async checkFormIsOpen() {
        // const element = await this.locateByText('Add Business');
        const element = await this._page.getByRole('dialog');
        expect(await element.isVisible(), 'check form is open').toBe(true);
        await this._page.waitForTimeout(1000);
        // this.checkModalHeaderTitle(element);
    }

    async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
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

    async fillBusinessInputInformation(data: gstinBusinessInformation) {
        await this.fillGstin(data.gstin);
        await this.fillEmail(data.email);
        await this.fillMobile(data.mobile);
        await this.click({
            selector: 'input',
            name: 'email',
        });
    }
    async submitButton() {
        const btnClick = this._page.getByRole('button', { name: 'Save' });
        expect(await btnClick.isEnabled(), {
            message: 'check save button enabled',
        }).toBe(true);

        await btnClick.click();
        await this._page.waitForLoadState('networkidle');
        await this._page.waitForTimeout(1000);
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
    async checkToastMessage() {
        const toast = await this._page.locator('div.ct-toast-success');
        expect(await toast.isVisible(), 'checking toast message').toBe(true);
        const textContent = await toast.textContent();
        console.log('toast message is ', chalk.blue(textContent));
    }
}
