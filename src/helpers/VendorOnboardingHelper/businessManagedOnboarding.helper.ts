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
        const email_field = this.locate('input', {
            name: 'email',
        })._locator;
        expect(await email_field.inputValue(), 'Email field is not empty').toBe(
            ''
        );
        const mobile_field = this.locate('input', {
            name: 'mobile',
        })._locator;
        expect(
            await mobile_field.inputValue(),
            'Mobile Number field is not empty'
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

    async verifyNonGstinStatus() {
        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[2]'
            )._locator.isVisible(),
            'Non Gstin Status is not visible'
        ).toBe(true);

        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[2]'
            )._locator.innerText(),
            'Non Gstin Status does not matched'
        ).toBe('Non GSTIN Registered');
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
}

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

    async selectClientTradeName() {
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

    async searchVendor() {
        await this.fillText(this.vendorBusiness.vendorBusiness, {
            placeholder: 'Search ( min: 3 characters )',
        });
        await this._page.waitForTimeout(2000);
    }

    async verifyVendorInList() {
        const vendorLocator = await this._page
            .locator("(//a[contains(@class,'cursor-pointer link')]//span)[1]")
            .textContent();
        expect(vendorLocator, 'Vendor is not listed').toBe(
            this.vendorBusiness.vendorBusiness
        );
    }
}
