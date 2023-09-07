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
    public ignore_test_fields: string[] = [];

    constructor(gstin_data: gstinDataType, page: any) {
        super(page);
        this.gstin_data = gstin_data;
    }

    // private static PARENT_LOCATOR =
    //     `//div[@id="gstin_trade_name"][contains(text(), "${this.gstin_data.trade_name}")]/parent::div/parent::div`;

    async gstinCardParentLocator() {
        return this.locate(
            `//div[@id="gstin_trade_name"][contains(text(), "${this.gstin_data.trade_name}")]/parent::div/parent::div`
        );
    }
    async gstinCardParentLocatorHidden() {
        return this.locate(
            `//div[@id="gstin_trade_name"][contains(text(), "${this.gstin_data.trade_name}")]/parent::div/parent::div/parent::div`
        );
    }
    async checkBusinessName() {
        const parentLocator = this.gstinCardParentLocator();
        const element = (await parentLocator)
            .getLocator()
            .locator('//div[@id="gstin_trade_name"]');
        expect(await element.isVisible(), 'Gstin Trade Name not visible').toBe(
            true
        );
        await expect(element, 'Gstin Trade Name not matched !!').toHaveText(
            this.gstin_data.trade_name
        );
    }
    async checkGstinNumber() {
        const parentLocator = this.gstinCardParentLocator();
        const element = (await parentLocator)
            .getLocator()
            .locator('//div[@id="gstin_number"]');
        expect(await element.isVisible(), 'Gstin Number not found').toBe(true);
        await expect(element, 'Gstin Number  not matched !!').toHaveText(
            this.gstin_data.value
        );
    }
    async checkAddress() {
        const parentLocator = this.gstinCardParentLocatorHidden();
        const element = (await parentLocator)
            .getLocator()
            .locator('//span[@id="gstin_address"]');

        expect(await element.isVisible(), 'Gstin  Address not found').toBe(
            true
        );

        await expect(element, 'Gstin Address  not matched !!').toHaveText(
            this.gstin_data.address
        );
    }
    async checkBusinessType() {
        const parentLocator = this.gstinCardParentLocatorHidden();
        const element = (await parentLocator)
            .getLocator()
            .locator("//span[contains(@id, 'gstin_business_type')]");

        expect(
            await element.isVisible(),
            'Gstin  business type not found'
        ).toBe(true);
        await expect(element, 'Gstin Business Type  not matched !!').toHaveText(
            this.gstin_data.business_type
        );
    }
    async checkPAN() {
        const parentLocator = this.gstinCardParentLocatorHidden();
        const element = (await parentLocator)
            .getLocator()
            .locator('//span[contains(@id, "gstin_pan")]');

        expect(await element.isVisible(), 'Pan number  not found').toBe(true);
        await expect(element, 'Gstin pan number  not matched !!').toHaveText(
            this.gstin_data.pan_number
        );
    }

    async checkGstinStatus() {
        const parentLocator = this.gstinCardParentLocator();
        const element = (await parentLocator)
            .getLocator()
            .locator("//div[contains(@id, 'gstin_status')]");

        expect(await element.isVisible(), 'Gstin Status  not found').toBe(true);
        await expect(element, 'Gstin status  not matched !!').toHaveText(
            this.gstin_data.status
        );
    }

    async gstinInfoCheck() {
        await this._page.waitForTimeout(2000);
        if (!this.ignore_test_fields.includes('gstin_business_name'))
            await this.checkBusinessName();
        if (!this.ignore_test_fields.includes('gstin_business_number'))
            await this.checkGstinNumber();
        if (!this.ignore_test_fields.includes('gstin_business_address'))
            await this.checkAddress();
        if (!this.ignore_test_fields.includes('gstin_business_type'))
            await this.checkBusinessType();
        if (!this.ignore_test_fields.includes('gstin_business_pan'))
            await this.checkPAN();
        if (!this.ignore_test_fields.includes('gstin_business_status'))
            await this.checkGstinStatus();
    }
}
