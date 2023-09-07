import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import {
    BusinessManagedOnboarding,
    GstinBusinessManagedOnboarding,
    WithoutGstinBusinessManagedOnboarding,
} from '@/helpers/VendorOnboardingHelper/businessManagedOnboarding.helper';
import {
    VendorClientInfo,
    VendorInfo_NonGstin,
    businessVendorGstin,
    clientGstinInfo,
} from '@/utils/required_data';
import { test } from '@playwright/test';
const { expect, describe } = PROCESS_TEST;

//Business Managed vendor onboarding with GSTIN
describe('TCBV002', () => {
    PROCESS_TEST(
        'Business Managed without GSTIN - Add Vendor',
        async ({ page }) => {
            const businessManagedOnboarding = new BusinessManagedOnboarding(
                page
            );
            //To fill Form with client Name and Vendor Info
            const withoutGstin = new WithoutGstinBusinessManagedOnboarding(
                VendorInfo_NonGstin,
                page
            );

            //To verify Client Info in card
            const businessGstin = new GenericGstinCardHelper(
                clientGstinInfo,
                page
            );

            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.verifyVendorPageURL();
            await businessManagedOnboarding.clickAddIcon();
            await businessManagedOnboarding.clickNavigationTab(
                'Non GSTIN Registered'
            );

            await withoutGstin.selectClientTradeName();
            businessGstin.ignore_test_fields = [
                'gstin_business_address',
                'gstin_business_type',
                'gstin_business_pan',
            ];
            await businessGstin.gstinInfoCheck();
            await withoutGstin.addVendorAccount();

            // await businessManagedOnboarding.saveAndCreateCheckbox();

            await businessManagedOnboarding.clickButton('Save');
            // await businessManagedOnboarding.afterSaveAndCreateValidation();
            // expect(await businessManagedOnboarding.toastMessage()).toBe(
            //     'Successfully saved'
            // );
            await businessManagedOnboarding.verifyBusinessManaged();
            await businessManagedOnboarding.verifyNonGstinStatus();

            //To Verify Vendor In List
            await businessManagedOnboarding.clickVendor('My Vendors');
            await withoutGstin.searchVendor();
            await withoutGstin.verifyVendorInList();
        }
    );
});
