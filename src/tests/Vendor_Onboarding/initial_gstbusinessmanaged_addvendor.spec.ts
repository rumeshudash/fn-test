import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import {
    BusinessManagedOnboarding,
    GstinBusinessManagedOnboarding,
} from '@/helpers/VendorOnboardingHelper/businessManagedOnboarding.helper';
import {
    VendorClientInfo,
    businessVendorGstin,
    clientGstinInfo,
} from '@/utils/required_data';
import { test } from '@playwright/test';
const { expect, describe } = PROCESS_TEST;

//Business Managed vendor onboarding with GSTIN
describe('TCBV001', () => {
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
                clientGstinInfo,
                page
            );

            //To verify Vendor Info in card
            const vendorGstin = new GenericGstinCardHelper(
                businessVendorGstin,
                page
            );

            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.verifyVendorPageURL();
            await businessManagedOnboarding.clickAddIcon();
            // await businessManagedOnboarding.setCheckbox('GSTIN Registered');
            await businessManagedOnboarding.clickNavigationTab(
                'GSTIN Registered'
            );
            await withGstin.selectClientTradeName();
            businessGstin.ignore_test_fields = [
                'gstin_business_address',
                'gstin_business_type',
                'gstin_business_pan',
            ];
            test.slow();
            await businessGstin.gstinInfoCheck();

            await withGstin.fillBusinessDetails();
            // await withGstin.expandClientInfoCard();
            test.slow();
            await withGstin.checkDisplayName();
            await withGstin.editDisplayName();
            await withGstin.expandClientInfoCard();
            await vendorGstin.gstinInfoCheck();
            await businessManagedOnboarding.saveAndCreateCheckbox();

            await businessManagedOnboarding.clickButton('Save');
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
