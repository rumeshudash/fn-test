import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';

let clientBusinessName: string;
export class VendorOnboarding extends BaseHelper {
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";
    public async clickLink(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: linkName })
            .nth(1);
        await partyHover.hover();
        await partyClick.click();
        await this._page.waitForTimeout(2000);
    }

    public async clickCopyLink() {
        await this.click({
            role: 'button',
            name: 'Invite Vendor',
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
    }
    public async toastMessage() {
        const toast = this._page.locator('div.ct-toast-success');
        const toastError = this._page.locator('div.ct-toast.ct-toast-error');
        const toastWarn = this._page.locator('div.ct-toast.ct-toast-warn');

        const toastErrorCount = await toastError.count();
        const toastWarnCount = await toastWarn.count();
        if (toastWarnCount > 0) {
            console.log(
                chalk.red(
                    `Multiple toastMessage ocurred \n ${toastWarn}:`,
                    toastWarnCount
                )
            );
            for (let i = 0; i < toastWarnCount; i++) {
                const errorMsg = await toastWarn.nth(i).textContent();
                console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
            }
        }
        if (toastErrorCount > 0) {
            console.log(
                chalk.red(
                    `Multiple toastMessage ocurred \n ${toastError}:`,
                    toastErrorCount
                )
            );
            for (let i = 0; i < toastErrorCount; i++) {
                const errorMsg = await toastError.nth(i).textContent();
                console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
            }
        }

        return await toast.last().textContent();
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
        await this._page.waitForTimeout(1000);
    }

    public async businessDetails(data: ClientBusinessDetails[] = []) {
        for (let details of data) {
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
        await this._page.waitForTimeout(1000);
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

    public async clientInvitation() {
        await this._page.waitForTimeout(1000);
        const dropdown = this._page
            .locator('#react-select-4-placeholder')
            .filter({ hasText: 'Select Your Business' });
        const gstinDropdown = this._page
            .locator('#react-select-6-placeholder')
            .filter({ hasText: 'Select gstin' });

        if (await dropdown.isVisible()) {
            await this.selectOption({
                option: clientBusinessName,
                placeholder: 'Select Your Business',
            });
            const clientID = await this._page
                .getByPlaceholder('Enter client Id')
                .textContent();

            console.log(chalk.gray('Auto Fetch Client ID: ', clientID));
            if (await gstinDropdown.isVisible()) {
                await this.selectOption({
                    option: '33AACC',
                    placeholder: 'select gstin',
                });
            }
            await this.fillText('vasant02@harbourfront.com', { name: 'poc' });
        }
    }

    public async uploadImageDocuments(imagePath: string) {
        await this._page.waitForTimeout(2000);
        const documentError = this._page.locator('div.text-xs.text-error');
        const errorCount = await documentError.count();

        console.log('Document Image Error: ', errorCount);
        for (let i = 0; i < errorCount; i++) {
            console.log(
                'Document Image Error: ',
                chalk.red(await documentError.nth(i).textContent())
            );
        }
        //Upload Document
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
                await this._page.waitForTimeout(1000);

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
    }
    public async checkBusinessName() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessName = await helper._page
            .locator("//div[contains(@class,'pt-4 text-sm')]")
            .textContent();
        clientBusinessName = businessName;
        console.log(chalk.gray('Auto Fetch Business Name: ', businessName));
        return businessName;
    }
    public async checkGSTIN() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const gstin = await helper._page
            .locator("//div[@class='text-xs text-base-secondary']")
            .textContent();
        console.log(chalk.gray('Auto Fetch Business GSTIN: ', gstin));
        return gstin;
    }

    public async checkAddress() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const address = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[1]")
            .textContent();
        console.log(chalk.gray('Auto Fetch Business Address: ', address));
        return address;
    }
    public async checkBusinessType() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessType = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[2]")
            .textContent();
        console.log(chalk.gray('Auto Fetch Business Type: ', businessType));
        return businessType;
    }

    public async checkPAN() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const panNumber = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[3]")
            .textContent();
        console.log(chalk.gray('Auto Fetch PAN Number: ', panNumber));
        return panNumber;
    }

    public async checkStatus() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const status = await helper._page
            .locator("//div[contains(@class,'text-center rounded')]")
            .textContent();
        console.log(chalk.gray('Auto Fetch Business Status: ', status));
        return status;
    }
}

export class VendorInvitationDetails extends BaseHelper {
    private INVITATION_DETAILS_DOM =
        "(//div[contains(@class,'flex-1 gap-4')])[2]";

    public async checkFrom() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("(//div[contains(@class,'flex-1 gap-1')]//div)[1]")
            .textContent();
    }
    public async checkFromGSTIN() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'text-xs text-base-tertiary')]")
            .textContent();
    }
    public async checkClient() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'inline-block w-3/4')]")
            .textContent();
    }

    public async checkClientGSTIN() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'text-xs cursor-pointer')]")
            .textContent();
    }
}

export class VendorOnboardingWithoutGSTIN extends BaseHelper {
    public static VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';

    public async checkDoument(title: string) {
        const helper = this.locate(
            VendorOnboardingWithoutGSTIN.VENDORONBOARDINGWITHOUTGSTIN_DOM
        );
        helper._page
            .locator(`(//div[contains(@class,'border-b cursor-pointer')])`)
            .filter({ hasText: title })
            .click();
        await helper._page.waitForTimeout(1000);
    }
}
