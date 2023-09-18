import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper, {
    BusinessDetailsPageHelper,
} from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

const businessGstinInfo: gstinDataType = {
    trade_name: 'Ravechi Builder India Private Limited',
    value: '27AAHCR8293A2Z6',
    business_type: 'Private Limited',
    pan_number: 'AAHCR8293A',
    address:
        'SHELTON TOWER, PLOT NO 87,SECTOR 15, CBD-BELAPUR,NAVI MUMBAI, OFFICE NO 807, Thane, 400614, Maharashtra, NA',
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

const BankInformation = {
    account_number: '12345678',
    re_account_number: '12345678',
    ifsc_code: 'ICIC0000004',
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
    gstin: '27AAHCR8293A2Z6',
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
const createInit = async (page: any) => {
    const title = 'Add Business';
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

        await PROCESS_TEST.step(' Check Confirm Pop Up Modal', async () => {
            Logger.info(`\nstep-1-->Check Confirm Pop Up Modal`, `\n`);

            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction('No');
        });

        await PROCESS_TEST.step('Check Mandatory Fields', async () => {
            Logger.info(`\nstep-2-->Check Mandatory Fields`, `\n`);
            await helper.formHelper.checkMandatoryFields(formSchema);
        });

        await PROCESS_TEST.step('Fill Form Without  Data', async () => {
            Logger.info(`\nstep-3-->Fill Form Without  Data`, `\n`);
            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.submitButton();
            await helper.formHelper.checkAllMandatoryInputErrors(formSchema);
        });
        await PROCESS_TEST.step('without Gstin Number', async () => {
            Logger.info(`\nstep-3-->without Gstin Number`, `\n`);
            await helper.formHelper.fillFormInputInformation(
                formSchema,
                {
                    ...businessInformation,
                    gstin: '',
                },
                'email'
            );
            await helper.checkGstinError();

            await helper.formHelper.checkDisableSubmit();
        });
        await PROCESS_TEST.step('Verify Invalid Gstin', async () => {
            Logger.info(`\nstep-4-->Verify Invalid Gstin`, `\n`);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                gstin: '27AAQCS4259Q1Z1',
            });

            await helper.checkGstinError('Invalid Gstin Number');
            await helper.formHelper.submitButton();
        });

        await PROCESS_TEST.step('Without Email ', async () => {
            Logger.info(`\nstep-5-->Without Email`, `\n`);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                email: '',
            });

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email']
            );
        });

        await PROCESS_TEST.step('With Invalid Email  ', async () => {
            Logger.info(`\nstep-6-->With Invalid Email`, `\n`);
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
        });
        await PROCESS_TEST.step('Without Mobile ', async () => {
            Logger.info(`\nstep-7-->Without Mobile`, `\n`);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: '',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile']
            );
        });

        await PROCESS_TEST.step('With Invalid Mobile Number ', async () => {
            Logger.info(`\nstep-8-->With Invalid Mobile Number`, `\n`);

            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: '98456123',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile'],
                Invalid_Mobile_Error_Message
            );
        });

        await PROCESS_TEST.step('Create Business Account.', async () => {
            Logger.info(`\nstep-10-->Create Business Account.`, `\n`);

            await helper.formHelper.fillFormInputInformation(
                formSchema,
                businessInformation
            );

            await helper.formHelper.checkMandatoryFields(formSchema);
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
                businessGstinInfo.value
            );
            await businessDetails.redirectDetailPage(
                'GSTIN',
                businessGstinInfo.value
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
                    businessGstinInfo.value
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

        await PROCESS_TEST.step('Bank Account - tab', async () => {
            await businessDetails.tab.clickTab('Bank Accounts');

            await businessDetails.clickActionButton();
            await businessDetails.clickActionOption('Add Bank Account');
            await businessDetails.dialog.checkDialogTitle('Add Bank Account');
            await businessDetails.formHelper.fillFormInputInformation(
                BankInformationSchema,
                BankInformation,
                'account_number'
            );
            await page.waitForLoadState('networkidle');
            await businessDetails.fileUpload.setFileInput({ isDialog: true });
            await businessDetails.formHelper.submitButton(undefined, {
                waitForNetwork: true,
            });

            await page.waitForLoadState('networkidle');
            await businessDetails.checkToastSuccess('Successfully saved');
        });

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
            businessDetails.formHelper.checkIsInputDisabled({
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
