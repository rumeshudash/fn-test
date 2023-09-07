import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import GenericGstinCardHelper from '../CommonCardHelper/genericGstin.card.helper';
import { expect, test } from '@playwright/test';
import {
    COI_NUMBER,
    IMAGE_NAME,
    MSME_NUMBER,
    PAN_CARD,
    PAN_CODE_ADDRESS,
    clientGstinInfo,
    vendorGstinInfo,
} from '@/utils/required_data';
import GenericNonGstinCardHelper, {
    nonGstinDataType,
} from '../CommonCardHelper/genericNonGstin.card.helper';

let getDate: string;
let clientBusinessName: string;
export class VendorOnboarding extends BaseHelper {
    public lowerTDS;
    constructor(lowerTDS, page) {
        super(page);
        this.lowerTDS = lowerTDS;
    }
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";

    public async clickCopyLink() {
        await this.click({
            role: 'button',
            name: 'Invite Vendor',
        });
        const linkDialog = this._page.getByRole('dialog');
        expect(await linkDialog.isVisible(), 'Link Dialog not found').toBe(
            true
        );
        if (await linkDialog.isVisible()) {
            await this._page
                .locator(
                    "//span[contains(@class,'px-3 overflow-hidden')]/following-sibling::div[1]"
                )
                .click();
        }
    }

