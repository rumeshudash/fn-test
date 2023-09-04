import { PROCESS_TEST } from '@/fixtures';
import { BusinessManagedOnboarding } from '@/helpers/VendorOnboardingHelper/businessManagedOnboarding.helper';
import { BusinessVendorDetails } from '@/utils/required_data';
const { expect, describe } = PROCESS_TEST;

//Business Managed vendor onboarding with GSTIN
describe('TCBV001', () => {
    PROCESS_TEST(
        'Business Managed with GSTIN - Vendor Onboarding',
        async ({ page }) => {
            const businessManagedOnboarding = new BusinessManagedOnboarding(
                BusinessVendorDetails,
                page
            );
            await businessManagedOnboarding.clickVendor('My Vendors');
            await businessManagedOnboarding.verifyVendorPageURL();
            await businessManagedOnboarding.addBusinessManagedVendor();
            await businessManagedOnboarding.clickButton('Save');
        }
    );
});
