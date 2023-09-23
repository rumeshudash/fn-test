import { PROCESS_TEST } from '@/fixtures';
import GenericNonGstinCardHelper, {
    nonGstinDataType,
} from '@/helpers/CommonCardHelper/genericNonGstin.card.helper';
import { BusinessManagedOnboarding } from '@/helpers/VendorOnboardingHelper/Business_ManagedHelper/businessManagedOnboarding.helper';
import {
    VendorInfoSchema,
    WithoutGstinBusinessManagedOnboarding,
} from '@/helpers/VendorOnboardingHelper/Business_ManagedHelper/withoutGstOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { VendorInfo_NonGstin } from '@/utils/required_data';

const { expect, describe } = PROCESS_TEST;

const data = {
    name: 'Sirjan',
    address: 'dfaskdf',
};

//Business Managed vendor onboarding with GSTIN
describe('Business Managed without GSTIN - Vendor Onboarding', () => {
    const BusinessManagedInfo: nonGstinDataType = {
        trade_name: 'Hidesign India Pvt Ltd',
        // display_name: '',
        value: '33AACCH0586R1Z6',
        address:
            'EXPRESS AVENUE, 49/50 L-WHITES ROAD, ROYAPETTAH, SHOP NO.S 161 B, Chennai, 600014, Tamil Nadu, NA, FIRST FLOOR',
        pin_code: 'AACCH0586R',
        business_type: 'Private Limited',
    };

    const VendorInfo = {
        name: `ABC${generateRandomNumber()}`,
        type_id: 'Partnership Firm',
        pincode: '110001',
        address: 'Delhi',
        email: `emails${generateRandomNumber()}@test.com`,
        mobile: 9876553123,
    };

    PROCESS_TEST('TCBV002', async ({ page }) => {
        const businessManagedOnboarding = new BusinessManagedOnboarding(page);
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
            'Non GST Registered'
        );

        await withoutGstin.selectClientTradeName();
        businessGstin.ignore_test_fields = [
            'gstin_business_address',
            'gstin_business_type',
            'gstin_business_pan',
        ];
        await businessGstin.gstinInfoCheck();
        // await withoutGstin.addVendorAccount();
        await businessManagedOnboarding.form.fillFormInputInformation(
            VendorInfoSchema,
            VendorInfo
        );

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
    });
});
