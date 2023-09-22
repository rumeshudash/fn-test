import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import GenericGstinCardHelper from '../CommonCardHelper/genericGstin.card.helper';
import { expect } from '@playwright/test';
import {
    COI_NUMBER,
    IMAGE_NAME,
    MSME_NUMBER,
    PAN_CARD,
    PAN_CODE_ADDRESS,
    vendorGstinInfo,
} from '@/utils/required_data';
import GenericNonGstinCardHelper, {
    nonGstinDataType,
} from '../CommonCardHelper/genericNonGstin.card.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { FileHelper } from '../BaseHelper/file.helper';

let getDate: string;

export const vendorGstinInfoSchema = {
    gstin: {
        type: 'text',
        required: true,
    },
};
export const BANKDETAILS_SCHEMA = {
    account_number: {
        type: 'password',
        required: true,
    },
    re_account_number: {
        type: 'text',
        required: true,
    },
    ifsc_code: {
        type: 'text',
        required: true,
    },
};

export const LOWER_TDS_DETAILS_SCHEMA = {
    type_id: {
        type: 'select',
        required: true,
    },
    identifier: {
        type: 'text',
        required: true,
    },
    percentage: {
        type: 'text',
        required: true,
        name: 'custom_field_data.percentage',
    },
    expiry_date: {
        type: 'text',
        required: true,
    },
};

export const Client_Invitation_Info_Schema = {
    vendor_account_id: {
        type: 'select',
        required: true,
    },
    business_account_id: {
        type: 'reference_select',
        required: true,
    },
    bank_id: {
        type: 'select',
        required: true,
    },
    poc: {
        type: 'email',
    },
};

export class VendorOnboarding extends BaseHelper {
    public lowerTDS;
    public notification: NotificationHelper;
    public dialog: DialogHelper;
    public form: FormHelper;
    public file: FileHelper;
    constructor(lowerTDS, page) {
        super(page);
        this.lowerTDS = lowerTDS;
        this.notification = new NotificationHelper(page);
        this.dialog = new DialogHelper(page);
        this.form = new FormHelper(page);
        this.file = new FileHelper(page);
    }
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";