    public async linkURL() {
        const linkInput = this._page.locator(
            "//span[contains(@class,'px-3 overflow-hidden')]"
        );
        expect(await linkInput.isVisible(), 'Link Input not found').toBe(true);
        return await linkInput.textContent();
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

    // public async bankAccount(data: ClientBankAccountDetails[] = []) {
    //     const bankAccountName = await this._page
    //         .locator('#account_name')
    //         .inputValue();
    //     expect(
    //         bankAccountName,
    //         'Bank Account Name doest not match to Vendor'
    //     ).toBe(vendorGstinInfo.trade_name);

    //     for (let details of data) {
    //         await this.fillText(details.accountNumber, {
    //             name: 'account_number',
    //         });
    //         await this.fillText(details.accountNumber, {
    //             name: 're_account_number',
    //         });
    //         await this.fillText(details.ifsc, {
    //             name: 'ifsc_code',
    //         });
    //     }
    //     await this._page.waitForTimeout(2000);
    // }

    // public async uploadDocument(data: UploadDocuments[] = []) {
    //     await this._page.waitForTimeout(1000);
    //     const addDocumentBtn = this._page.getByRole('button', {
    //         name: ' Add New Document',
    //     });

    //     await expect(
    //         addDocumentBtn,
    //         'Add New Document button not visible'
    //     ).toBeVisible();

    //     await this.click({ role: 'button', name: ' Add New Document' });
    //     const dialog = this._page.locator("//div[@role='dialog']");
    //     if ((await dialog.isVisible()) === true) {
    //         for (let details of data) {
    //             await this.fillText(details.tdsCert, {
    //                 placeholder: 'Enter TDS Certificate Number',
    //             });
    //             await this.fillText(details.tdsPercentage, {
    //                 placeholder: 'Enter Lower TDS Percentage',
    //             });
    //             await this._page.locator('#date').fill(PICK_DATE);
    //             getDate = await this._page.locator('#date').inputValue();
    //             // await this._page
    //             //     .locator("button:has-text('20')")
    //             //     .first()
    //             //     .click();
    //         }
    //     }
    // }
    async fillDocuments() {
        await this._page.waitForTimeout(1500);

        await expect(
            await this._page.locator("//span[text()=' Add New Document']"),
            'Add New Document is not Visible'
        ).toBeVisible();
        await this.clickButton('Add New Document');

        // for (let details of data) {
        const inputSelect = this._page.locator(
            `//div[text()='${this.lowerTDS.selectInput}']`
        );
        if ((await inputSelect.textContent()) === 'Lower TDS') {
            await this.fillText(this.lowerTDS.tdsCertNumber, {
                name: 'identifier',
            });
            await this.fillInput(this.lowerTDS.date, {
                name: 'date',
            });
            getDate = await this._page.locator('#date').inputValue();
            await this.fillText(this.lowerTDS.tdsPercentage, {
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
                    `./images/${IMAGE_NAME}`
                );
                await this.click({ role: 'button', name: 'Save' });
                await this._page.waitForTimeout(2000);
            }

            const panCard = await this._page
                .locator("//input[@placeholder='Enter Pan Card number']")
                .isVisible();
            if (panCard === true) {
                await this.fillText(PAN_CARD, { name: 'identifier' });
                await this.locateByText('Upload Documents').click();
                await this._page.setInputFiles(
                    "//input[@type='file']",
                    `./images/${IMAGE_NAME}`
                );
                await this.click({ role: 'button', name: 'Save' });
                await this._page.waitForTimeout(2000);
            }
            // }
        }
    }
    public async fileUpload(imagePath: string) {
        await this._page.setInputFiles(
            "//input[@type='file']",
            `./images/${imagePath}`
        );
        await this._page.waitForTimeout(2000);
    }

    public async clientInvitation(businessName: string, clientGSTIN: string) {
        await this._page.waitForTimeout(1000);
        const dropdown = this._page.locator(
            '//div[text()="Select Your Business"]'
        );

        const gstinDropdown = this._page.locator(
            '//div[text()="Select client business"]'
        );

        if (await dropdown.isVisible()) {
            expect
                .soft(
                    await dropdown.textContent(),
                    'Business Information is not auto fetched'
                )
                .toBe(vendorGstinInfo.trade_name);

            await this.selectOption({
                option: businessName,
                placeholder: 'Select Your Business',
            });

            expect
                .soft(
                    await gstinDropdown.textContent(),
                    'Client Information is not auto fetched'
                )
                .toBe(clientGstinInfo.trade_name);
        }
        if (await gstinDropdown.isVisible()) {
            await this.selectOption({
                input: clientGstinInfo.value,
                placeholder: 'Select client business',
            });
        }
        await this._page.waitForTimeout(1000);
        await this.fillText('vasant02@harbourfront.com', { name: 'poc' });
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
        const container = this._page.locator(
            "(//div[contains(@class,'py-3 gap-1')])"
        );

        const documentError = this._page.locator(
            '//div[@class="text-xs text-error"]'
        );
        const containerBtn = this._page.locator(
            '//div[@class="icon-container cursor-pointer"]'
        );
        const errorContainer = container.filter({ has: documentError });

        const errorContainerCount = await errorContainer.count();
        console.log('Document Image Error: ', errorContainerCount);

        for (let i = 0; i < errorContainerCount; i++) {
            console.log(
                'Document Image Error: ',
                chalk.red(await documentError.first().textContent()) +
                    ' Editable: ' +
                    chalk.blue(
                        (await errorContainer.first().textContent()).includes(
                            'files'
                        )
                    )
            );

            if (errorContainer) {
                const filesTextError = (
                    await errorContainer.first().innerText()
                ).includes('files');

                if (filesTextError) {
                    await errorContainer.getByRole('img').first().click();
                } else {
                    await errorContainer.locator('i').first().click();
                }
                await this._page.setInputFiles(
                    "//input[@type='file']",
                    `./images/${imagePath}`
                );
                await this._page.waitForTimeout(1000);

                if (
                    await this._page
                        .getByPlaceholder('Enter MSME number')
                        .isVisible()
                ) {
                    await this.fillText(MSME_NUMBER, {
                        placeholder: 'Enter MSME number',
                    });
                }

                if (
                    await this._page
                        .getByPlaceholder('Enter COI number')
                        .isVisible()
                ) {
                    await this.fillText(COI_NUMBER, {
                        placeholder: 'Enter COI number',
                    });
                }
                await this.click({ role: 'button', name: 'Save' });
                await this._page.waitForTimeout(2000);
            }
        }
    }
}

export class VendorOnboardingWithGSTIN extends GenericGstinCardHelper {
    public static VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';
    public async fillGstinInput() {
        await expect(
            this._page.getByPlaceholder('ENTER GSTIN NUMBER'),
            'Gstin input field is not visible'
        ).toBeVisible();
        await this.fillText(this.gstin_data.value, {
            placeholder: 'ENTER GSTIN NUMBER',
        });
    }
    public async gstinDisplayName() {
        const display_name = await this._page
            .locator('#display_name')
            .inputValue();
        expect(display_name, {
            message: 'Display name is not matching to vendor',
        }).toBe(vendorGstinInfo.trade_name);
    }
}
export class VendorManagedWithoutGSTIN extends GenericNonGstinCardHelper {
    private VENDOR_MANAGED_ONBOARDING_DOM = '//div[text()="Vendor Onboarding"]';
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";
    private INVITATION_DETAILS_DOM =
        "(//div[contains(@class,'flex-1 gap-4')])[2]";
    public static VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';

