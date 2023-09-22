import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import GenericNonGstinCardHelper, {
    nonGstinDataType,
} from '@/helpers/CommonCardHelper/genericNonGstin.card.helper';
import {
    BusinessManagedOnboarding,
    WithoutGstinBusinessManagedOnboarding,
} from '@/helpers/VendorOnboardingHelper/businessManagedOnboarding.helper';
import { VendorInfo_NonGstin } from '@/utils/required_data';
const { expect, describe } = PROCESS_TEST;

const data = {
    name: 'Sirjan',
    address: 'dfaskdf',
};

//Business Managed vendor onboarding with GSTIN
describe('TCBV002', () => {
    const BusinessManagedInfo: nonGstinDataType = {
        trade_name: 'Hello India',
        display_name: '',
        address: '',
        pin_code: '',
        business_type: '',
    };
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
            const businessGstin = new GenericNonGstinCardHelper(
                BusinessManagedInfo,
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
