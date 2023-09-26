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

//Business Managed vendor onboarding with GSTIN
describe('FinOps_VonboardingBmanaged - without GSTIN', () => {
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
        name: `nongst${generateRandomNumber()}`,
        type_id: 'Partnership Firm',
        pincode: '110001',
        address: 'Delhi',
        email: `emails${generateRandomNumber()}@test.com`,
        mobile: 9876553123,
    };

    const vendorInfo_NewName = {
        ...VendorInfo,
        name: `vendor${generateRandomNumber()}`,
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

        await PROCESS_TEST.step('Navigate to form', async () => {
            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.verifyVendorPageURL();
            await businessManagedOnboarding.clickAddIcon();

            await PROCESS_TEST.step('Verify Dialog Form', async () => {
                await businessManagedOnboarding.dialog.waitForDialogOpen();
                await businessManagedOnboarding.dialog.checkDialogTitle(
                    'Add Vendor Account'
                );
            });
            await businessManagedOnboarding.clickNavigationTab(
                'Non GST Registered'
            );
        });
        await PROCESS_TEST.step('Empty Field Submission', async () => {
            // await withoutGstin.selectClientTradeName();

            await businessManagedOnboarding.form.fillFormInputInformation(
                VendorInfoSchema,
                {}
            );
            await businessManagedOnboarding.form.submitButton();
            await businessManagedOnboarding.form.checkAllMandatoryInputHasErrors(
                VendorInfoSchema,
                ['email', 'mobile']
            );
        });
        await PROCESS_TEST.step('Invalid Info', async () => {
            await withoutGstin.selectClientTradeName();
            await businessManagedOnboarding.form.fillFormInputInformation(
                VendorInfoSchema,
                { ...VendorInfo, pincode: '33442' }
            );
            await businessManagedOnboarding.form.submitButton();
            await businessManagedOnboarding.form.checkInputError(
                'pincode',
                VendorInfoSchema
            );
        });

        await PROCESS_TEST.step('Save and Create Another', async () => {
            await withoutGstin.selectClientTradeName();
            businessGstin.ignore_test_fields = [
                'gstin_business_address',
                'gstin_business_type',
                'gstin_business_pan',
            ];
            await businessGstin.gstinInfoCheck();
            await businessManagedOnboarding.form.fillFormInputInformation(
                VendorInfoSchema,
                VendorInfo
            );
            await businessManagedOnboarding.saveAndCreateCheckbox();
            await businessManagedOnboarding.form.submitButton();

            await PROCESS_TEST.step('Verify Empty Form', async () => {
                await businessManagedOnboarding.form.checkIsInputFieldEmpty(
                    'name'
                );
                await businessManagedOnboarding.form.checkIsInputFieldEmpty(
                    'pincode'
                );
            });
        });

        await PROCESS_TEST.step('Fill Valid Info', async () => {
            await withoutGstin.selectClientTradeName();
            businessGstin.ignore_test_fields = [
                'gstin_business_address',
                'gstin_business_type',
                'gstin_business_pan',
            ];
            await businessGstin.gstinInfoCheck();
            await businessManagedOnboarding.form.fillFormInputInformation(
                VendorInfoSchema,
                vendorInfo_NewName
            );
            await withoutGstin.uncheckSaveAndCreate();
            await businessManagedOnboarding.form.submitButton();
        });

        await PROCESS_TEST.step('Verify Status', async () => {
            await businessManagedOnboarding.verifyBusinessManaged();
            await businessManagedOnboarding.verifyNonGstinStatus();
        });

        //To Verify Vendor In List
        await PROCESS_TEST.step('Verify Business in List', async () => {
            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.listing.searchInList(
                vendorInfo_NewName.name
            );

            await businessManagedOnboarding.verifyBusiness(
                vendorInfo_NewName.name,
                'Business Managed'
            );
        });
    });
});
