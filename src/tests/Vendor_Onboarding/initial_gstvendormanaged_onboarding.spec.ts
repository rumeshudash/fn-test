import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import { VendorInvitationDetails } from '@/helpers/VendorOnboardingHelper/InvitationDetails.helper';
import {
    BANKDETAILS_SCHEMA,
    Client_Invitation_Info_Schema,
    LOWER_TDS_DETAILS_SCHEMA,
    VendorOnboarding,
    VendorOnboardingWithGSTIN,
    vendorGstinInfoSchema,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { BankAccountDetails } from '@/helpers/VendorOnboardingHelper/bankDetails.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import chalk from 'chalk';

//Vendor and Client Details
const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe.configure({ mode: 'serial' });
describe('FinOps Portal - Vendor Onboarding through Invitation link (GST Registered Vendor)', () => {
    let URL: string;

    const VendorManagedGstinInfo: gstinDataType = {
        trade_name: 'Ola Fleet Technologies Private Limited',
        gstin: '03AAKCA2311H1ZA',
        pan_number: 'AAKCA2311H',
        business_type: 'Private Limited',
        address:
            'Gobind Nagar, Ferozepur Road, Ludhiana, B XX 2429, Ludhiana, 30.912695, 141001, Punjab, Building, Ground Floor, 75.8186910000001',
        status: 'Active',
    };

    const CLIENTID = {
        id: '57649556',
    };

    //For Vendor Managed Onboarding GSTIN
    const LOWER_TDS_DETAILS = {
        type_id: 'Lower TDS',
        identifier: '333333333',

        expiry_date: '22-02-2023',
        custom_field_data: {
            percentage: '32',
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

    const clientGstinInfo: gstinDataType = {
        trade_name: 'Flipkart India Private Limited',
        gstin: '03AABCF8078M2ZA',
        business_type: 'Private Limited',
        address:
            'Khasra No.306, 348/305, Village Katna,, Teshil Payal, Unit No.1, Ludhiana, 141113, Punjab, NA, Khewat No.79/80,',
        pan_number: 'AABCF8078M',
        status: 'Active',
    };
    const Client_Invitation_Info = {
        vendor_account_id: VendorManagedGstinInfo.trade_name, // vendor_account_id: 'Ujjivan Small Finance Bank Limited', //Bank should be connected on vendor account
        business_account_id: clientGstinInfo.trade_name, //Client Business added from clientGstinInfo
        // bank_id: 'ICIC0000002', //Bank must be availabe on vendor account
        bank_id: BANKDETAILS.ifsc_code,
        poc: 'vasant02@harbourfront.com',
    };
    const SignupInfo = {
        name: 'User130823',
        email: `user${generateRandomNumber()}@test.com`,
        password: '123456',
        confirm_password: '123456',
    };

    PROCESS_TEST('TCVO001', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(BANKDETAILS, page);
        const vendorOnboarding = new VendorOnboarding(LOWER_TDS_DETAILS, page);
        const withgstin = new VendorOnboardingWithGSTIN(
            VendorManagedGstinInfo,
            page
        );

        await PROCESS_TEST.step('Copy Link', async () => {
            await vendorOnboarding.clickLinkInviteVendor('Vendor Invitations');
            await vendorOnboarding.clickCopyLink();
            await vendorOnboarding.notification.checkToastSuccess(
                'Link Successfully Copied!!!'
            );
        });

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
            await signup.fillSignup(SignupInfo);
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
        });

        //Verifies vendor details in card with provided one

        await PROCESS_TEST.step('Documents - Vendor Onboarding', async () => {
            // await vendorOnboarding.fillDocuments(); // LOWER_TDS_DETAILS
            await vendorOnboarding.clickButton(' Add New Document');
            // await vendorOnboarding.dialog.checkConfirmDialogOpenOrNot();
            await vendorOnboarding.dialog.checkDialogTitle('Add New Document');
            await vendorOnboarding.form.checkIsMandatoryFields(
                LOWER_TDS_DETAILS_SCHEMA
            );
            await vendorOnboarding.form.fillFormInputInformation(
                LOWER_TDS_DETAILS_SCHEMA,
                LOWER_TDS_DETAILS
            );

            await vendorOnboarding.verifyBusinessDetails(
                'GST Certificate',
                VendorManagedGstinInfo.gstin
            );
            await vendorOnboarding.verifyBusinessDetails(
                'Pan Card',
                VendorManagedGstinInfo.pan_number
            );
            await vendorOnboarding.form.submitButton();
            // await vendorOnboarding.form.checkInputError(
            //     'custom_field_data.percentage',
            //     LOWER_TDS_DETAILS_SCHEMA
            // );
            // await vendorOnboarding.notification.getErrorMessage();
            await vendorOnboarding.notification.checkToastSuccess(
                'Successfully saved'
            );
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
                await vendorOnboarding.verifyOnboardingCompleted();
            }
        );
    });

    PROCESS_TEST('TCCC002', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(BANKDETAILS, page);
        const vendorOnboarding = new VendorOnboarding(LOWER_TDS_DETAILS, page);
        const signIn = new SignInHelper(page);
        const invitationDetails = new VendorInvitationDetails(
            BANKDETAILS,
            LOWER_TDS_DETAILS,
            page
        );
        const withgstin = new VendorOnboardingWithGSTIN(
            VendorManagedGstinInfo,
            page
        );

        await PROCESS_TEST.step('SignIn as Client', async () => {
            await signIn.logOut();
            await signIn.signInPage(SignupInfo.email, SignupInfo.password);
            // await signIn.clickButton("Submit")
            await vendorOnboarding.init(URL);
        });
        //Connects client to vendor
        await PROCESS_TEST.step(
            'Client Connect - Verifies then Fill',
            async () => {
                // await vendorOnboarding.init(URL);
                await vendorOnboarding.clickButton('Connect With Client');

                await PROCESS_TEST.step(
                    'Verify Business and Client Auto Fetch',
                    async () => {
                        await vendorOnboarding.verifyAutoFetchBusinessName(
                            'vendor_account_id',
                            VendorManagedGstinInfo.trade_name
                        );
                        await vendorOnboarding.verifyClientId(CLIENTID.id);
                        // 'business_account_id'
                        // clientGstinInfo.trade_name
                        await vendorOnboarding.verifyAutoFetchClientName();
                    }
                );
                await vendorOnboarding.form.fillFormInputInformation(
                    Client_Invitation_Info_Schema,
                    Client_Invitation_Info
                );
            }
        );

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
                await vendorOnboarding.form.checkSubmitIsDisabled('Submit');
                await vendorOnboarding.uploadImageDocuments();
                await vendorOnboarding.form.submitButton('Submit');
                await vendorOnboarding.notification.checkToastSuccess(
                    'Successfully created'
                );
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
            ).toBe(Client_Invitation_Info.vendor_account_id + '…');

            expect(
                await invitationDetails.checkClient(),
                chalk.red('To client match')
            ).toBe(Client_Invitation_Info.business_account_id + ' ');
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
    });
});
