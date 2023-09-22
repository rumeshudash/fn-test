import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    LOWER_TDS_DETAILS_SCHEMA,
    VendorOnboarding,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import { nonGstinDataType } from '@/helpers/CommonCardHelper/genericNonGstin.card.helper';
import chalk from 'chalk';
import { VendorManagedWithoutGSTIN } from '@/helpers/VendorOnboardingHelper/vendorOnboardingWithoutGstin.helper';
import { BankAccountDetails } from '@/helpers/VendorOnboardingHelper/bankDetails.helper';
import { VendorInvitationDetails } from '@/helpers/VendorOnboardingHelper/InvitationDetails.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

//Vendor and Client Details
const vendorNonGstinInfo = {
    name: 'ABC Pvt Ltd',
    display_name: 'ABC Pvt Ltd',
    type_id: 'Partnership Firm',
    pincode: 110001,
    address: '123/45 Test address',
};
const vendorNonGstinSchema = {
    name: {
        type: 'text',
        required: true,
    },
    display_name: {
        type: 'text',
    },
    type_id: {
        type: 'reference_select',
        required: true,
    },
    pincode: {
        type: 'number',
        required: true,
    },
    address: {
        type: 'textarea',
        required: true,
    },
};

const clientGstinInfo: gstinDataType = {
    trade_name: 'Hidesign India Pvt Ltd',
    gstin: '33AACCH0586R1Z6',
    business_type: 'Private Limited',
    address:
        'EXPRESS AVENUE, 49/50 L-WHITES ROAD, ROYAPETTAH, SHOP NO.S 161 B, Chennai, , , 600014, , Tamil Nadu, NA, FIRST FLOOR, ',
    pan_number: 'AACCH0586R',
    status: 'Active',
};
const NON_GSTIN_BANK_DETAILS = {
    bankName: vendorNonGstinInfo.name,
    account_number: '12345678',
    re_account_number: '12345678',
    ifsc_code: 'HDFC0000009',
    address: 'HDFC0000009, Bangalore - Kasturba Gandhi Marg ',
};

