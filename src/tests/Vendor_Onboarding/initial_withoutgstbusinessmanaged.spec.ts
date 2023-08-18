import { PROCESS_TEST } from '@/fixtures';
import { OnboardingWithoutGSTIN } from '@/helpers/VendorOnboardingHelper/BusinessManagedwithoutgstin.helper';

const { expect, describe } = PROCESS_TEST;

//Business Managed onboarding without GSTIN
describe('VOB001', () => {
    PROCESS_TEST(
        'Business Managed - Vendor Onboarding without GSTIN ',
        async ({ page }) => {
            const withoutgstin = new OnboardingWithoutGSTIN(page);
            await withoutgstin.clickAddVendor('My Vendors');

            await withoutgstin.addVendorAccount([
                {
                    businessName: 'Bata India',
                    vendorBusiness: 'Motors Pvt Ltd',
                    displayName: 'Motors Pvt Ltd',
                    pinCode: '110001',
                    address: 'Delhi',
                    businessType: 'Private Limited',
                    vendorEmail: 'PineApple@PineApple.com',
                    vendorNumber: '9876543210',
                },
            ]);
            await withoutgstin.clickButton('Save');
        }
    );
});
