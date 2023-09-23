import { BaseHelper } from '@/helpers/BaseHelper/base.helper';
import { vendorGstinInfo } from '@/utils/required_data';
import { expect } from '@playwright/test';
import chalk from 'chalk';
export const VendorSchema = {
    gstin: {
        type: 'text',
        required: true,
    },
    email: {
        type: 'email',
        required: true,
    },
    mobile: {
        type: 'number',
        required: true,
    },
};
export class GstinBusinessManagedOnboarding extends BaseHelper {
    public vendorBusiness;
    // public gstinInfo;
    constructor(vendorBusiness, page) {
        super(page);
        this.vendorBusiness = vendorBusiness;
        // this.gstinInfo = gstinInfo;
    }
    private BUSINESS_MANAGED_ONBOARDING_DOM = '//div[@role="dialog"]';

    public async selectClientTradeName() {
        this.locate(this.BUSINESS_MANAGED_ONBOARDING_DOM);
        await this.selectOption({
            option: this.vendorBusiness.trade_name,
            placeholder: 'Search business name',
        });
    }
    public async fillBusinessDetails() {
        this.locate(this.BUSINESS_MANAGED_ONBOARDING_DOM);

        // await this.gstinVerification();
        await this.fillText(this.vendorBusiness.value, { name: 'gstin' });

        await this.fillText(this.vendorBusiness.vendorEmail, { name: 'email' });
        await this.fillText(this.vendorBusiness.vendorNumber, {
            name: 'mobile',
        });
    }

    public async expandClientInfoCard() {
        const VendorInfocard = this._page.locator(
            "(//div[contains(@class,'items-center justify-between')])[3]"
        );
        expect(
            await VendorInfocard.isVisible(),
            chalk.red('Vendor Info card visibility')
        ).toBe(true);
        if (await VendorInfocard.isVisible()) await VendorInfocard.click();
    }
    public async verifyDisplayName() {
        const displayName = await this._page
            .locator('#display_name')
            .inputValue();
        expect(displayName, chalk.red('Display name match')).toBe(
            vendorGstinInfo.trade_name
        );
    }

    public async editDisplayName(name: string) {
        // await this._page
        //     .locator('#display_name')
        //     .fill(this.vendorBusiness.displayName);

        await this.locate('input', { name: 'display_name' })._locator.fill(
            name
        );
    }
}
