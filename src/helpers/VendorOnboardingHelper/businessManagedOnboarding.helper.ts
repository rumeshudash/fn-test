import { BaseHelper } from '../BaseHelper/base.helper';

export class BusinessManagedOnboarding extends BaseHelper {
    private BUSINESS_MANAGED_ONBOARDING_DOM = '//div[@role="dialog"]';

    public async addBusinessManagedVendor(
        data: BUSINESSMANAGEDONBOARDING[] = []
    ) {
        this.locate(this.BUSINESS_MANAGED_ONBOARDING_DOM);
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();

        for (let details of data) {
            await this.selectOption({
                option: details.businessName,
                placeholder: 'Search business name',
            });
            await this.fillText(details.gstin, { name: 'gstin' });
            await this.fillText(details.vendorEmail, { name: 'email' });
            await this.fillText(details.vendorNumber, { name: 'mobile' });
        }
    }

    public async clickVendor(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: linkName })
            .nth(1);
        await partyHover.hover();
        await partyClick.click();
        await this._page.waitForTimeout(2000);
    }

    public async clickButton(buttonName: string) {
        await this._page.getByRole('button', { name: buttonName }).click();
        await this._page.waitForTimeout(1000);
    }
}
