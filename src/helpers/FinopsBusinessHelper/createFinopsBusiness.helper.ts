import { LISTING_ROUTES } from '@/constants/api.constants';
import { expect } from '@playwright/test';
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
        const element = await this.locate('div', {
            role: 'dialog',
        });
        expect(await element.isVisible(), 'Form is not opened !!').toBe(true);

        // this.checkModalHeaderTitle(element);
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
        await this.fillMobile(data.mobile);
        await this.fillEmail(data.email);
    }

    async checkDisableSubmit() {
        await this.locate('button', {
            text: 'save',
        });

        expect(await this._locator.isVisible(), 'Save button is not found !!');
        expect(await this._locator.isDisabled(), 'Save button is not disabled');
    }

    // async checkWithoutGstinSubmitButtonDisabled(data: {
    //     email: string;
    //     mobile: string;
    // }) {
    //     await this.fillMobile(data.mobile);
    //     await this.fillEmail(data.email);

    //     await this.checkDisableSubmit();
    // }

    // async checkDisableSubmitWithoutEmail(data: {
    //     gstin: string;
    //     mobile: string;
    // }) {
    //     await this.fillGstin(data.gstin);
    //     await this.fillMobile(data.mobile);

    //     await this.checkDisableSubmit();
    // }

    async checkRequiredInputField(labelProps: string) {
        const label = await this.locateByText(labelProps);

        expect(await label.isVisible(), `${labelProps} not found !!`);
        const span = await label.getByText('*');

        await expect(
            await span.isVisible(),
            `${labelProps} is required missing !!`
        ).toBeTruthy();
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
}
