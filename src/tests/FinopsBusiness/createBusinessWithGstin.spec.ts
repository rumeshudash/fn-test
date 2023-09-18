import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper, {
    BusinessDetailsPageHelper,
} from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import {
    businessInfoSchema,
    BankInformationSchema,
    BankInformation,
    AddNotes,
    updated_BusinessInfo,
} from './business_details_page.spec';
const businessGstinInfo: gstinDataType = {
    trade_name: 'Flipkart India Private Limited',
    value: '03AABCF8078M2ZA',
    business_type: 'Private Limited',
    pan_number: 'AABCF8078M',
    address:
        'Khasra No.306, 348/305, Village Katna,, Teshil Payal, Unit No.1, Ludhiana, 141113, Punjab, NA, Khewat No.79/80,',
    status: 'Active',
};

const { describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '03AABCF8078M2ZA',
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
describe(`TBA001`, () => {
    PROCESS_TEST(
        'Fill All Business Information. and verify gstin information',
        async ({ page }) => {
            const { helper, gstin_helper } = await createInit(page);

            await helper.formHelper.fillFormInputInformation(
                formSchema,
                businessInformation
            );

            await helper.formHelper.checkMandatoryFields(formSchema);
            await gstin_helper.gstinInfoCheck();
        }
    );

    PROCESS_TEST(
        'without Gstin Number-submit button disabled check',
        async ({ page }) => {
            const { helper } = await createInit(page);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                gstin: '',
            });
            await helper.checkGstinError();
            await helper.formHelper.checkDisableSubmit();
        }
    );

    PROCESS_TEST(
        'without Mobile Number-submit button check',
        async ({ page }) => {
            const { helper } = await createInit(page);

            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: '',
            });
            await helper.checkMobileError();
            await helper.formHelper.checkDisableSubmit();
        }
    );

    PROCESS_TEST('without Email-submit button check', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(
            formSchema,
            {
                ...businessInformation,
                email: '',
            },
            'mobile'
        );

        await helper.checkEmailError();
        await helper.formHelper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Gstin', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(formSchema, {
            ...businessInformation,
            gstin: '27AAQCS4259Q1Z1',
        });

        await helper.checkGstinError('Invalid Gstin Number');

        await helper.formHelper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Mobile Number', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(formSchema, {
            ...businessInformation,
            mobile: '984561234',
        });

        await helper.checkMobileError(Invalid_Mobile_Error_Message);
        await helper.formHelper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Email address', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(
            formSchema,
            {
                ...businessInformation,
                email: 'usergmail',
            },
            'mobile'
        );

        await helper.checkEmailError(Invalid_Email_Error_Message);
        await helper.formHelper.checkDisableSubmit();
    });
    PROCESS_TEST('Verify Confirm Dialog Open Or not', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(formSchema, {
            ...businessInformation,
        });

        await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
    });

    PROCESS_TEST('Create Business Account.', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await helper.formHelper.fillFormInputInformation(
            formSchema,
            businessInformation
        );

        await helper.formHelper.checkMandatoryFields(formSchema);
        await gstin_helper.gstinInfoCheck();
        await helper.formHelper.submitButton();
        await helper.checkToastSuccess('Saved Successfully !!');
        // verifying list information
        await helper.verifyTableData(businessGstinInfo);
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

        await PROCESS_TEST.step('Check Business GST', async () => {
            await businessDetails.clickBusiness('GSTIN');
            await businessDetails.dialog.checkDialogTitle('GST Filing Status');
            const getStatus = await businessDetails.getBusinessGstStatus(
                'Business Type'
            );
            expect(getStatus).toBe(businessGstinInfo.business_type);
            await businessDetails.dialog.closeDialog();
        });

        await PROCESS_TEST.step('Verify and Edit Email', async () => {
            await businessDetails.clickBusiness('NAME');
            await businessDetails.checkInformation('Email');
            await businessDetails.editInformation('Email');
            await businessDetails.dialog.checkDialogTitle('Edit Business');
            await businessDetails.formHelper.fillFormInputInformation(
                businessInfoSchema,
                businessGstinInfo
            );
            await businessDetails.clickButton('Save');
            await businessDetails.checkToastSuccess('Successfully Saved');
        });

        await PROCESS_TEST.step('Verify and Edit Mobile Number', async () => {
            await businessDetails.checkInformation('Mobile Number');
            await businessDetails.editInformation('Mobile Number');
            await businessDetails.dialog.checkDialogTitle('Edit Business');
            await businessDetails.formHelper.fillFormInputInformation(
                businessInfoSchema,
                businessGstinInfo
            );
            await businessDetails.clickButton('Save');
            await businessDetails.checkToastSuccess('Successfully Saved');
        });
        await PROCESS_TEST.step('Verify Address', async () => {
            const address = await businessDetails.checkInformation('Address');
            expect(address).toContain(businessGstinInfo.address);
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
                    await businessDetails.clickButton('Save');
                    await businessDetails.checkToastSuccess(
                        'Successfully saved'
                    );
                    const documents =
                        await businessDetails.getBusinessDocuments('Pan Card');
                    expect(
                        documents,
                        chalk.red('Documents Visibility check')
                    ).toBe(true);
                });
            }
        );

        await PROCESS_TEST.step('Bank Account - tab', async () => {
            await businessDetails.tab.clickTab('Bank Accounts');
            // await businessDetails.clickButton('Add Bank Account');
            await businessDetails.clickActionButton();
            await businessDetails.clickActionOption('Add Bank Account');
            await businessDetails.dialog.checkDialogTitle('Add Bank Account');
            await businessDetails.formHelper.fillFormInputInformation(
                BankInformationSchema,
                BankInformation
            );
            await businessDetails.fileUpload.setFileInput({ isDialog: true });
            await businessDetails.clickButton('Save');
            await businessDetails.clickButton('Save');
            await businessDetails.checkToastSuccess('Successfully saved');
        });

        await PROCESS_TEST.step('Contact Person - tab', async () => {
            await businessDetails.tab.clickTab('Contact Persons');
            // await businessDetails.clickButton('Add Contact Person');
            await businessDetails.clickActionButton();
            await businessDetails.clickActionOption('Add Contact Person');
            await businessDetails.dialog.checkDialogTitle('Add Contact Person');
            await businessDetails.formHelper.fillFormInputInformation(
                contactPersonInfoSchema,
                contactPersonInfo
            );
            await businessDetails.clickButton('Save');
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
            // await businessDetails.clickButton('Add Notes');
            await businessDetails.clickActionButton();
            await businessDetails.clickActionOption('Add Notes');
            await businessDetails.dialog.checkDialogTitle('Add Notes');
            await businessDetails.formHelper.fillTextAreaForm(AddNotes);
            await businessDetails.clickButton('Save');
            // await businessDetails.checkToastSuccess('Successfully saved');

            await PROCESS_TEST.step('Verify Added Notes', async () => {
                await businessDetails.getNotesAuthor(AddNotes.comments);
                await businessDetails.checkNotesDate(AddNotes.comments);
            });
        });

        await PROCESS_TEST.step('Edit Business Details', async () => {
            await businessDetails.clickEditIcon();
            await businessDetails.dialog.checkDialogTitle('Edit Business');

            await businessDetails.formHelper.fillFormInputInformation(
                businessInfoSchema,
                updated_BusinessInfo
            );
            businessDetails.formHelper.checkIsInputEditable({
                name: 'gstin',
            });
            await businessDetails.clickButton('Save');
            await businessDetails.checkToastSuccess('Successfully Saved');

            await PROCESS_TEST.step('Verify Updated Info', async () => {
                await businessDetails.checkInformation('Email');
                await businessDetails.checkInformation('Mobile Number');
            });
        });
    });
});
