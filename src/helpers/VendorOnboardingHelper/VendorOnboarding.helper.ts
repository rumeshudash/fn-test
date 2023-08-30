import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import GenericGstinCardHelper from '../CommonCardHelper/genericGstin.card.helper';
import { expect } from '@playwright/test';
import {
    BANKDETAILS,
    COI_NUMBER,
    IMAGE_NAME,
    LOWER_TDS_DETAILS,
    MSME_NUMBER,
    PICK_DATE,
    clientGstinInfo,
    vendorGstinInfo,
} from '@/utils/required_data';
import { ExpenseHelper } from '../ExpenseHelper/expense.helper';

let getDate: string;
let clientBusinessName: string;
export class VendorOnboarding extends GenericGstinCardHelper {
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
    public async toastMessage() {
        const toast = this._page.locator('div.ct-toast-success');
        const toastError = this._page.locator('div.ct-toast.ct-toast-error');
        const toastWarn = this._page.locator('div.ct-toast.ct-toast-warn');
        const toastLoading = this._page.locator('div.loading-toast');

        const toastErrorCount = await toastError.count();
        const toastWarnCount = await toastWarn.count();
        const toastLoadingCount = await toastLoading.count();
        if (toastLoadingCount > 0) {
            console.log(
                chalk.magenta(
                    `Multiple toastMessage ocurred \n ${toastLoading}:`,
                    toastLoadingCount
                )
            );
            for (let i = 0; i < toastLoadingCount; i++) {
                const loadingMsg = await toastLoading.nth(i).textContent();
                console.log(
                    `toastMessage (loading ${i}): `,
                    chalk.magenta(loadingMsg)
                );
            }
        }

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
    public async bankAccount(data: ClientBankAccountDetails[] = []) {
        const bankAccountName = await this._page
            .locator('#account_name')
            .inputValue();
        expect(
            bankAccountName,
            'Bank Account Name doest not match to Vendor'
        ).toBe(vendorGstinInfo.trade_name);

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
        const addDocumentBtn = this._page.getByRole('button', {
            name: ' Add New Document',
        });

        await expect(
            addDocumentBtn,
            'Add New Document button not visible'
        ).toBeVisible();

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
                await this._page.locator('#date').fill(PICK_DATE);
                getDate = await this._page.locator('#date').inputValue();
                // await this._page
                //     .locator("button:has-text('20')")
                //     .first()
                //     .click();
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

    public async clientInvitation(businessName: string, clientGSTIN: string) {
        await this._page.waitForTimeout(1000);
        const dropdown = this._page.locator(
            '//div[text()="Select Your Business"]'
        );

        const gstinDropdown = this._page.locator(
            '//div[text()="Select client business"]'
        );

        if (await dropdown.isVisible()) {
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

        // const containerError = containerTitle.filter({
        //     has: documentError,
        // });
        // const imageIcon = documentError.locator(
        //     '//div[@class="icon-container cursor-pointer"]'
        // );
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

            const msme = {
                msme_identifier: '20',
                files: [],
            };

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
        // const imageIcon = documentError.locator(
        //     `//div[@class='icon-container cursor-pointer']`
        // );
        //Upload Document
        // for (let i = 0; i < errorCount; i++) {
        //     for (const docs of await containerError.textContent()) {
        //         const filesRequire = docs[i].includes('files');
        //         // if (await containerError.isVisible()) {
        //         if (filesRequire) {
        //             const clickBtn = containerBtn;
        //             if (await clickBtn.isVisible()) {
        //                 await clickBtn.click();
        //             }
        //         } else {
        //             const clickBtn = containerBtn.locator('i');
        //             if (await clickBtn.isVisible()) {
        //                 await clickBtn.click();
        //             }
        //         }

        //         await this._page.setInputFiles(
        //             "//input[@type='file']",
        //             `./images/${imagePath}`
        //         );
        //         await this._page.waitForTimeout(1000);

        //         if (
        //             await this._page
        //                 .getByPlaceholder('Enter MSME number')
        //                 .isVisible()
        //         ) {
        //             await this.fillText('22', {
        //                 placeholder: 'Enter MSME number',
        //             });
        //         }

        //         if (
        //             await this._page
        //                 .getByPlaceholder('Enter COI number')
        //                 .isVisible()
        //         ) {
        //             await this.fillText('23332567', {
        //                 placeholder: 'Enter COI number',
        //             });
        //         }
        //         await this.click({ role: 'button', name: 'Save' });
        //         await this._page.waitForTimeout(1000);
        //     }
        // }
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
        const imageName = helper._page.locator(
            '//div[contains(@class,"overflow-hidden font-medium")]'
        );
        if (container) {
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
                    ).toBe('pan-card.jpg');
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
                const expireDate = helper._page.locator(
                    '//div[text()="Expiry Date"]/following-sibling::div'
                );

                expect(
                    await tdsCertNumber.textContent(),
                    'TDS Certificate Number does not matched'
                ).toBe(LOWER_TDS_DETAILS[0].tdsCert);

                expect(
                    await tdsPercentage.textContent(),
                    'TDS Percentage does not matched'
                ).toBe(MSME_NUMBER + '%');

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
                ).toBe(vendorGstinInfo.trade_name);

                expect(
                    await accountNumber.textContent(),
                    'Account Number does not matched'
                ).toBe(BANKDETAILS[0].accountNumber);

                expect(
                    await ifscCode.textContent(),
                    'IFSC Code does not matched'
                ).toBe(BANKDETAILS[0].ifsc);
            }
        }
        await helper._page.waitForTimeout(1000);
    }
}

export class BankAccountDetails extends BaseHelper {
    public async vendorIfscLogoCheck() {
        const iconLocator = this.locate('//img[@alt="bank"]')._locator;
        expect(
            await iconLocator.isVisible(),
            'IFSC Bank Logo is not visible'
        ).toBe(true);
    }
    public async vendorIfscDetails() {
        const ifsc_details = await this._page.locator(
            '(//div[contains(@class,"flex items-center")])[2]'
        );
        expect(
            await ifsc_details.isVisible(),
            'Bank Details is not visible'
        ).toBe(true);

        return await ifsc_details.textContent();
    }
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