    public async fillVendorDetails(data: nonGstinDataType[] = []) {
        const helper = this.locate(this.VENDOR_MANAGED_ONBOARDING_DOM);
        for (let details of data) {
            await expect(
                await helper.locate('#name')._locator.isVisible(),
                'Name field is not Visible'
            ).toBe(true);

            await helper.fillText(details.trade_name, {
                name: 'name',
            });
            await expect
                .soft(
                    await helper.locate('#display_name')._locator.isVisible(),
                    'Display Name field is not Visible'
                )
                .toBe(true);

            await helper.fillText(details.display_name, {
                name: 'display_name',
            });

            expect
                .soft(
                    await helper
                        .locate('input', { name: 'type_id' })
                        ._locator.isVisible(),
                    'Business Type field is not Visible'
                )
                .toBe(true);

            await helper.selectOption({
                input: details.business_type,
                name: 'type_id',
            });

            await expect(
                await helper.locate('#pincode')._locator.isVisible(),
                'Pincode field is not Visible'
            ).toBe(true);

            await helper.fillText(details.pin_code, { name: 'pincode' });

            await expect(
                await helper.locate('#address')._locator.isVisible(),
                'Address field is not Visible'
            ).toBe(true);

            await helper.fillText(details.address, { name: 'address' });

            await this.checkWizardNavigationClickDocument('Documents');
            expect(
                await helper.locate('#name')._locator.inputValue(),
                'Name field is required'
            ).not.toBeNull();

            expect(
                await helper.locate('#name')._locator.inputValue(),
                'Name field does not matched'
            ).toBe(details.trade_name);

            expect
                .soft(
                    await helper.locate('#display_name')._locator.inputValue(),
                    'Display Name field is empty'
                )
                .not.toBeNull();

            expect(
                await this._page
                    .locator('//div[contains(@class,"mt-2 text-sm")]')
                    .isVisible(),
                'Pin Code Address does not found'
            ).toBe(true);

            expect(
                await this._page
                    .locator('//div[contains(@class,"mt-2 text-sm")]')
                    .textContent(),
                'Pin Code Address does not matched'
            ).toBe(PAN_CODE_ADDRESS);
            expect(
                (await helper.locate('#pincode')._locator.inputValue()).length,
                'Pincode field is must be 6 digits'
            ).toBeGreaterThan(5);

            expect.soft(
                await this._page
                    .locator('//div[contains(@class,"mt-2 text-sm")]')
                    .isVisible(),
                'Pin Code Address  is not Visible'
            );

            expect(
                (await helper.locate('#address')._locator.inputValue()).length,
                'Address field is empty'
            ).not.toBe(0);
        }
    }
}

export class BankAccountDetails extends BaseHelper {
    public bankDetails;
    constructor(bankDetails, page) {
        super(page);
        this.bankDetails = bankDetails;
    }
    // validate bank account name with business name
    async validateBankAccountName() {
        expect(
            await this._page.locator('#account_name').isVisible(),
            'Bank Name is not visible'
        ).toBe(true);

        const clientBusinessName = await this._page
            .locator('#account_name')
            .inputValue();
        expect(clientBusinessName, 'Bank Name does not matched').toBe(
            this.bankDetails.bankName
        );
    }

