import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { LISTING_ROUTES, TEST_URL } from '@/constants/api.constants';
import { vendorGstinInfo } from '@/utils/required_data';

export class BusinessManagedOnboarding extends BaseHelper {
    public vendorBusiness;
    public ignore_next_page: string[] = [];
    constructor(page) {
        super(page);
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
    async verifyAddIcon() {
        const addIcon = this._page.locator(
            "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
        );

        expect(
            await addIcon.isVisible(),
            'Add Vendor Icon is not visible'
        ).toBe(true);
    }
    async clickAddIcon() {
        await this.verifyAddIcon();
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();
        await this.verifyDialog();
    }

    async verifyDialog() {
        expect(
            await this._page
                .locator("//div[text()='Add Vendor Account']")
                .isVisible(),
            ' Add Vendor Account does not found'
        ).toBe(true);
    }

    async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
    }

    async validateCheckbox() {
        const checkbox = await this.locate("//input[@type='checkbox']")
            ._locator;
        expect(
            !(await checkbox.isChecked()),
            'By default checkbox should be unchecked'
        ).toBe(true);
    }

    async saveAndCreateCheckbox() {
        await this.validateCheckbox();
        const checkbox = this.locate("//input[@type='checkbox']")._locator;
        await checkbox.click();
    }

    async afterSaveAndCreateValidation() {
        // if (!this.ignore_next_page.includes('move_to_next_page')) {
        const input_filed_locator = this.locate('input', {
            name: 'gstin',
        })._locator;
        expect(
            await input_filed_locator.inputValue(),
            'GSTIN field is not empty'
        ).toBe('');
        // }
    }

    async verifyBusinessManaged() {
        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[1]'
            )._locator.isVisible(),
            'Business Managed is not visible'
        ).toBe(true);

        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[1]'
            )._locator.innerText(),
            'Business Managed does not matched'
        ).toBe('Business Managed');
    }
}

export class GstinBusinessManagedOnboarding extends BaseHelper {
    public vendorBusiness;
    // public gstinInfo;
    constructor(vendorBusiness, page) {
        super(page);
        this.vendorBusiness = vendorBusiness;
        // this.gstinInfo = gstinInfo;
    }
    private BUSINESS_MANAGED_ONBOARDING_DOM = '//div[@role="dialog"]';

    async selectClientTradeName() {
        this.locate(this.BUSINESS_MANAGED_ONBOARDING_DOM);
        await this.selectOption({
            option: this.vendorBusiness.trade_name,
            placeholder: 'Search business name',
        });
    }
    async fillBusinessDetails() {
        this.locate(this.BUSINESS_MANAGED_ONBOARDING_DOM);

        // await this.gstinVerification();
        await this.fillText(this.vendorBusiness.value, { name: 'gstin' });

        await this.fillText(this.vendorBusiness.vendorEmail, { name: 'email' });
        await this.fillText(this.vendorBusiness.vendorNumber, {
            name: 'mobile',
        });
    }

    async expandClientInfoCard() {
        const VendorInfocard = this._page.locator(
            "(//div[contains(@class,'items-center justify-between')])[3]"
        );
        expect(
            await VendorInfocard.isVisible(),
            'Vendor Info card is not visible'
        ).toBe(true);
        if (await VendorInfocard.isVisible()) await VendorInfocard.click();
    }
    async verifyDisplayName() {
        const displayName = await this._page
            .locator('#display_name')
            .inputValue();
        expect(displayName, 'Display name is not matching').toBe(
            vendorGstinInfo.trade_name
        );
    }

    async editDisplayName() {
        const displayName = await this._page
            .locator('#display_name')
            .fill(this.vendorBusiness.displayName);
    }

    // async gstinVerification() {
    //     //trade name verification
    //     await expect(
    //         this._page.locator('#gstin_trade_name'),
    //         'Trade Name not Visible'
    //     ).toBeVisible();
    //     expect(
    //         await this._page.locator('#gstin_trade_name').innerText(),
    //         'Trade name does not matched'
    //     ).toBe(this.gstinInfo.trade_name);

    //     //gstin verification
    //     await expect(
    //         this._page.locator('#gstin_number'),
    //         'Gstin number not Visible'
    //     ).toBeVisible();
    //     expect(
    //         await this._page.locator('#gstin_number').innerText(),
    //         'Gstin number does not matched'
    //     ).toBe(this.gstinInfo.value);

    //     //status verification
    //     await expect(
    //         this._page.locator('#gstin_status'),
    //         'Gstin status is not Visible'
    //     ).toBeVisible();
    //     expect(
    //         await this._page.locator('#gstin_status').innerText(),
    //         'Gstin status does not matched'
    //     ).toBe(this.gstinInfo.status);
    // }
}
