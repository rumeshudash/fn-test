import { expect } from '@playwright/test';
import { BaseHelper } from '../../BaseHelper/base.helper';
import { LISTING_ROUTES } from '@/constants/api.constants';
import { vendorGstinInfo } from '@/utils/required_data';
import chalk from 'chalk';
import { DialogHelper } from '../../BaseHelper/dialog.helper';
import { FormHelper } from '../../BaseHelper/form.helper';
import { NotificationHelper } from '@/helpers/BaseHelper/notification.helper';
import { ListingHelper } from '@/helpers/BaseHelper/listing.helper';

export class BusinessManagedOnboarding extends BaseHelper {
    public form: FormHelper;
    public dialog: DialogHelper;
    public notification: NotificationHelper;
    public listing: ListingHelper;
    constructor(page: any) {
        super(page);
        this.dialog = new DialogHelper(page);
        this.form = new FormHelper(page);
        this.notification = new NotificationHelper(page);
        this.listing = new ListingHelper(page);
    }
    public vendorBusiness;
    public ignore_next_page: string[] = [];

    public async clickVendor(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: linkName })
            .nth(1);
        await partyHover.hover();
        await partyClick.click();
    }
    public async verifyVendorPageURL() {
        await expect(this._page, chalk.red('Invite vendor URL')).toHaveURL(
            LISTING_ROUTES.VENDORS
        );
    }
    public async verifyAddIcon() {
        await this._page.waitForTimeout(3000);
        await this._page.waitForLoadState('domcontentloaded');
        const addIcon = this._page.locator(
            "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
        );

        expect(
            await addIcon.isVisible(),
            chalk.red('Add Vendor Icon visibility')
        ).toBe(true);
    }
    public async clickAddIcon() {
        await this.verifyAddIcon();
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();
    }

    public async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
    }

    public async validateCheckbox() {
        const checkbox = this.locate("//input[@type='checkbox']")._locator;
        expect(
            !(await checkbox.isChecked()),
            chalk.red('default checkbox state')
        ).toBe(true);
    }

    public async afterSaveAndCreateValidation() {
        await this._page.waitForTimeout(1000);
        await this._page.waitForLoadState('networkidle');
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

    private async _parentRow(vendor: string) {
        const row = await this.listing.findRowInTable(vendor, 'NAME');
        return row;
    }

    /**
     * Verifies the business type of a vendor.
     *
     * @param {string} vendor - the name of the vendor
     * @param {string} columnText - the expected business type
     * @return {Promise<void>} - a Promise that resolves when the business type is verified
     */
    public async verifyBusiness(
        vendor: string,
        columnText: string
    ): Promise<void> {
        await this._page.reload();
        await this._page.waitForLoadState('networkidle');
        const row = await this._parentRow(vendor);
        const businessType = await this.listing.getCellText(row, 'TYPE');
        expect(businessType).toBe(columnText);
    }

    public async verifyBusinessManaged() {
        await this._page.waitForTimeout(3000);
        await this._page.waitForLoadState('networkidle');
        await this._page.waitForLoadState('domcontentloaded');
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

    public async verifyNonGstinStatus() {
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
        ).toBe('Non GST Registered');
    }
}
