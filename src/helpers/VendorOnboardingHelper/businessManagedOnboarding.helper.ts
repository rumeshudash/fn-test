import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { LISTING_ROUTES, TEST_URL } from '@/constants/api.constants';

export class BusinessManagedOnboarding extends BaseHelper {
    public vendorBusiness;
    constructor(vendorBusiness, page) {
        super(page);
        this.vendorBusiness = vendorBusiness;
    }
    private BUSINESS_MANAGED_ONBOARDING_DOM = '//div[@role="dialog"]';

    async addBusinessManagedVendor() {
        this.locate(this.BUSINESS_MANAGED_ONBOARDING_DOM);
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();

        // for (let details of data) {
        await this.selectOption({
            option: this.vendorBusiness.businessName,
            placeholder: 'Search business name',
        });
        await this.fillText(this.vendorBusiness.gstin, { name: 'gstin' });
        await this.fillText(this.vendorBusiness.vendorEmail, { name: 'email' });
        await this.fillText(this.vendorBusiness.vendorNumber, {
            name: 'mobile',
        });
        // }
    }

    async clickVendor(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: linkName })
            .nth(1);
        await partyHover.hover();
        await partyClick.click();
        await this._page.waitForTimeout(2000);
    }
    async verifyVendorPageURL() {
        await expect(
            this._page,
            'URL is not correct to Invite Vendor '
        ).toHaveURL(LISTING_ROUTES.VENDORS);
    }
}
