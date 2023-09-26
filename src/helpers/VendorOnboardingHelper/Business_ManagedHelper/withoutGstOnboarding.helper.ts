import { BaseHelper } from '@/helpers/BaseHelper/base.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

export const VendorInfoSchema = {
    name: {
        type: 'text',
        required: true,
    },
    type_id: {
        type: 'reference_select',
        required: true,
    },
    pincode: {
        type: 'number',
        required: true,
    },
    address: {
        type: 'textarea',
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
export class WithoutGstinBusinessManagedOnboarding extends BaseHelper {
    public vendorBusiness;
    constructor(vendorBusiness, page) {
        super(page);
        this.vendorBusiness = vendorBusiness;
    }

    public async clickAddVendor(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: linkName })
            .nth(1);
        await partyHover.hover();
        await partyClick.click();
        await this._page.waitForTimeout(2000);
    }

    public async selectClientTradeName() {
        await this.selectOption({
            input: this.vendorBusiness.businessName,
            name: 'business_account_id',
        });
    }

    public async addVendorAccount() {
        await this.fillText(this.vendorBusiness.vendorBusiness, {
            name: 'name',
        });
        await this.fillText(this.vendorBusiness.pinCode, { name: 'pincode' });
        await this._page.waitForTimeout(1000);
        await this.fillText(this.vendorBusiness.address, { name: 'address' });
        await this.selectOption({
            input: this.vendorBusiness.businessType,
            placeholder: 'Search...',
        });
        await this.fillText(this.vendorBusiness.vendorEmail, { name: 'email' });
        await this.fillText(this.vendorBusiness.vendorNumber, {
            name: 'mobile',
        });
    }

    public async uncheckSaveAndCreate() {
        const checkbox = this.locate('label', {
            text: 'save and create another',
        })._locator;
        await checkbox.click();
    }
}