    // Check if a button with the name 'Next' is visible and clickable on the page
    async isBtnVisible() {
        expect(
            await this._page.getByRole('button', { name: 'Next' }).isEnabled(),
            'Next button is not clickable'
        ).toBe(true);
    }
    async fillBankAccount() {
        await this.fillText(this.bankDetails.accountNumber, {
            name: 'account_number',
        });
        await this.fillText(this.bankDetails.accountNumber, {
            name: 're_account_number',
        });
        await this.fillText(this.bankDetails.ifsc, { name: 'ifsc_code' });
        if (IMAGE_NAME) {
            await this._page.setInputFiles(
                "//input[@type='file']",
                `./images/${IMAGE_NAME}`
            );
        }
        await this.isBtnVisible();
    }
    async vendorIfscLogoVisibilityValidation() {
        const iconLocator = this.locate('//img[@alt="bank"]')._locator;
        expect(
            await iconLocator.isVisible(),
            'IFSC Bank Logo is not visible'
        ).toBe(true);
    }
    async vendorIfscDetailsValidation() {
        const ifsc_details = await this.locate('div', { id: 'bank_ifsc_info' })
            ._locator;
        expect(
            await ifsc_details.isVisible(),
            'Bank Details is not visible'
        ).toBe(true);

        return await ifsc_details.textContent();
    }
    async bankAccountName() {
        const accountName = await this._page
            .locator('//label[@for="account_name"]/following-sibling::div[1]')
            .textContent();
        console.log('Bank Account Name: ', accountName);
        return accountName;
    }
    async bankAccountNumber() {
        const account_number = await this._page
            .locator('//div[text()="Account Number"]/following-sibling::div')
            .textContent();
        console.log('Bank Account Number: ', account_number);
        return account_number;
    }
    async bankIFSCCode() {
        const ifsc_code = await this._page
            .locator("//img[@alt='bank']/following-sibling::p[1]")
            .textContent();
        console.log('Bank Account Number: ', ifsc_code);
        return ifsc_code;
    }
    async businessDetailsIFSC() {
        const gstin = await this._page
            .locator('//div[text()="IFSC Code"]/following-sibling::div')
            .textContent();
        console.log('Bank Number in Business Details: ', gstin);
        return gstin;
    }
}

export class VendorInvitationDetails extends BaseHelper {
    public bankDetails;
    public lowerTDS;
    constructor(bankDetails, lowerTDS, page) {
        super(page);
        this.bankDetails = bankDetails;
        this.lowerTDS = lowerTDS;
    }
    private INVITATION_DETAILS_DOM =
        "(//div[contains(@class,'flex-1 gap-4')])[2]";

