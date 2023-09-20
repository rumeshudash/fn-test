import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { LISTING_ROUTES } from '@/constants/api.constants';
import { vendorGstinInfo } from '@/utils/required_data';
import chalk from 'chalk';

export class BusinessManagedOnboarding extends BaseHelper {
    public vendorBusiness;
    public ignore_next_page: string[] = [];

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
        await expect(this._page, chalk.red('Invite vendor URL')).toHaveURL(
            LISTING_ROUTES.VENDORS
        );
    }
    async verifyAddIcon() {
        const addIcon = this._page.locator(
            "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
        );

        expect(
            await addIcon.isVisible(),
            chalk.red('Add Vendor Icon visibility')
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
            chalk.red('Add vendor account visibility')
        ).toBe(true);
    }

    async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
    }

    async validateCheckbox() {
        const checkbox = this.locate("//input[@type='checkbox']")._locator;
        expect(
            !(await checkbox.isChecked()),
            chalk.red('default checkbox state')
        ).toBe(true);
    }

    async afterSaveAndCreateValidation() {
        // if (!this.ignore_next_page.includes('move_to_next_page')) {
        const email_field = this.locate('input', {
            name: 'email',
        })._locator;
        expect(
            await email_field.inputValue(),
            chalk.red('Email field value')
        ).toBe('');
        const mobile_field = this.locate('input', {
            name: 'mobile',
        })._locator;
        expect(
            await mobile_field.inputValue(),
            chalk.red('Mobile Number field input value')
        ).toBe('');
        // }
    }

    async verifyBusinessManaged() {
        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[1]'
            )._locator.isVisible(),
            chalk.red('Business Managed visibility')
        ).toBe(true);

        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[1]'
            )._locator.innerText(),
            chalk.red('Business Managed match')
        ).toBe('Business Managed');
    }

    async verifyNonGstinStatus() {
        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[2]'
            )._locator.isVisible(),
            chalk.red('Non Gstin Status visibility')
        ).toBe(true);

        expect(
            await this.locate(
                '(//div[contains(@class,"text-center rounded")])[2]'
            )._locator.innerText(),
            chalk.red('Non Gstin Status match')
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
            chalk.red('Vendor Info card visibility')
        ).toBe(true);
        if (await VendorInfocard.isVisible()) await VendorInfocard.click();
    }
    async verifyDisplayName() {
        const displayName = await this._page
            .locator('#display_name')
            .inputValue();
        expect(displayName, chalk.red('Display name match')).toBe(
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
        expect(vendorLocator, chalk.red('Vendor match')).toBe(
            this.vendorBusiness.vendorBusiness
        );
    }
}
