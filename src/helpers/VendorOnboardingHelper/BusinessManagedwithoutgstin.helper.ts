import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';

export class OnboardingWithoutGSTIN extends BaseHelper {
    private ONBOARDING_WITHOUT_GSTIN_DOM = '//div[@role="dialog"]';

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

    public async addVendorAccount(data: VENDORACCOUNTDETAILS[] = []) {
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();
        this.locate(this.ONBOARDING_WITHOUT_GSTIN_DOM);
        this.locate("//span[text()='Non GSTIN Registered']").click();
        await this._page.waitForTimeout(1000);
        for (let info of data) {
            await this.selectOption({
                input: info.businessName,
                name: 'business_account_id',
            });
            await this.fillText(info.vendorBusiness, {
                name: 'name',
            });
            await this.fillText(info.displayName, { name: 'display_name' });
            await this.fillText(info.pinCode, { name: 'pincode' });
            await this._page.waitForTimeout(1000);
            await this.fillText(info.address, { name: 'address' });
            await this.selectOption({
                input: info.businessType,
                placeholder: 'Search...',
            });
            await this.fillText(info.vendorEmail, { name: 'email' });
            await this.fillText(info.vendorNumber, { name: 'mobile' });
        }
    }
}
