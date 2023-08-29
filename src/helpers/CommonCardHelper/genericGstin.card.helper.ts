import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';

export type gstinDataType = {
    trade_name: string;
    address: string;
    status: string;
    pan_number: string;
    business_type: string;
    value: string;
};

export default class GenericGstinCardHelper extends BaseHelper {
    public gstin_data: gstinDataType;

    constructor(gstin_data: gstinDataType, page: any) {
        super(page);
        this.gstin_data = gstin_data;
    }

    async checkBusinessName() {
        const element = this.locate('div', {
            id: 'gstin_trade_name',
        })._locator;
        console.log('Business Name element: ', element);
        expect(await element.isVisible(), 'Gstin Trade Name not found').toBe(
            true
        );
        await expect(element, 'Gstin Trade Name not matched !!').toHaveText(
            this.gstin_data.trade_name
        );
        console.log('Business Name: ', this.gstin_data.trade_name);
    }
    async checkGstinNumber() {
        const element = this.locate('div', {
            id: 'gstin_number',
        })._locator;

        expect(await element.isVisible(), 'Gstin Number not found').toBe(true);
        console.log('GSTIN Value element: ', element);
        await expect(element, 'Gstin Number  not matched !!').toHaveText(
            this.gstin_data.value
        );
        console.log('GSTIN Value: ', this.gstin_data.value);
    }
    async checkAddress() {
        const element = this.locate('span', {
            id: 'gstin_address',
        })._locator;

        expect(await element.isVisible(), 'Gstin  Address not found').toBe(
            true
        );

        await expect(element, 'Gstin Address  not matched !!').toHaveText(
            this.gstin_data.address
        );
    }
    async checkBusinessType() {
        const element = this.locate('span', {
            id: 'gstin_business_type',
        })._locator;
        expect(
            await element.isVisible(),
            'Gstin  business type not found'
        ).toBe(true);
        await expect(element, 'Gstin Business Type  not matched !!').toHaveText(
            this.gstin_data.business_type
        );
    }
    async checkPAN() {
        const element = this.locate('span', {
            id: 'gstin_pan',
        })._locator;
        expect(await element.isVisible(), 'Pan number  not found').toBe(true);
        await expect(element, 'Gstin pan number  not matched !!').toHaveText(
            this.gstin_data.pan_number
        );
    }

    async checkGstinStatus() {
        const element = this.locate('div', {
            id: 'gstin_status',
        })._locator;

        expect(await element.isVisible(), 'Gstin Status  not found').toBe(true);
        await expect(element, 'Gstin status  not matched !!').toHaveText(
            this.gstin_data.status
        );
    }

    async gstinInfoCheck() {
        await this._page.waitForTimeout(2000);
        await this.checkBusinessName();
        await this.checkGstinNumber();
        // await this.checkAddress();
        await this.checkBusinessType();
        await this.checkPAN();
        await this.checkGstinStatus();
    }
}
