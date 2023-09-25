import { BaseHelper } from '@/helpers/BaseHelper/base.helper';
import { DialogHelper } from '@/helpers/BaseHelper/dialog.helper';
import { FileHelper } from '@/helpers/BaseHelper/file.helper';
import { FormHelper } from '@/helpers/BaseHelper/form.helper';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import { NotificationHelper } from '@/helpers/BaseHelper/notification.helper';
import GenericGstinCardHelper from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import {
    COI_NUMBER,
    IMAGE_NAME,
    MSME_NUMBER,
    PAN_CARD,
} from '@/utils/required_data';
import { expect } from '@playwright/test';
import chalk from 'chalk';

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
    constructor(lowerTDS, page: any) {
        super(page);
        this.lowerTDS = lowerTDS;
        this.notification = new NotificationHelper(page);
        this.dialog = new DialogHelper(page);
        this.form = new FormHelper(page);
        this.file = new FileHelper(page);
    }
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";

    public async clickCopyLink(): Promise<void> {
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

    public async linkURL(): Promise<string> {
        const linkInput = this._page.locator(
            "//span[contains(@class,'px-3 overflow-hidden')]"
        );
        expect(
            await linkInput.isVisible(),
            chalk.red('Link Input field visibility')
        ).toBe(true);
        return await linkInput.textContent();
    }

    public async closeDialog(): Promise<void> {
        await this._page
            .locator("//button[contains(@class,'absolute right-4')]")
            .click();
    }

    public async init(URL: string): Promise<void> {
        await this._page.goto(URL);
        // 'https://devfn.vercel.app/vendor/register?client=57649556&client_name=New Test Auto'
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
        await this._page.waitForLoadState('domcontentloaded');
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

    public async fillDocuments(): Promise<void> {
        await this._page.waitForTimeout(1500);

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
    public async fileUpload(imagePath: string): Promise<void> {
        await this._page.setInputFiles(
            "//input[@type='file']",
            `./images/${imagePath}`
        );
        await this._page.waitForTimeout(2000);
    }

    public async getClientID(): Promise<string> {
        const clientID = await this._page
            .getByPlaceholder('Enter client Id')
            .textContent();
        Logger.info('Auto Fetch Client ID: ', clientID);
        return clientID;
    }

    public async getClientIDVisibility(): Promise<boolean> {
        const clientID = await this._page
            .getByPlaceholder('Enter client Id')
            .isVisible();
        Logger.info('Auto Fetch Client ID Visibility: ', clientID);
        return clientID;
    }

    //Takes GSTIN from dropdown to compare with Auto Fetched Client GSTIN
    public async getGSTINfromInput(): Promise<string> {
        const helper = this.locate(this.BUSINESS_DETAILS_DOM);
        const gstin = await helper._page
            .locator(
                '(//div[contains(@class,"selectbox-control !bg-base-100")])[3]'
            )
            .textContent();
        Logger.info('GSTIN From Input dropdown: ', gstin);
        return gstin;
    }

    public async uploadImageDocuments(): Promise<void> {
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
        const container = this._page.locator(
            "(//div[contains(@class,'py-3 gap-1')])"
        );

        const documentError = this._page.locator(
            '//div[@class="text-xs text-error"]'
        );

        if (await documentError.first().isVisible()) {
            const errorContainer = container.filter({ has: documentError });

            const errorContainerCount = await errorContainer.count();
            Logger.warning('Document Image Error: ', errorContainerCount);

            for (let i = 0; i < errorContainerCount; i++) {
                Logger.warning(
                    'Document Image Error: ',
                    (await documentError.first().textContent()) +
                        ' Editable: ' +
                        (await errorContainer.first().textContent()).includes(
                            'files'
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

                    await this.file.setFileInput({ isDialog: true });

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

                    if (
                        (await this._page
                            .getByPlaceholder('Enter Pan Card number')
                            .isVisible()) &&
                        (await this._page
                            .getByPlaceholder('Enter Pan Card number')
                            .isEditable())
                    ) {
                        await this.fillText(PAN_CARD, {
                            placeholder: 'Enter Pan Card number',
                        });
                    }
                    await this.click({ role: 'button', name: 'Save' });
                }
            }
        } else {
            await this.click({ role: 'button', text: 'Submit' });
        }
    }

    public async verifyOnboardingCompleted(): Promise<void> {
        await this._page.waitForTimeout(1000);
        expect(
            await this.locate(
                '//div[text()="Onboarding Completed"]'
            )._locator.isVisible(),
            chalk.red('Onboarding text visibility')
        ).toBe(true);
    }
}
