import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { SavedExpenseCreation } from '../ExpenseHelper/savedExpense.helper';

export class VendorOnboarding extends BaseHelper {
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";
    public async clickLink(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: 'Vendor Invitations' })
            .nth(1);
        await partyHover.hover();
        await this._page.waitForTimeout(1000);
        await partyClick.click();
    }

    public async clickCopyLink() {
        await this.click({
            role: 'button',
            name: 'add_circle_outline Invite Vendor',
        });
        const linkDialog = this._page.getByRole('dialog');
        if (await linkDialog.isVisible()) {
            await this._page
                .locator(
                    "//span[contains(@class,'px-3 overflow-hidden')]/following-sibling::div[1]"
                )
                .click();
        }
    }

    public async linkURL() {
        return await this._page
            .locator("//span[contains(@class,'px-3 overflow-hidden')]")
            .textContent();
    }

    public async closeDialog() {
        await this._page
            .locator("//button[contains(@class,'absolute right-4')]")
            .click();
        await this._page.waitForTimeout(1000);
    }
    public async toastMessage() {
        return this._page.locator("//div[@role='status']").textContent();
    }

    public async init(URL: string) {
        await this._page.goto(URL);
        // 'https://devfn.vercel.app/vendor/register?client=57649556&client_name=New Test Auto'
    }
    public async logOut() {
        await this._page.locator('a').filter({ hasText: 'Logout' }).click();
    }
    public async clickButton(buttonName: string) {
        await this._page.getByRole('button', { name: buttonName }).click();
        await this._page.waitForTimeout(2000);
    }

    public async businessDetails(data: ClientBusinessDetails[] = []) {
        for (let details of data) {
            await this.fillText(details.businessName, {
                placeholder: 'Enter display name',
            });
            await this.fillText(details.gstin, {
                placeholder: 'Enter GSTIN number',
            });
        }
    }
    public async bankAccount(data: ClientBankAccountDetails[] = []) {
        for (let details of data) {
            await this.fillText(details.accountNumber, {
                name: 'account_number',
            });
            await this.fillText(details.accountNumber, {
                name: 're_account_number',
            });
            await this.fillText(details.ifsc, {
                name: 'ifsc_code',
            });
        }
    }
    public async uploadDocument(data: UploadDocuments[] = []) {
        await this._page.waitForTimeout(2000);
        await this.click({ role: 'button', name: ' Add New Document' });
        const dialog = this._page.locator("//div[@role='dialog']");
        if ((await dialog.isVisible()) === true) {
            for (let details of data) {
                await this.fillText(details.tdsCert, {
                    placeholder: 'Enter TDS Certificate Number',
                });
                await this.fillText(details.tdsPercentage, {
                    placeholder: 'Enter Lower TDS Percentage',
                });
                await this._page.locator('#date').click();
                await this._page
                    .locator("button:has-text('20')")
                    .first()
                    .click();
            }
        }
    }

    public async fileUpload(imagePath: string) {
        await this._page.setInputFiles(
            "//input[@type='file']",
            `./images/${imagePath}`
        );
        await this._page.waitForTimeout(2000);
    }

    public async clientInvitation(imagePath?: string) {
        const dropdown = this._page
            .locator('#react-select-4-placeholder')
            .filter({ hasText: 'Select Your Business' });
        if (await dropdown.isVisible()) {
            await this.selectOption({
                option: 'Refop',
                placeholder: 'Select Your Business',
            });
            await this.click({ role: 'button', name: 'Next' });
        } else {
            await this.click({ role: 'button', name: 'Next' });
            await this._page.waitForTimeout(2000);
        }
        for (let i = 1; i < 5; i++) {
            const imageIcon = this._page.locator(
                `(//div[@class='icon-container cursor-pointer'])[${i}]`
            );
            if (await imageIcon.isVisible()) {
                await imageIcon.click();
                await this._page.setInputFiles(
                    "//input[@type='file']",
                    `./images/${imagePath}`
                );
                await this._page.waitForTimeout(2000);
                await this.click({ role: 'button', name: 'Save' });

                if (
                    await this._page
                        .getByPlaceholder('Enter MSME number')
                        .isVisible()
                ) {
                    await this.fillText('22', {
                        placeholder: 'Enter MSME number',
                    });
                    await this.click({ role: 'button', name: 'Save' });
                }
            }
        }

        await this.click({ role: 'button', name: 'Submit' });
    }

    public async checkBusinessName() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessName = await helper._page
            .locator("//div[contains(@class,'pt-4 text-sm')]")
            .textContent();
        console.log('Auto Fetch Business Name: ', businessName);
        return businessName;
    }
    public async checkGSTIN() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const gstin = await helper._page
            .locator("//div[@class='text-xs text-base-secondary']")
            .textContent();
        console.log('Auto Fetch Business GSTIN: ', gstin);
        return gstin;
    }

    public async checkAddress() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const address = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[1]")
            .textContent();
        console.log('Auto Fetch Business Address: ', address);
        return address;
    }
    public async checkBusinessType() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessType = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[2]")
            .textContent();
        console.log('Auto Fetch Business Type: ', businessType);
        return businessType;
    }

    public async checkPAN() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const panNumber = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[3]")
            .textContent();
        console.log('Auto Fetch PAN Number: ', panNumber);
        return panNumber;
    }

    public async checkStatus() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const status = await helper._page
            .locator("//div[contains(@class,'text-center rounded')]")
            .textContent();
        console.log('Auto Fetch Business Status: ', status);
        return status;
    }
}
