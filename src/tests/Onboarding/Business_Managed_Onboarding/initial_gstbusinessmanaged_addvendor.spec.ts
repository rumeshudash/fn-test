import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import {
    BusinessManagedOnboarding,
    GstinBusinessManagedOnboarding,
} from '@/helpers/VendorOnboardingHelper/businessManagedOnboarding.helper';
import { businessVendorGstin } from '@/utils/required_data';
import { test } from '@playwright/test';
const { expect, describe } = PROCESS_TEST;

//Business Managed vendor onboarding with GSTIN
describe('TCBV001', () => {
    const BusinessInfo = {
        business_account_id: 'Hidesign India Pvt Ltd',
        gstin: '33AACCH0586R1Z6',
        // business_type: '',
        // address: '',
        status: 'Active',
        // pan_number: '',

        // displayName: businessVendorGstin.trade_name.slice(5),
    };

    const BusinessInfoGeneric: gstinDataType = {
        trade_name: BusinessInfo.business_account_id,
        gstin: BusinessInfo.gstin,
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
    const VendorClientInfo = {
        trade_name: 'Hidesign India Pvt Ltd', //Client Business Name
        // displayName: businessVendorGstin.trade_name.slice(5),
        value: businessVendorGstin.gstin, //Vendor GSTIN
        vendorEmail: 'meatshop@gmail.com',
        vendorNumber: '9876543210',
    };

    const VendorInfo = {
        gstin: '29AKAPD8772G1Z0',
        updated_display_name: 'Updated Vendor',
    };

    const VendorSchema = {
        gstin: {
            type: 'text',
            required: true,
        },
    };
    PROCESS_TEST(
        'Business Managed with GSTIN - Vendor Onboarding',
        async ({ page }) => {
            const businessManagedOnboarding = new BusinessManagedOnboarding(
                page
            );
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
                        await withGstin.editDisplayName(
                            VendorInfo.updated_display_name
                        );
                        await withGstin.expandClientInfoCard();
                        await vendorGstin.gstinInfoCheck();
                        await businessManagedOnboarding.saveAndCreateCheckbox();

                        await businessManagedOnboarding.clickButton('Save');
                    });
                }
            );

            await businessManagedOnboarding.afterSaveAndCreateValidation();
            // expect
            //     .soft(
            //         await businessManagedOnboarding.toastMessage(),
            //         'Successfully saved is not shown'
            //     )
            //     .toBe('Successfully saved!');
            await businessManagedOnboarding.verifyBusinessManaged();
        }
    );
});
