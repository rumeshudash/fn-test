import { PROCESS_TEST } from '@/fixtures';
import { BusinessManagedOnboarding } from '@/helpers/VendorOnboardingHelper/businessManagedOnboarding.helper';

const { expect, describe } = PROCESS_TEST;

//Business Managed vendor onboarding with GSTIN
describe('BMVO001', () => {
    PROCESS_TEST(
        'Business Managed with GSTIN - Vendor Onboarding',
        async ({ page }) => {
            const businessManagedOnboarding = new BusinessManagedOnboarding(
                page
            );
            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.addBusinessManagedVendor([
                {
                    businessName: 'Hidesign India',
                    gstin: '06AAEFH0313D1Z7',
                    vendorEmail: 'meatshop@shop.com',
                    vendorNumber: '9876543210',
                },
            ]);

            await businessManagedOnboarding.clickButton('Save');
        }
    );
});
