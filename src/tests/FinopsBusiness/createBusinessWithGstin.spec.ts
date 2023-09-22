import {
    Invalid_Email_Error_Message,
    Invalid_Gstin_Error_Message,
    Invalid_Mobile_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { BusinessDetailsPageHelper } from '@/helpers/FinopsBusinessHelper/detailFinopsBusiness.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { expect } from '@playwright/test';
import chalk from 'chalk';

const businessGstinInfo: gstinDataType = {
    trade_name: 'Reliance Industries Limited',
    gstin: '27AAACR5055K1Z7',
    business_type: 'Proprietorship',
    pan_number: 'AAACR5055K',
    address:
        'Reliance Corporate Park, Thane Belapur Road, Ghansoli, Navi Mumbai, 5, Thane, 400701, Maharashtra, NA, 5, TTC Industrial Area',
    status: 'Active',
};

const updated_BusinessInfo = {
    email: 'updateduser@testing.com',
    mobile: '9876032123',
};
const AddNotes = {
    comments: 'Notes to be addded',
};
const notesSchema = {
    notes: {
        type: 'textarea',
        required: true,
    },
};

const BankInformationSchema = {
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
const { describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '27AAACR5055K1Z7',
    mobile: '9845612345',
    email: 'user@gmail.com',
};

const formSchema = {
    gstin: {
        type: 'text',
        required: true,
    },
    mobile: {
        type: 'tel',
        required: true,
    },
    email: {
        type: 'email',
        required: true,
    },
};
const title = 'Add Business';
const createInit = async (page: any) => {
    const helper = new CreateFinopsBusinessHelper(page);
    const gstin_helper = new GenericGstinCardHelper(businessGstinInfo, page);
    gstin_helper.expand_card = true;
    await helper.init(); // got to business listing page
    await helper.listHelper.openDialogFormByButtonText(title);
    await helper.formHelper.dialogHelper.checkFormIsOpen();

    await helper.formHelper.checkTitle(title);

    await helper.clickNavigationTab('GST Registered');

    return {
        gstin_helper,
        helper,
    };
};
describe.configure({ mode: 'serial' });
describe(`Create Gstin Business`, () => {
    PROCESS_TEST('TBA001', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await PROCESS_TEST.step('Check Mandatory Fields', async () => {
            Logger.info(`\nstep-1-->Check Mandatory Fields`, `\n`);

            await helper.formHelper.checkIsMandatoryFields(formSchema);
        });
        await PROCESS_TEST.step(' Check Confirm Pop Up Modal', async () => {
            Logger.info(`\nstep-2-->Check Confirm Pop Up Modal`, `\n`);

            await helper.formHelper.fillFormInputInformation(formSchema, {
                gstin: '12',
            });

            await helper.formHelper.submitButton();
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });

        await PROCESS_TEST.step('Fill Form Without  Data', async () => {
            Logger.info(`\nstep-3-->Fill Form Without  Data`, `\n`);
            await helper.listHelper.openDialogFormByButtonText(title);

            await helper.formHelper.resetForm(formSchema);
            await helper.formHelper.submitButton();
            await helper.formHelper.checkAllMandatoryInputHasErrors(formSchema);

            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });
        await PROCESS_TEST.step('without Gstin Number', async () => {
            Logger.info(`\nstep-3-->without Gstin Number`, `\n`);
            await helper.listHelper.openDialogFormByButtonText(title);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                gstin: '',
            });
            await helper.formHelper.submitButton();

            await helper.formHelper.checkInputError('gstin', formSchema.gstin);

            await helper.formHelper.checkSubmitIsDisabled();

            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });
        await PROCESS_TEST.step('Verify Invalid Gstin', async () => {
            Logger.info(`\nstep-4-->Verify Invalid Gstin`, `\n`);

            await helper.listHelper.openDialogFormByButtonText(title);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                gstin: '27AAQCS4259Q1Z1',
            });
            await page.waitForTimeout(1000);
            await page.waitForLoadState('networkidle');

            await helper.formHelper.submitButton();

            await helper.formHelper.checkInputError(
                'gstin',
                formSchema.gstin,
                Invalid_Gstin_Error_Message
            );

            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });

        await PROCESS_TEST.step('Without Email ', async () => {
            Logger.info(`\nstep-5-->Without Email`, `\n`);
            await helper.listHelper.openDialogFormByButtonText(title);

            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                email: ' ',
            });
            await helper.fillInput('', {
                name: 'email',
            });
            await page.waitForTimeout(1000);
            await page.waitForLoadState('networkidle');
            await helper.formHelper.submitButton();

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email']
            );
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });

        await PROCESS_TEST.step('With Invalid Email  ', async () => {
            Logger.info(`\nstep-6-->With Invalid Email`, `\n`);
            await helper.listHelper.openDialogFormByButtonText(title);
            await helper.formHelper.fillFormInputInformation(
                formSchema,
                {
                    ...businessInformation,
                    email: 'usergmail.com',
                },
                'mobile'
            );

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email'],
                Invalid_Email_Error_Message
            );
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });
        await PROCESS_TEST.step('Without Mobile ', async () => {
            Logger.info(`\nstep-7-->Without Mobile`, `\n`);
            await helper.listHelper.openDialogFormByButtonText(title);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: ' ',
            });

            await helper.fillInput('', {
                name: 'mobile',
            });
            await page.waitForTimeout(1000);
            await page.waitForLoadState('networkidle');
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile']
            );
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });

        await PROCESS_TEST.step('With Invalid Mobile Number ', async () => {
            Logger.info(`\nstep-8-->With Invalid Mobile Number`, `\n`);
            await helper.listHelper.openDialogFormByButtonText(title);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: '98456123',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile'],
                Invalid_Mobile_Error_Message
            );
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction(
                'Yes!'
            );
        });

        await PROCESS_TEST.step('Create Business Account.', async () => {
            Logger.info(`\nstep-10-->Create Business Account.`, `\n`);

            await helper.listHelper.openDialogFormByButtonText(title);

            await helper.formHelper.fillFormInputInformation(
                formSchema,
                businessInformation
            );

            await helper.formHelper.checkIsMandatoryFields(formSchema);
            await gstin_helper.gstinInfoCheck();
            await helper.formHelper.submitButton();
            await helper.checkToastSuccess('Successfully Saved');
        });
        await PROCESS_TEST.step('verify create data in table ', async () => {
            Logger.info(`\nstep-11-->verify create data in table`, `\n`);

            await helper.listHelper.searchInList(businessInformation?.gstin);

            await helper.verifyTableData(businessGstinInfo, true);
        });
    });
});

