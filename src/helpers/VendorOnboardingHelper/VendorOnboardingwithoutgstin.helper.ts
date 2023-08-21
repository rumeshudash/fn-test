import chalk from 'chalk';
import { BaseHelper } from '../BaseHelper/base.helper';

let clientBusinessName: string;
export class VendorManagedWithoutGSTIN extends BaseHelper {
    private VENDOR_MANAGED_ONBOARDING_DOM = '//div[text()="Vendor Onboarding"]';
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";
    private INVITATION_DETAILS_DOM =
        "(//div[contains(@class,'flex-1 gap-4')])[2]";
    public VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';

    public async clicknotGSTIN() {
        const helper = this.locate(this.VENDOR_MANAGED_ONBOARDING_DOM);
        await helper.locate("//div[text()='No, I don’t']").click();
        await this._page.waitForTimeout(1000);
    }

    public async fillVendorDetails(data: VENDORDETAILS[] = []) {
        const helper = this.locate(this.VENDOR_MANAGED_ONBOARDING_DOM);
        for (let details of data) {
            await helper.fillText(details.businessName, {
                name: 'name',
            });
            await helper.fillText(details.displayName, {
                name: 'display_name',
            });
            await helper.selectOption({
                input: details.businessType,
                name: 'type_id',
            });
            await helper.fillText(details.pinCode, { name: 'pincode' });
            await helper.fillText(details.address, { name: 'address' });
        }
    }

    public async fillDocuments(data: VENDORDOCUMENTDETAILS[] = []) {
        await this._page.waitForTimeout(1500);
        await this._page.locator("//span[text()=' Add New Document']").click();

        for (let details of data) {
            const inputSelect = this._page.locator(
                `//div[text()='${details.selectInput}']`
            );
            if ((await inputSelect.textContent()) === 'Lower TDS') {
                await this.fillText(details.tdsNumber, {
                    name: 'identifier',
                });
                await this.fillInput(details.date, {
                    name: 'date',
                });
                await this.fillText(details.tdsPercentage, {
                    placeholder: 'Enter Lower TDS Percentage',
                });
            }
            await this.click({ role: 'button', name: 'Save' });
            await this._page.waitForTimeout(2000);

            const plusIcon = this._page.locator(
                "(//div[@class='icon-container cursor-pointer']//i)"
            );
            const plusIconCount = await plusIcon.count();
            if (plusIconCount > 0) {
                await plusIcon.first().click();
                const coiField = await this._page
                    .locator("//input[@placeholder='Enter COI number']")
                    .isVisible();
                if (coiField === true) {
                    await this.fillText('20', { name: 'identifier' });
                    await this.locateByText('Upload Documents').click();
                    await this._page.setInputFiles(
                        "//input[@type='file']",
                        `./images/${details.imagePath}`
                    );

                    await this.click({ role: 'button', name: 'Save' });
                    await this._page.waitForTimeout(2500);
                }
                await this._page
                    .locator('div')
                    .filter({ hasText: /^Pan Cardadd_circle_outline$/ })
                    .locator('i')
                    .click();
                const panCard = await this._page
                    .locator("//input[@placeholder='Enter Pan Card number']")
                    .isVisible();
                if (panCard === true) {
                    await this.fillText('20', { name: 'identifier' });
                    await this.locateByText('Upload Documents').click();
                    await this._page.setInputFiles(
                        "//input[@type='file']",
                        `./images/${details.imagePath}`
                    );
                    await this.click({ role: 'button', name: 'Save' });
                    await this._page.waitForTimeout(2000);
                }
            }
        }
    }

    public async checkBusinessName() {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const businessName = await helper._page
            .locator("//div[contains(@class,'pt-4 text-sm')]")
            .textContent();
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

    public async clientInvitation() {
        await this._page.waitForTimeout(1000);
        const dropdown = this._page
            .locator('#react-select-7-placeholder')
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

    public async fillBankAccount(data: ClientBankAccountDetails[] = []) {
        clientBusinessName = await this._page
            .locator('#account_name')
            .textContent();
        for (let details of data) {
            await this.fillText(details.accountNumber, {
                name: 'account_number',
            });
            await this.fillText(details.accountNumber, {
                name: 're_account_number',
            });
            await this.fillText(details.ifsc, { name: 'ifsc_code' });
            if (details.imagePath) {
                await this._page.setInputFiles(
                    "//input[@type='file']",
                    `./images/${details.imagePath}`
                );
            }
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

    public async checkDoument(title: string) {
        const helper = this.locate(this.VENDORONBOARDINGWITHOUTGSTIN_DOM);
        helper._page
            .locator(`(//div[contains(@class,'border-b cursor-pointer')])`)
            .filter({ hasText: title })
            .click();
        await helper._page.waitForTimeout(1000);
    }
}
