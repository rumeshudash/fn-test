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

    public async init(URL: string) {
        await this._page.goto(URL);
        // 'https://devfn.vercel.app/vendor/register?client=57649556&client_name=New Test Auto'
    }
    public async logOut() {
        await this._page.locator('a').filter({ hasText: 'Logout' }).click();
    }

    public async businessDetails(data: ClientBusinessDetails[] = []) {
        for (let details of data) {
            await this.fillText(details.gstin, {
                placeholder: 'ENTER GSTIN NUMBER',
            });
        }
        await this._page.waitForTimeout(1000);
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
        await this._page.waitForTimeout(2000);
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

    public async clientInvitation(clientGSTIN: string) {
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

            if (await gstinDropdown.isVisible()) {
                await this.selectOption({
                    option: clientGSTIN,
                    placeholder: 'select gstin',
                });
            }
            await this.fillText('vasant02@harbourfront.com', { name: 'poc' });
        }
    }
    public async getClientID() {
        const clientID = await this._page
            .getByPlaceholder('Enter client Id')
            .textContent();
        console.log(chalk.gray('Auto Fetch Client ID: ', clientID));
        return clientID;
    }

    public async getClientIDVisibility() {
        const clientID = await this._page
            .getByPlaceholder('Enter client Id')
            .isVisible();
        console.log(chalk.gray('Auto Fetch Client ID Visibility: ', clientID));
        return clientID;
    }

    //Takes GSTIN from dropdown to compare with Auto Fetched Client GSTIN
    public async getGSTINfromInput() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const gstin = await helper._page
            .locator(
                '(//div[contains(@class,"selectbox-control !bg-base-100")])[3]'
            )
            .textContent();
        console.log(chalk.gray('GSTIN From Input dropdown: ', gstin));
        return gstin;
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
                await this._page.waitForTimeout(1000);
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

    public async checkBusinessNameVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessName = await helper._page
            .locator("//div[contains(@class,'pt-4 text-sm')]")
            .isVisible();
        console.log(
            chalk.gray('Auto Fetch Business Name Visibility: ', businessName)
        );
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

    public async checkGSTINVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const gstin = await helper._page
            .locator("//div[@class='text-xs text-base-secondary']")
            .isVisible();
        console.log(
            chalk.gray('Auto Fetch Business GSTIN Visibility: ', gstin)
        );
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
    public async checkAddressVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const address = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[1]")
            .isVisible();
        console.log(
            chalk.gray('Auto Fetch Business Address Visibility: ', address)
        );
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

    public async checkBusinessTypeVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessType = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[2]")
            .isVisible();
        console.log(
            chalk.gray('Auto Fetch Business Type Visibility: ', businessType)
        );
        return businessType;
    }
    public async checkBusinessDetailsPAN() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const panNumber = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[2]")
            .textContent();
        console.log(chalk.gray('Auto Fetch PAN Number: ', panNumber));
        return panNumber;
    }
    public async checkBusinessDetailsPANVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const panNumber = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[2]")
            .isVisible();
        console.log(chalk.gray('Auto Fetch PAN Number: ', panNumber));
        return panNumber;
    }
    public async checkPAN() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const panNumber = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[3]")
            .textContent();
        console.log(chalk.gray('Auto Fetch PAN Number: ', panNumber));
        return panNumber;
    }

    public async checkPANVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const panNumber = await helper._page
            .locator("(//div[@class='text-xs font-medium ']//span)[3]")
            .isVisible();
        console.log(
            chalk.gray('Auto Fetch PAN Number Visibility: ', panNumber)
        );
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

    public async checkStatusVisibility() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const status = await helper._page
            .locator("//div[contains(@class,'text-center rounded')]")
            .isVisible();
        console.log(
            chalk.gray('Auto Fetch Business Status Visibility: ', status)
        );
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

export class VendorOnboardingWithGSTIN extends BaseHelper {
    public static VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';

    public async checkDoument(title: string) {
        const helper = this.locate(
            VendorOnboardingWithGSTIN.VENDORONBOARDINGWITHOUTGSTIN_DOM
        );
        const container = helper._page
            .locator(`(//div[contains(@class,'border-b cursor-pointer')])`)
            .filter({ hasText: title });
        if (container) {
            await container.click();
            if (title === 'GSTIN Certificate') {
                return helper._page
                    .locator("//p[text()='GST Status']/following-sibling::p")
                    .textContent();
            }
        }
        await helper._page.waitForTimeout(1000);
    }
}

export class BankAccountDetails extends BaseHelper {
    public async bankAccountName() {
        const accountName = await this._page
            .locator('//label[@for="account_name"]/following-sibling::div[1]')
            .textContent();
        console.log('Bank Account Name: ', accountName);
        return accountName;
    }
    public async bankAccountNumber() {
        const account_number = await this._page
            .locator('//div[text()="Account Number"]/following-sibling::div')
            .textContent();
        console.log('Bank Account Number: ', account_number);
        return account_number;
    }
    public async bankIFSCCode() {
        const ifsc_code = await this._page
            .locator("//img[@alt='bank']/following-sibling::p[1]")
            .textContent();
        console.log('Bank Account Number: ', ifsc_code);
        return ifsc_code;
    }

    public async businessDetailsIFSC() {
        const gstin = await this._page
            .locator('//div[text()="IFSC Code"]/following-sibling::div')
            .textContent();
        console.log('Bank Number in Business Details: ', gstin);
        return gstin;
    }
}