    async checkFrom() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("(//div[contains(@class,'flex-1 gap-1')]//div)[1]")
            .textContent();
    }
    async checkFromGSTIN() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        const businessGSTIN = helper._page.locator(
            "//span[contains(@class,'text-xs text-base-tertiary')]"
        );
        await expect
            .soft(businessGSTIN, 'GSTIN of Business is not visible')
            .toBeVisible();
        if (await businessGSTIN.isVisible())
            return await businessGSTIN.textContent();
    }
    async checkClient() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'inline-block w-3/4')]")
            .textContent();
    }

    async checkClientGSTIN() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'text-xs cursor-pointer')]")
            .textContent();
    }

    //For non GSTIN Information
    async checkNonGstinFrom() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("(//div[@class='w-full']//span)[3]")
            .textContent();
    }
    async checkGstinFromNonGstin() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        const businessGSTIN = helper._page.locator(
            "(//div[contains(@class,'text-center rounded')])[1]"
        );
        await expect
            .soft(businessGSTIN, 'GSTIN of Business is not visible')
            .toBeVisible();
        if (await businessGSTIN.isVisible())
            return await businessGSTIN.textContent();
    }

    async checkNonGstinClient() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'inline-block w-3/4')]")
            .textContent();
    }

    async checkNonGstinClientGSTIN() {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'text-xs cursor-pointer')]")
            .textContent();
    }

    async checkDocument(title: string) {
        const helper = this.locate(
            VendorOnboardingWithGSTIN.VENDORONBOARDINGWITHOUTGSTIN_DOM
        );
        const container = helper._page
            .locator(`(//div[contains(@class,'border-b cursor-pointer')])`)
            .filter({ hasText: title });
        const imageName = helper._page.locator(
            '//div[contains(@class,"overflow-hidden font-medium")]'
        );
        if (await container.isVisible()) {
            await container.click();
            if (title === 'GSTIN Certificate') {
                const gstinStatus = helper._page.locator(
                    "//p[text()='GST Status']/following-sibling::p"
                );

                expect(
                    await gstinStatus.isVisible(),
                    'GSTIN Status is not visible'
                ).toBe(true);
                expect(
                    await gstinStatus.textContent(),
                    'GSTIN Status does not matched'
                ).toBe(vendorGstinInfo.status);

                if (await imageName.isVisible()) {
                    expect(
                        await imageName.textContent(),
                        'Image Name does not matched'
                    ).toBe(IMAGE_NAME);
                }
            }
            if (title === 'Pan Card') {
                if (await imageName.isVisible()) {
                    expect(
                        await imageName.textContent(),
                        'Image Name does not matched'
                    ).toBe(IMAGE_NAME);
                }
            }

            if (title === 'MSME') {
                const msmeLocator = helper._page.locator(
                    "//div[text()='MSME number']/following-sibling::div"
                );
                expect(await msmeLocator.isVisible()).toBe(true);
                expect(await msmeLocator.textContent()).toBe(MSME_NUMBER);
                if (await imageName.isVisible()) {
                    expect(
                        await imageName.textContent(),
                        'Image Name does not matched'
                    ).toBe(IMAGE_NAME);
                }
            }

            if (title === 'Lower TDS') {
                const tdsCertNumber = helper._page.locator(
                    "//div[text()='TDS Certificate Number']/following-sibling::div"
                );
                const tdsPercentage = helper._page.locator(
                    '//div[text()="Lower TDS Percentage"]/following-sibling::div'
                );
                console.log(
                    'Lower TDS Percentage: ' + (await tdsPercentage.innerText())
                );
                const expireDate = helper._page.locator(
                    '//div[text()="Expiry Date"]/following-sibling::div'
                );

                expect(
                    await tdsCertNumber.textContent(),
                    'TDS Certificate Number does not matched'
                ).toBe(this.lowerTDS.tdsCertNumber);

                expect(
                    await tdsPercentage.textContent(),
                    'TDS Percentage does not matched'
                ).toBe(this.lowerTDS.tdsPercentage + '%');

                expect
                    .soft(
                        await expireDate.textContent(),
                        'Expiry Date does not matched'
                    )
                    .toBe(getDate);

                if (await imageName.isVisible()) {
                    expect(
                        await imageName.textContent(),
                        'Image Name does not matched'
                    ).toBe(IMAGE_NAME);
                }
            }

            if (title === 'Bank') {
                const bankName = helper._page.locator(
                    "//div[text()='Name']/following-sibling::div"
                );
                const accountNumber = helper._page.locator(
                    '//div[text()="A/C Number"]/following-sibling::div'
                );
                const ifscCode = helper._page.locator(
                    "//div[text()='IfSC Code']/following-sibling::div"
                );

                expect(
                    await bankName.textContent(),
                    'Bank Name does not matched'
                ).toBe(this.bankDetails.bankName);

                expect(
                    await accountNumber.textContent(),
                    'Account Number does not matched'
                ).toBe(this.bankDetails.accountNumber);

                expect(
                    await ifscCode.textContent(),
                    'IFSC Code does not matched'
                ).toBe(this.bankDetails.ifsc);
            }
        }
        await helper._page.waitForTimeout(1000);
    }
}
