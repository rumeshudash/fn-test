import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';

type gstinDataType = {
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
        const element = await this.locate('div', {
            id: 'gstin_trade_name',
        })._locator;
        await expect(element, {
            message: 'Gstin Trade Name not matched !!',
        }).toHaveText(this.gstin_data.trade_name);
    }
    async checkGstinNumber() {
        const element = await this.locate('div', {
            id: 'gstin_number',
        })._locator;

        await expect(element, {
            message: 'Gstin Address  not matched !!',
        }).toHaveText(this.gstin_data.value);
    }
    async checkAddress() {
        const element = await this.locate('div', {
            id: 'gstin_address',
        })._locator;
        await expect(element, {
            message: 'Gstin Address  not matched !!',
        }).toHaveText(this.gstin_data.address);
    }
    async checkBusinessType() {
        const element = await this.locate('div', {
            id: 'gstin_business_type',
        })._locator;
        await expect(element, {
            message: 'Gstin Business Type  not matched !!',
        }).toHaveText(this.gstin_data.business_type);
    }
    async checkPAN() {
        const element = await this.locate('div', {
            id: 'gstin_pan',
        })._locator;
        await expect(element, {
            message: 'Gstin pan number  not matched !!',
        }).toHaveText(this.gstin_data.pan_number);
    }

    async checkGstinStatus() {
        const element = await this.locate('div', {
            id: 'gstin_status',
        })._locator;
        await expect(element, {
            message: 'Gstin status  not matched !!',
        }).toHaveText(this.gstin_data.status);
    }

    async gstinInfoCheck() {
        await this.checkBusinessName();
        await this.checkGstinNumber();
        await this.checkAddress();
        await this.checkBusinessType();
        await this.checkPAN();
        await this.checkGstinStatus();
    }
}