describe('Business Detail', () => {
    const contactPersonInfo = {
        name: 'Ram Kumar Chhetri',
        mobile: '9876543321',
        email: 'testingperson2@test.com',
    };
    const account_number = `142${generateRandomNumber()}454${generateRandomNumber()}`;
    const BankInformation = {
        account_number: account_number,
        re_account_number: account_number,
        ifsc_code: 'ICIC0000004',
    };

    const contactPersonInfoSchema = {
        name: {
            type: 'text',
            required: true,
        },
        mobile: {
            type: 'number',
            required: true,
        },
        email: {
            type: 'email',
            required: true,
        },
    };

    PROCESS_TEST('TBD001', async ({ page }) => {
        const businessDetails = new BusinessDetailsPageHelper(
            businessGstinInfo,
            page
        );
        await businessDetails.init();
        await businessDetails.breadCrumb.checkBreadCrumbTitle('My Businesses');
        await PROCESS_TEST.step('redirect detail page', async () => {
            await businessDetails.listHelper.searchInList(
                businessGstinInfo.gstin
            );
            await businessDetails.redirectDetailPage(
                'GSTIN',
                businessGstinInfo.gstin
            );
        });

        await PROCESS_TEST.step(
            'verify created data in datails page',
            async () => {
                await businessDetails.verifyHeading(
                    businessGstinInfo.trade_name
                );
                await businessDetails.verifyInformation(
                    'Business Type',
                    businessGstinInfo.business_type
                );
                await businessDetails.verifyInformation(
                    'Pan Number',
                    businessGstinInfo.pan_number
                );
                //@todo it should be implement after web issue fixed
                // await businessDetails.verifyInformation(
                //     'Address',

                //     businessGstinInfo.address
                // );
            }
        );

        await PROCESS_TEST.step(
            'verify gstin clickable and check gstin filing information',
            async () => {
                await businessDetails.verifyGstinFilingInformation(
                    businessGstinInfo
                );
            }
        );

        await PROCESS_TEST.step('Verify and Edit Email', async () => {
            await businessDetails.verifyInformation(
                'Email',
                businessInformation.email
            );
            await businessDetails.editInformation('Email');

            await businessDetails.dialog.checkDialogTitle('Edit Business');
            await businessDetails.formHelper.fillFormInputInformation(
                formSchema,
                {
                    ...updated_BusinessInfo,
                    mobile: businessInformation.mobile,
                },
                undefined,
                ['gstin']
            );
            await businessDetails.formHelper.submitButton();
            await businessDetails.checkToastSuccess('Successfully Saved');
        });

        await PROCESS_TEST.step('Verify and Edit Mobile Number', async () => {
            await businessDetails.verifyInformation(
                'Mobile Number',
                businessInformation.mobile
            );
            await businessDetails.editInformation('Mobile Number');
            await businessDetails.dialog.checkDialogTitle('Edit Business');
            await businessDetails.formHelper.fillFormInputInformation(
                formSchema,
                updated_BusinessInfo,
                undefined,
                ['gstin']
            );
            await businessDetails.formHelper.submitButton();
            await businessDetails.checkToastSuccess('Successfully Saved');
        });

        await PROCESS_TEST.step(
            'Verify and Edit Upload Documents',
            async () => {
                await businessDetails.tab.clickTab('Uploaded Documents');
                const gstinCert = await businessDetails.getBusinessDetails(
                    'GST Certificate'
                );
                const panCard = await businessDetails.getBusinessDetails(
                    'Pan Card'
                );

                expect(gstinCert, chalk.red('Gst Certificate check')).toContain(
                    businessGstinInfo.gstin
                );
                expect(panCard, chalk.red('Pan Card check')).toContain(
                    businessGstinInfo.pan_number
                );

                await PROCESS_TEST.step('Edit Documents', async () => {
                    await businessDetails.clickBusinessAction(
                        'GST Certificate'
                    );
                    await businessDetails.dialog.checkDialogTitle(
                        'Edit Document'
                    );
                    await businessDetails.fileUpload.setFileInput({
                        isDialog: true,
                    });
                    await businessDetails.formHelper.submitButton(undefined, {
                        waitForNetwork: true,
                    });

                    await page.waitForLoadState('networkidle');
                    await businessDetails.checkToastSuccess(
                        'Successfully saved'
                    );

                    await page.waitForTimeout(1000);
                    await page.waitForLoadState('networkidle');

                    const documents =
                        await businessDetails.getBusinessDocuments(
                            'GST Certificate'
                        );

                    expect(
                        documents,
                        chalk.red('Documents Visibility check')
                    ).toBe(true);
                });
            }
        );

        await PROCESS_TEST.step('Attach Bank Account', async () => {
            await businessDetails.tab.clickTab('Bank Accounts');
            await businessDetails.clickActionButton();

            await businessDetails.clickActionOption('Add Bank Account');
            await businessDetails.dialog.checkDialogTitle(
                'Attach Bank Account'
            );

            const selectBox = await businessDetails.openSelectBox({
                name: 'bankId',
            });

            await selectBox.locateByText('+ Add Bank Account').click();

            await page.waitForLoadState('domcontentloaded');
            await PROCESS_TEST.step('Bank Account Creation', async () => {
                await businessDetails.formHelper.fillFormInputInformation(
                    BankInformationSchema,
                    BankInformation,
                    'account_number'
                );
                await page.waitForTimeout(1000);
                await page.waitForLoadState('networkidle');
                await businessDetails.fileUpload.setFileInput({
                    isDialog: true,
                });
                await businessDetails.formHelper.submitButton(undefined, {
                    waitForNetwork: true,
                });

                await page.waitForTimeout(1000);
                await page.waitForLoadState('networkidle');
                await businessDetails.checkToastSuccess('Successfully Created');
            });
            await businessDetails.attachBankAccount();
            await businessDetails.checkToastSuccess('Bank Account is attached');
        });
        //@todo old way
        // await PROCESS_TEST.step('Bank Account - tab', async () => {
        //     await businessDetails.tab.clickTab('Bank Accounts');

        //     await businessDetails.clickActionButton();
        //     await businessDetails.clickActionOption('Add Bank Account');
        //     await businessDetails.dialog.checkDialogTitle('Add Bank Account');
        //     await businessDetails.formHelper.fillFormInputInformation(
        //         BankInformationSchema,
        //         BankInformation,
        //         'account_number'
        //     );
        //     await page.waitForTimeout(1000);
        //     await page.waitForLoadState('networkidle');
        //     await businessDetails.fileUpload.setFileInput({ isDialog: true });
        //     await businessDetails.formHelper.submitButton(undefined, {
        //         waitForNetwork: true,
        //     });

        //     await page.waitForTimeout(1000);
        //     await page.waitForLoadState('networkidle');
        //     await businessDetails.checkToastSuccess('Successfully saved');
        // });

        await PROCESS_TEST.step('Contact Person - tab', async () => {
            await businessDetails.tab.clickTab('Contact Persons');

            await businessDetails.clickActionButton();
            await businessDetails.clickActionOption('Add Contact Person');
            await businessDetails.dialog.checkDialogTitle('Add Contact Person');
            await businessDetails.formHelper.fillFormInputInformation(
                contactPersonInfoSchema,
                contactPersonInfo
            );
            await businessDetails.formHelper.submitButton();
            await businessDetails.checkToastSuccess('Successfully saved');

            await PROCESS_TEST.step('Verify Added Person Contact', async () => {
                const getName = await businessDetails.getContactPerson(
                    contactPersonInfo.email,
                    'NAME'
                );
                const getMobile = await businessDetails.getContactPerson(
                    contactPersonInfo.email,
                    'MOBILE'
                );
                expect(getName).toContain(contactPersonInfo.name);
                expect(getMobile).toContain(contactPersonInfo.mobile);
            });
        });

        await PROCESS_TEST.step('Add Notes - tab', async () => {
            await businessDetails.tab.clickTab('Notes');

            await businessDetails.clickActionButton();
            await businessDetails.clickActionOption('Add Notes');
            await businessDetails.dialog.checkDialogTitle('Add Notes');
            await businessDetails.formHelper.fillTextAreaForm(AddNotes);
            await businessDetails.formHelper.submitButton();

            await PROCESS_TEST.step('Verify Added Notes', async () => {
                await businessDetails.getNotesAuthor(AddNotes.comments);
                await businessDetails.checkNotesDate(AddNotes.comments);
            });
        });

        await PROCESS_TEST.step('Edit Business Details', async () => {
            await businessDetails.clickEditIcon();
            await businessDetails.dialog.checkDialogTitle('Edit Business');

            await businessDetails.formHelper.fillFormInputInformation(
                formSchema,
                updated_BusinessInfo,
                undefined,
                ['gstin']
            );
            await page.waitForLoadState('load');
            await businessDetails.formHelper.checkIsInputDisabled({
                name: 'gstin',
            });
            await businessDetails.formHelper.submitButton();
            await businessDetails.checkToastSuccess('Successfully Saved');

            await PROCESS_TEST.step('Verify Updated Info', async () => {
                await businessDetails.verifyInformation(
                    'Email',
                    updated_BusinessInfo.email
                );
                await businessDetails.verifyInformation(
                    'Mobile Number',
                    updated_BusinessInfo.mobile
                );
            });
        });
    });
});
