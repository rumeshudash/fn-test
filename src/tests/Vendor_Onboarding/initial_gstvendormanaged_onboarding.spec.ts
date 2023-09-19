import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    BankAccountDetails,
    VendorInvitationDetails,
    VendorOnboarding,
    VendorOnboardingWithGSTIN,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { IMAGE_NAME, clientGstinInfo } from '@/utils/required_data';
// import { test } from '@playwright/test';
// import { BANKDETAILS } from '@/utils/required_data';
import chalk from 'chalk';

//Vendor and Client Details
const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe.configure({ mode: 'serial' });
describe('FinOps Portal>Vendor Onboarding through Invitation link(GST Registered Vendor)', () => {
    let URL: string;

    const VendorManagedGstinInfo: gstinDataType = {
        trade_name: 'Apple India Pvt Ltd',
        gstin: '29AABCA1906H1ZY',
        pan_number: 'AABCA1906H',
        business_type: 'Private Limited',
        address:
            'UB City No. 24, Vittal Mallaya Road, Bengaluru, Concord Tower C, Bengaluru Urban, 12.9715610000001, 560001, Karnataka, Building, 8th 9th 12th 13th 18th and 19th, 77.5964680000001',
        status: 'Active',
    };
    const vendorGstinInfoSchema = {
        gstin: {
            type: 'text',
            required: true,
        },
    };

    //For Vendor Managed Onboarding GSTIN
    const LOWER_TDS_DETAILS = {
        type_id: 'Lower TDS',
        identifier: '333333333',

        expiry_date: '22-02-2023',
        custom_field_data: {
            percentage: '22',
        },
    };

    const LOWER_TDS_DETAILS_SCHEMA = {
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

    //For Vendor Managed Onboarding GSTIN
    const BANKDETAILS = {
        bankName: VendorManagedGstinInfo.trade_name,
        account_number: '1234567',
        re_account_number: '1234567',
        ifsc_code: 'HDFC0000002',
        bank_ifsc_info: 'HDFC0000002,MUMBAI - KHAR WEST',
    };

    const BANKDETAILS_SCHEMA = {
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
    PROCESS_TEST('TCVO001', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(BANKDETAILS, page);
        const vendorOnboarding = new VendorOnboarding(LOWER_TDS_DETAILS, page);
        const withgstin = new VendorOnboardingWithGSTIN(
            VendorManagedGstinInfo,
            page
        );
        await vendorOnboarding.clickLinkInviteVendor('Vendor Invitations');
        await vendorOnboarding.clickCopyLink();
        await vendorOnboarding.notification.checkToastSuccess(
            'Link Successfully Copied!!!'
        );

        // expect(
        //     await vendorOnboarding.toastMessage(),
        //     chalk.red('ToastMessage match')
        // ).toBe('Link Successfully Copied!!!');

        await PROCESS_TEST.step('Open Copied Link', async () => {
            URL = await vendorOnboarding.linkURL();
            // await vendorOnboarding.closeDialog();
            await vendorOnboarding.dialog.closeDialog();
            await vendorOnboarding.logOut();
            await vendorOnboarding.init(URL);
        });

        await PROCESS_TEST.step('Signup - Vendor Onboarding', async () => {
            await vendorOnboarding.clickButton('Sign Up');
            const signup = new SignupHelper(page);
            await signup.fillSignup({
                name: 'User130823',
                email: `User${generateRandomNumber()}@test.com`,
                password: '123456',
                confirm_password: '123456',
            });
            await signup.clickButton('Next');
        });

        //Verifies account after signup
        await PROCESS_TEST.step('Verify Email', async () => {
            const verifyEmail = new VerifyEmailHelper(page);
            await verifyEmail.fillCode('1');
            await verifyEmail.clickButton('Verify →');
            await vendorOnboarding.clickButton('Continue →');
        });

        await PROCESS_TEST.step('Create Business Client', async () => {
            await vendorOnboarding.clickButton('Create New Business');
            await vendorOnboarding.setCheckbox('Yes');
            // await withgstin.fillGstinInput();
            await vendorOnboarding.form.fillFormInputInformation(
                vendorGstinInfoSchema,
                VendorManagedGstinInfo
            );
            await vendorOnboarding.beforeGstinNameNotVisibleDisplayName();
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Documents'
            );
        });

        //Verifies vendor details in card with provided one
        await PROCESS_TEST.step(
            'Verify Vendor GSTIN Info then Save',
            async () => {
                await withgstin.gstinInfoCheck();
                await withgstin.gstinDisplayName(
                    VendorManagedGstinInfo.trade_name
                );
                await vendorOnboarding.clickButton('Next');
                await vendorOnboarding.notification.checkToastSuccess(
                    'Successfully saved'
                );
                // expect(
                //     await vendorOnboarding.toastMessage(),
                //     chalk.red('ToastMessage match')
                // ).toBe('Successfully saved');
            }
        );

        await PROCESS_TEST.step('Documents - Vendor Onboarding', async () => {
            // await vendorOnboarding.fillDocuments(); // LOWER_TDS_DETAILS
            await vendorOnboarding.clickButton(' Add New Document');
            // await vendorOnboarding.dialog.checkConfirmDialogOpenOrNot();
            await vendorOnboarding.dialog.checkDialogTitle('Add New Document');
            await vendorOnboarding.form.checkMandatoryFields(
                LOWER_TDS_DETAILS_SCHEMA
            );
            await vendorOnboarding.form.fillFormInputInformation(
                LOWER_TDS_DETAILS_SCHEMA,
                LOWER_TDS_DETAILS
            );
            await vendorOnboarding.form.submitButton();
            await vendorOnboarding.notification.getErrorMessage();
            await vendorOnboarding.clickButton('Next');

            // await vendorOnboarding.form.checkAllMandatoryInputErrors(
            //     LOWER_TDS_DETAILS_SCHEMA
            // );
        });

        //Adding Bank Account to vendor
        await PROCESS_TEST.step(
            'Bank Account - Vendor Onboarding',
            async () => {
                // await getBankDetails.fillBankAccount(); //BANKDETAILS
                await vendorOnboarding.form.fillFormInputInformation(
                    BANKDETAILS_SCHEMA,
                    BANKDETAILS
                );
                await vendorOnboarding.checkWizardNavigationClickDocument(
                    'Bank Account'
                );

                const ifscBankDetails =
                    await getBankDetails.vendorIfscDetailsValidation();
                expect(ifscBankDetails, 'IFSC fetched data check').toBe(
                    BANKDETAILS.bank_ifsc_info
                );
                await getBankDetails.vendorIfscLogoVisibilityValidation();

                await vendorOnboarding.clickButton('Next');
                expect(
                    await page.getByText('Onboarding Completed').isVisible(),
                    chalk.red('Onboarding text visibility')
                ).toBe(true);
            }
        );
    });

    PROCESS_TEST('TCCC002', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(BANKDETAILS, page);
        const vendorOnboarding = new VendorOnboarding(LOWER_TDS_DETAILS, page);
        const invitationDetails = new VendorInvitationDetails(
            BANKDETAILS,
            LOWER_TDS_DETAILS,
            page
        );
        const withgstin = new VendorOnboardingWithGSTIN(
            VendorManagedGstinInfo,
            page
        );
        // await vendorOnboarding.clickLinkInviteVendor('Vendor Invitations');
        // await vendorOnboarding.clickCopyLink();

        // // expect(
        // //     await vendorOnboarding.toastMessage(),
        // //     chalk.red('ToastMessage match')
        // // ).toBe('Link Successfully Copied!!!');

        // await PROCESS_TEST.step('Open Copied Link', async () => {
        //     const URL = await vendorOnboarding.linkURL();
        //     await vendorOnboarding.closeDialog();
        //     await vendorOnboarding.logOut();
        //     await vendorOnboarding.init(URL);
        // });

        // await PROCESS_TEST.step('Signup - Vendor Onboarding', async () => {
        //     vendorOnboarding.clickButton('Sign Up');
        //     const signup = new SignupHelper(page);
        //     await signup.fillSignup({
        //         name: 'User130823',
        //         email: `User${generateRandomNumber()}@test.com`,
        //         password: '123456',
        //         confirm_password: '123456',
        //     });
        //     await signup.clickButton('Next');
        // });

        // //Verifies account after signup
        // await PROCESS_TEST.step('Verify Email', async () => {
        //     const verifyEmail = new VerifyEmailHelper(page);
        //     await verifyEmail.fillCode('1');
        //     await verifyEmail.clickButton('Verify →');
        //     await vendorOnboarding.clickButton('Continue →');
        // });

        // await PROCESS_TEST.step('Create Business Client', async () => {
        //     await vendorOnboarding.clickButton('Create New Business');
        //     await vendorOnboarding.setCheckbox('Yes');
        //     await withgstin.fillGstinInput();
        //     await vendorOnboarding.beforeGstinNameNotVisibleDisplayName();
        //     await vendorOnboarding.checkWizardNavigationClickDocument(
        //         'Documents'
        //     );
        // });

        // //Verifies vendor details in card with provided one
        // await PROCESS_TEST.step(
        //     'Verify Vendor GSTIN Info then Save',
        //     async () => {
        //         // vendorOnboarding.gstin_data = vendorGstinInfo;
        //         await withgstin.gstinInfoCheck();
        //         await withgstin.gstinDisplayName(
        //             VendorManagedGstinInfo.trade_name
        //         );
        //         await vendorOnboarding.clickButton('Next');
        //         await vendorOnboarding.notification.checkToastSuccess(
        //             'Successfully saved'
        //         );
        //         // expect(
        //         //     await vendorOnboarding.toastMessage(),
        //         //     chalk.red('ToastMessage match')
        //         // ).toBe('Successfully saved');
        //     }
        // );

        // await PROCESS_TEST.step('Documents - Vendor Onboarding', async () => {
        //     await vendorOnboarding.fillDocuments(); // LOWER_TDS_DETAILS
        // });

        // //Adding Bank Account to vendor
        // await PROCESS_TEST.step(
        //     'Bank Account - Vendor Onboarding',
        //     async () => {
        //         await vendorOnboarding.clickButton('Next');
        //         await getBankDetails.fillBankAccount();
        //         await vendorOnboarding.checkWizardNavigationClickDocument(
        //             'Bank Account'
        //         );

        //         // bankIFSCCode = await getBankDetails.bankIFSCCode();

        //         const ifscBankDetails =
        //             await getBankDetails.vendorIfscDetailsValidation();
        //         expect(ifscBankDetails, chalk.red('Bank IFSC Code match')).toBe(
        //             getBankDetails.bankDetails.address
        //         );
        //         await getBankDetails.vendorIfscLogoVisibilityValidation();

        //         // expect(
        //         //     bankIFSCCode.slice(0, -1),
        //         //     'Bank IFSC Code does not match'
        //         // ).toBe(BANKDETAILS[0].ifsc);

        //         await vendorOnboarding.clickButton('Next');
        //         expect(
        //             await page.getByText('Onboarding Completed').isVisible(),
        //             chalk.red('Onboarding Completed text visibility')
        //         ).toBe(true);
        //         await vendorOnboarding.clickButton('Close');
        //     }
        // );

        //Connects client to vendor
        await PROCESS_TEST.step('Client Connect', async () => {
            await vendorOnboarding.init(URL);
            // vendorOnboarding.gstin_data = clientGstinInfo;
            await vendorOnboarding.clickButton('Connect With Client');

            await vendorOnboarding.clientInvitation(
                VendorManagedGstinInfo.trade_name,
                clientGstinInfo.trade_name
                    ? clientGstinInfo.trade_name
                    : clientGstinInfo.gstin
            );
        });

        //Verifies client details in card with provided one
        await PROCESS_TEST.step('Verify Client GSTIN Info', async () => {
            withgstin.gstin_data = clientGstinInfo;
            withgstin.ignore_test_fields = ['gstin_business_address'];

            await withgstin.gstinInfoCheck();
            await getBankDetails.bankAccountNumber();
            await vendorOnboarding.clickButton('Next');
        });

        await PROCESS_TEST.step(
            'Upload Mandatory Documents - Client Connect',
            async () => {
                // expect(
                //     await vendorOnboarding.checkButtonVisibility('Submit'),
                //     chalk.red('Button visibility')
                // ).not.toBe(true);

                await vendorOnboarding.uploadImageDocuments(IMAGE_NAME);
                await vendorOnboarding.notification.checkToastSuccess(
                    'Successfully saved'
                );
                // expect(
                //     await vendorOnboarding.toastMessage(),
                //     chalk.red('ToastMessage match')
                // ).toBe('Successfully saved');
                // expect(
                //     await vendorOnboarding.checkButtonVisibility('Submit'),
                //     chalk.red('Submit Button visibility')
                // ).toBe(true);
                await vendorOnboarding.clickButton('Submit');
                await vendorOnboarding.notification.checkToastSuccess(
                    'Successfully created'
                );
                // expect(
                //     await vendorOnboarding.toastMessage(),
                //     chalk.red('ToastMessage match')
                // ).toBe('Successfully created');
            }
        );

        //verifies vendor and client details with provided one
        await PROCESS_TEST.step('Verify Vendor and Client', async () => {
            const invitationDetails = new VendorInvitationDetails(
                BANKDETAILS,
                LOWER_TDS_DETAILS,
                page
            );

            expect(
                await invitationDetails.checkFrom(),
                chalk.red('From Vendor match')
            ).toBe(VendorManagedGstinInfo.trade_name + '…');
            expect(
                await invitationDetails.checkFromGSTIN(),
                chalk.red('From Vendor Gstin match')
            ).toBe(VendorManagedGstinInfo.gstin);

            expect(
                await invitationDetails.checkClient(),
                chalk.red('To client match')
            ).toBe(clientGstinInfo.trade_name + ' ');
            expect(
                await invitationDetails.checkClientGSTIN(),
                chalk.red('To client Gstin match')
            ).toBe(clientGstinInfo.gstin);
        });

        await PROCESS_TEST.step('Check Uploaded Documents', async () => {
            await invitationDetails.checkDocument('GSTIN Certificate');
            await invitationDetails.checkDocument('Pan Card');
            await invitationDetails.checkDocument('MSME');
            await invitationDetails.checkDocument('Lower TDS');
            await invitationDetails.checkDocument('Bank');
        });

        // await test.step('Client Logout and FinOps Login ', async () => {
        //     await vendorOnboarding.logOut();
        //     const signIn = new SignInHelper(page);
        //     await signIn.signInPage('newtestauto@company.com', '123456');
        // });
    });
});
