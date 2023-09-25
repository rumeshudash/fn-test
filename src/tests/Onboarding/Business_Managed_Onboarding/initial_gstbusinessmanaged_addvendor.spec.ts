import { PROCESS_TEST } from '@/fixtures';
import { FormHelper } from '@/helpers/BaseHelper/form.helper';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { CreateBusinessHelper } from '@/helpers/SignupHelper/createBusiness.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import { BusinessManagedOnboarding } from '@/helpers/VendorOnboardingHelper/Business_ManagedHelper/businessManagedOnboarding.helper';
import {
    GstinBusinessManagedOnboarding,
    VendorSchema,
} from '@/helpers/VendorOnboardingHelper/Business_ManagedHelper/withGstOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';

const { expect, describe } = PROCESS_TEST;

//Business Managed vendor onboarding with GSTIN
describe('FinOps_VonboardingBmanaged - Business Managedwith GSTIN', () => {
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

    const finopsBusinessInfo = {
        gstin: '27AACCD0597N1Z8',
        mobile: 9876543210,
        email: `bus${generateRandomNumber()}@test.com`,
    };

    const BusinessInfo = {
        business_account_id: finopsBusinessInfo.gstin,
        // gstin: '27AACCD0597N1Z8',
        // business_type: '',
        // address: '',
        status: 'Active',
        // pan_number: '',

        // displayName: businessVendorGstin.trade_name.slice(5),
    };

    const BusinessInfoGeneric: gstinDataType = {
        trade_name: 'Drupe Engineering Private Limited',
        gstin: BusinessInfo.business_account_id,
        business_type: '',
        address: '',
        status: BusinessInfo.status,
        pan_number: '',
    };

    const BusinessSchema = {
        business_account_id: {
            type: 'reference_select',
            required: true,
        },
    };
    //Data used in Business Managed Onboarding with GSTIN
    const businessVendorGstin: gstinDataType = {
        trade_name: 'Pvr Limited',
        gstin: '03AAACP4526D1Z0',
        pan_number: 'AAACP4526D',
        business_type: 'Proprietorship',
        address:
            'Flamez Mall, Ferozepur Road, Ludhiana, PVR Flamez, Ludhiana, Ludhiana, 141001, Punjab, NA, 3rd Floor',
        status: 'Active',
    };
    const VendorClientInfo = {
        trade_name: 'Hidesign India Pvt Ltd', //Client Business Name
        // displayName: businessVendorGstin.trade_name.slice(5),
        value: businessVendorGstin.gstin, //Vendor GSTIN
        vendorEmail: 'meatshop@gmail.com',
        vendorNumber: '9876543210',
    };

    const VendorInfo = {
        gstin: businessVendorGstin.gstin,
        email: `email${generateRandomNumber()}@test.com`,
        mobile: 9876421231,
        // updated_display_name: 'Updated Vendor',
    };

    const signUpInfo = {
        name: 'User130823',
        email: `user${generateRandomNumber()}@test.com`,
        password: '123456',
        confirm_password: '123456',
    };

    PROCESS_TEST('TCBV001', async ({ page }) => {
        const businessManagedOnboarding = new BusinessManagedOnboarding(page);
        //To fill Form with client Name and Vendor Info
        const withGstin = new GstinBusinessManagedOnboarding(
            VendorClientInfo,
            page
        );

        //To verify Client Info in card
        const businessGstin = new GenericGstinCardHelper(
            BusinessInfoGeneric,
            page
        );

        //To verify Vendor Info in card
        const vendorGstin = new GenericGstinCardHelper(
            businessVendorGstin,
            page
        );

        const signIn = new SignInHelper(page);
        await PROCESS_TEST.step('Create New User', async () => {
            const createBusiness = new CreateBusinessHelper(page);
            const form = new FormHelper(page);
            await PROCESS_TEST.step('Create New User', async () => {
                const signup = new SignupHelper(page);
                const verify = new VerifyEmailHelper(page);
                await signup.logOut();
                await signup.init();
                await signup.fillSignup(signUpInfo);
                await signup.clickButton('Next');
                await verify.fillCode('1');
                await verify.clickButton('Verify');
                await verify.clickButton('Continue');
                await createBusiness.fillBusiness({
                    business_name: `Business${generateRandomNumber()}`,
                });
                await createBusiness.clickContinue();
                await createBusiness.init();
            });

            await PROCESS_TEST.step('Create Finops Business', async () => {
                Logger.info(`\n-->Create Business Account.`, `\n`);
                await createBusiness.clickButton('Add Business');
                await form.fillFormInputInformation(
                    formSchema,
                    finopsBusinessInfo
                );
                // await createBusiness.getBusinessName()
                await form.submitButton();
            });

            // await PROCESS_TEST.step('Logout then Login', async () => {
            //     await businessManagedOnboarding.logOut();
            //     await signIn.signInPage('newtestauto@company.com', '123456');
            // });
        });

        await PROCESS_TEST.step('Navigate to Add Vendor', async () => {
            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.verifyVendorPageURL();
            await businessManagedOnboarding.clickAddIcon();
        });

        await PROCESS_TEST.step('verify dialog', async () => {
            await businessManagedOnboarding.dialog.waitForDialogOpen();
            await businessManagedOnboarding.dialog.checkDialogTitle(
                'Add Vendor Account'
            );
        });

        await PROCESS_TEST.step(
            'Fill Client and Vendor Information',
            async () => {
                // await businessManagedOnboarding.setCheckbox('GSTIN Registered');
                await businessManagedOnboarding.clickNavigationTab(
                    'GST Registered'
                );
                await businessManagedOnboarding.form.fillFormInputInformation(
                    BusinessSchema,
                    BusinessInfo
                );
                // await withGstin.selectClientTradeName();

                await PROCESS_TEST.step(
                    'verify client/business gstin info',
                    async () => {
                        businessGstin.ignore_test_fields = [
                            'gstin_business_address',
                            'gstin_business_type',
                            'gstin_business_pan',
                        ];

                        await businessGstin.gstinInfoCheck();
                    }
                );
                await PROCESS_TEST.step('Fill vendor details', async () => {
                    // await withGstin.fillBusinessDetails();
                    await businessManagedOnboarding.form.fillFormInputInformation(
                        VendorSchema,
                        VendorInfo
                    );
                    // await withGstin.expandClientInfoCard();

                    // await withGstin.checkDisplayName();
                    // await withGstin.editDisplayName(
                    //     VendorInfo.updated_display_name
                    // );
                    await withGstin.expandClientInfoCard(
                        businessVendorGstin.trade_name
                    );
                    await vendorGstin.gstinInfoCheck();
                    await businessManagedOnboarding.saveAndCreateCheckbox();

                    await businessManagedOnboarding.form.submitButton();
                    // await businessManagedOnboarding.form.checkInputError(
                    //     'gstin',
                    //     VendorSchema
                    // );
                    await businessManagedOnboarding.notification.getErrorMessage();
                });
            }
        );

        await businessManagedOnboarding.afterSaveAndCreateValidation();
        await businessManagedOnboarding.dialog.closeDialog();
        // expect
        //     .soft(
        //         await businessManagedOnboarding.toastMessage(),
        //         'Successfully saved is not shown'
        //     )
        //     .toBe('Successfully saved!');
        await businessManagedOnboarding.verifyBusinessManaged();
    });
});