const NON_GSTIN_BANK_DETAILS_SCHEMA = {
    account_number: {
        type: 'text',
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

const NON_GSTIN_LOWER_TDS_DETAILS = {
    type_id: 'Lower TDS',
    identifier: '10',
    expiry_date: '22-02-2023',
    custom_field_data: {
        percentage: '32',
    },
};

let bankAccountNumber: string;
let URL: string;

const { expect, describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });
//Vendor Managed with Client Connect
describe('Vendor onboarding of a non gst  vendor through inivation link (Vendor Managed)', () => {
    const SignupInfo = {
        name: 'User130823',
        email: `user${generateRandomNumber()}@test.com`,
        password: '123456',
        confirm_password: '123456',
    };

    PROCESS_TEST('TCVO003', async ({ page }) => {
        const withnogstin = new VendorManagedWithoutGSTIN(page);
        const vendorOnboarding = new VendorOnboarding(
            NON_GSTIN_LOWER_TDS_DETAILS,
            page
        );

        const getBankDetails = new BankAccountDetails(
            NON_GSTIN_BANK_DETAILS,
            page
        );
        await PROCESS_TEST.step('Click Invite Vendor', async () => {
            await withnogstin.clickLinkInviteVendor('Vendor Invitations');
            await vendorOnboarding.clickCopyLink();
            await vendorOnboarding.notification.checkToastSuccess(
                'Link Successfully Copied!!!'
            );
        });

        await PROCESS_TEST.step('Open Copied Link', async () => {
            URL = await vendorOnboarding.linkURL();
            await vendorOnboarding.closeDialog();
            await vendorOnboarding.logOut();
            await vendorOnboarding.init(URL);
        });

        await PROCESS_TEST.step('Signup - Vendor Onboarding', async () => {
            await withnogstin.clickButton('Sign Up');
            const signup = new SignupHelper(page);
            await signup.fillSignup(SignupInfo);
            await signup.clickButton('Next');
        });

        //Verifies account after signup
        await PROCESS_TEST.step('Verify Email', async () => {
            const verifyEmail = new VerifyEmailHelper(page);
            await verifyEmail.fillCode('1');
            await verifyEmail.clickButton('Verify →');
            await withnogstin.clickButton('Continue →');
        });

        await PROCESS_TEST.step('Create Business Client', async () => {
            await withnogstin.clickButton('Create New Business');
            await withnogstin.setCheckbox('No');
        });

        await PROCESS_TEST.step('Fill Business Details', async () => {
            await vendorOnboarding.form.fillFormInputInformation(
                vendorNonGstinSchema,
                vendorNonGstinInfo
            );
            // await withnogstin.fillVendorDetails([vendorNonGstinInfo]);
            await withnogstin.clickButton('Next');
            await vendorOnboarding.notification.checkToastSuccess(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Fill Document Details', async () => {
            await vendorOnboarding.clickButton(' Add New Document');
            await vendorOnboarding.dialog.checkDialogTitle('Add New Document');
            await vendorOnboarding.form.checkIsMandatoryFields(
                LOWER_TDS_DETAILS_SCHEMA
            );
            await vendorOnboarding.form.fillFormInputInformation(
                LOWER_TDS_DETAILS_SCHEMA,
                NON_GSTIN_LOWER_TDS_DETAILS
            );

            await vendorOnboarding.form.submitButton();
        });

        await PROCESS_TEST.step('Fill Bank Account Details', async () => {
            await getBankDetails.validateBankAccountName();
            // await getBankDetails.fillBankAccount();
            await vendorOnboarding.form.fillFormInputInformation(
                NON_GSTIN_BANK_DETAILS_SCHEMA,
                NON_GSTIN_BANK_DETAILS
            );

            await withnogstin.checkWizardNavigationClickDocument(
                'Bank Account'
            );
        });
        await PROCESS_TEST.step('Verify Bank Account Details', async () => {
            const ifscBankDetails =
                await getBankDetails.vendorIfscDetailsValidation();

            expect(ifscBankDetails, chalk.red('Bank IFSC Code match')).toBe(
                getBankDetails.bankDetails.address
            );

            await getBankDetails.vendorIfscLogoVisibilityValidation();
            await withnogstin.clickButton('Previous');
            await withnogstin.clickButton('Next');

            // await getBankDetails.fillBankAccount();
            await vendorOnboarding.form.fillFormInputInformation(
                NON_GSTIN_BANK_DETAILS_SCHEMA,
                NON_GSTIN_BANK_DETAILS
            );

            await withnogstin.checkWizardNavigationClickDocument(
                'Bank Account'
            );
            await vendorOnboarding.form.submitButton('Next');
            // expect(
            //     await page.getByText('Onboarding Completed').isVisible(),
            //     chalk.red('Onboarding Completed text visibility')
            // ).toBe(true);
            await vendorOnboarding.verifyOnboardingCompleted();
            await withnogstin.clickButton('Close');
        });
    });

    PROCESS_TEST('TCVO004', async ({ page }) => {
        const withnogstin = new VendorManagedWithoutGSTIN(page);
        const vendorOnboarding = new VendorOnboarding(
            NON_GSTIN_LOWER_TDS_DETAILS,
            page
        );
        const invitationDetails = new VendorInvitationDetails(
            NON_GSTIN_LOWER_TDS_DETAILS,
            NON_GSTIN_LOWER_TDS_DETAILS,
            page
        );
        const signIn = new SignInHelper(page);

        await PROCESS_TEST.step('SignIn as Vendor', async () => {
            await vendorOnboarding.logOut();
            await signIn.signInPage(SignupInfo.email, SignupInfo.password);
            await vendorOnboarding.init(URL);
        });

        await PROCESS_TEST.step('Without GSTIN Client Connect', async () => {
            await withnogstin.clickButton('Connect with Client');
        });
        await PROCESS_TEST.step('Client Invitation Field', async () => {
            // await vendorOnboarding.clientInvitation(
            //     vendorNonGstinInfo.trade_name,
            //     ''
            // );

            await withnogstin.clickButton('Next');
            await vendorOnboarding.uploadImageDocuments();

            await withnogstin.clickButton('Submit');

            //Adding custom Timeout
            test.slow();
            await vendorOnboarding.notification.checkToastSuccess(
                'Successfully saved'
            );
            // expect(
            //     await withnogstin.toastMessage(),
            //     chalk.red('ToastMessage match')
            // ).toBe('Successfully created');
        });

        await PROCESS_TEST.step('Client Verify and Approve', async () => {
            expect(
                await invitationDetails.checkNonGstinFrom(),
                chalk.red('Business Name does not matched')
            ).toBe(vendorNonGstinInfo.name);
            expect(
                await invitationDetails.checkNonGstinClient(),
                chalk.red('Client Name does not matched')
            ).toBe(clientGstinInfo.trade_name + ' ');

            expect(
                await invitationDetails.checkGstinFromNonGstin(),
                chalk.red('GSTIN does not matched')
            ).toBe('Not Registered Business');
            expect(
                await invitationDetails.checkNonGstinClientGSTIN(),
                chalk.red('Client Gstin does not matched')
            ).toBe(clientGstinInfo.gstin);
        });

        await PROCESS_TEST.step('Check Uploaded Doucments', async () => {
            await invitationDetails.checkDocument('COI');
            await invitationDetails.checkDocument('Pan Card');
            await invitationDetails.checkDocument('MSME');
            await invitationDetails.checkDocument('Lower TDS');
            await invitationDetails.checkDocument('Bank');
        });
    });
});