    public async clickCopyLink() {
        await this.click({
            role: 'button',
            name: 'Invite Vendor',
        });
        const linkDialog = await this._page.getByRole('dialog').isVisible();
        expect(linkDialog, chalk.red('Link Dialog visibility')).toBe(true);
        if (linkDialog) {
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
        expect(
            await linkInput.isVisible(),
            chalk.red('Link Input field visibility')
        ).toBe(true);
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

    /**
     * Verifies the business details.
     *
     * @param {string} title - The title certificate of the business.
     * @param {string} certNumber - The certificate number of the business.
     * @return {Promise<void>} A promise that resolves once the verification is complete.
     */
    public async verifyBusinessDetails(
        title: string,
        certNumber: string
    ): Promise<void> {
        const businessLocator = this.locate(
            `//div[text()="${title}"]/ancestor::div[contains(@class,"px-4 border rounded")]`
        )._locator;
        const detailsName = businessLocator.locator(
            `//div[text()="${certNumber}"]`
        );

        await expect(detailsName).toBeVisible();
    }

    /**
     * Verifies the auto-fetching of business details.
     *
     * @param {string} dropdownName - The name of the dropdown.
     * @param {string} data - The expected data to be fetched.
     */
    public async verifyAutoFetchBusinessName(
        dropdownName: string,
        data: string
    ): Promise<void> {
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
        const value = await this.locate(
            `//input[@name="${dropdownName}"]/parent::div //div[text()="${data}"]`
        )._locator.isVisible();

        expect(value, chalk.red('Verify Auto Fetch Business Name')).toBe(true);
    }

    public async verifyClientId(id: string | number): Promise<void> {
        const getclient = await this.locate('input', {
            name: 'identifier',
        })._locator.inputValue();

        expect(getclient, chalk.red('check Client ID')).toBe(id);
    }

    // dropdownName: string,
    // data: string
    public async verifyAutoFetchClientName(): Promise<void> {
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
        // const value = await this.locate(
        //     `//input[@name="${dropdownName}"]/parent::div //div[text()="${data}"]`
        // )._locator.isVisible();
        const value = await this.locate(
            `//input[@name="client_account_id"]/parent::div //div[contains(text(), "Select")]`
        )._locator.isVisible();

        expect(value, chalk.red('Verify Auto Fetch Client Name')).not.toBe(
            true
        );
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
    public async fillDocuments() {
        await this._page.waitForTimeout(1500);

        await expect(
            this._page.locator("//span[text()=' Add New Document']"),
            chalk.red('Add New Document button visibility')
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

    // public async clientInvitation(businessName: string, clientGSTIN: string) {
    //     await this._page.waitForTimeout(1000);
    //     const dropdown = this._page.locator(
    //         '//div[text()="Select Your Business"]'
    //     );

    //     const gstinDropdown = this._page.locator(
    //         '//div[text()="Select client business"]'
    //     );

    //     if (await dropdown.isVisible()) {
    //         expect
    //             .soft(
    //                 await dropdown.textContent(),
    //                 chalk.red('Business Information auto fetched')
    //             )
    //             .toBe(vendorGstinInfo.trade_name);

    //         await this.selectOption({
    //             option: businessName,
    //             placeholder: 'Select Your Business',
    //         });

    //         expect(
    //             await gstinDropdown.textContent(),
    //             chalk.red('Client Information auto fetched')
    //         ).toBe(clientGstinInfo.trade_name);
    //     }
    //     if (await gstinDropdown.isVisible()) {
    //         await this.selectOption({
    //             input: clientGstinInfo.gstin,
    //             placeholder: 'Select client business',
    //         });
    //     }
    //     await this._page.waitForTimeout(1000);
    //     await this.fillText('vasant02@harbourfront.com', { name: 'poc' });
    // }
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

    public async uploadImageDocuments() {
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
        const container = this._page.locator(
            "(//div[contains(@class,'py-3 gap-1')])"
        );

        const documentError = this._page.locator(
            '//div[@class="text-xs text-error"]'
        );
        // const containerBtn = this._page.locator(
        //     '//div[@class="icon-container cursor-pointer"]'
        // );
        if (await documentError.first().isVisible()) {
            const errorContainer = container.filter({ has: documentError });

            const errorContainerCount = await errorContainer.count();
            console.log('Document Image Error: ', errorContainerCount);

            for (let i = 0; i < errorContainerCount; i++) {
                console.log(
                    'Document Image Error: ',
                    chalk.red(await documentError.first().textContent()) +
                        ' Editable: ' +
                        chalk.blue(
                            (
                                await errorContainer.first().textContent()
                            ).includes('files')
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
                    // await this._page.setInputFiles(
                    //     "//input[@type='file']",
                    //     `./images/${imagePath}`
                    // );
                    await this.file.setFileInput({ isDialog: true });
                    // await this._page.waitForTimeout(1000);

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
                    // await this._page.waitForTimeout(2000);
                }
            }
        } else {
            await this.click({ role: 'button', text: 'Submit' });
        }
    }

    public async verifyOnboardingCompleted() {
        await this._page.waitForTimeout(1000);
        expect(
            await this.locate(
                '//div[text()="Onboarding Completed"]'
            )._locator.isVisible(),
            chalk.red('Onboarding text visibility')
        ).toBe(true);
    }
}

export class VendorOnboardingWithGSTIN extends GenericGstinCardHelper {
    public static VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';
    public async fillGstinInput() {
        await expect(
            this._page.getByPlaceholder('ENTER GSTIN NUMBER'),
            chalk.red('Gstin input field visibility')
        ).toBeVisible();
        await this.fillText(this.gstin_data.gstin, {
            placeholder: 'ENTER GSTIN NUMBER',
        });
    }
    public async gstinDisplayName(displayName: string): Promise<void> {
        const display_name = await this._page
            .locator('#display_name')
            .inputValue();
        expect(display_name, chalk.red('Display name match with vendor')).toBe(
            displayName
        );
    }
}
