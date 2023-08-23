import { PROCESS_TEST } from '@/fixtures';
import { gstinDataType } from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import { SavedExpenseCreation } from '@/helpers/ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import {
    BankAccountDetails,
    VendorInvitationDetails,
    VendorOnboarding,
    VendorOnboardingWithGSTIN,
} from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

let businessName: string; // business name equal to vendor
let businessNameGSTIN: string;
let businessStatus: string;
let clientName: string; // client name equal to business
let clientNameGSTIN: string;
let clientID: string; // client id equal to business Client ID
const clientGSTIN = '33AACCH0586R1Z6'; //used in connect client to select gstin from dropdown

//Bank Details
let bankAccountName: string;
let bankAccountNumber: string;
let bankIFSCCode: string;

const { expect, describe } = PROCESS_TEST;

const BANKDETAILS = [
    {
        accountNumber: '1234567',
        ifsc: 'HDFC0000001',
    },
];

const VENDORDETAILS = [
    {
        businessName: 'Keshav Steel Traders',
        gstin: '29BKXPA1489F1ZP',
    },
];

const gstinInfo: gstinDataType = {
    trade_name: 'Keshav Steel Traders',
    value: '29BKXPA1489F1ZP',
    pan_number: 'BKXPA1489F',
    business_type: 'Proprietorship',
    address:
        ', Budihal Village,, Kasaba Hobli, Nelamangala Taluk,, Sy no. 125,, Bengaluru Rural, , , 562123, , Karnataka, NA, ,',
    status: 'Active',
};

//Vendor Managed with Client Connect
describe('TCCC002', () => {
    PROCESS_TEST('Client Connect - Vendor Onboarding', async ({ page }) => {
        const getBankDetails = new BankAccountDetails(page);
        const vendorOnboarding = new VendorOnboarding(gstinInfo, page);
        await vendorOnboarding.clickLink('Vendor Invitations');
        await vendorOnboarding.clickCopyLink();
        expect(await vendorOnboarding.toastMessage()).toBe(
            'Link Successfully Copied!!!'
        );

        await test.step('Open Copied Link', async () => {
            const URL = await vendorOnboarding.linkURL();
            await vendorOnboarding.closeDialog();
            await vendorOnboarding.logOut();
            await vendorOnboarding.init(URL);
        });

        await test.step('Signup - Vendor Onboarding', async () => {
            await vendorOnboarding.clickButton('Sign Up');
            const signup = new SignupHelper(page);
            await signup.fillSignup({
                name: 'User130823',
                email: `User${generateRandomNumber()}@test.com`,
                password: '123456',
                confirm_password: '123456',
            });
            await signup.nextPage();
        });
        await test.step('Verify Email', async () => {
            const verifyEmail = new VerifyEmailHelper(page);
            await verifyEmail.fillCode('1');
            await verifyEmail.verifyPageClick();
            await vendorOnboarding.clickButton('Continue →');
        });

        await test.step('Create Business Client', async () => {
            await vendorOnboarding.clickButton('Create New Business');

            await vendorOnboarding.businessDetails(VENDORDETAILS);
            await vendorOnboarding.beforeGstinNameNotVisibleDisplayName();
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Documents'
            );
            await vendorOnboarding.gstinInfoCheck();
            // businessName = await vendorOnboarding.checkBusinessName();
            // expect(await vendorOnboarding.checkBusinessNameVisibility()).toBe(
            //     true
            // );
            // businessNameGSTIN = await vendorOnboarding.checkGSTIN();
            // expect(await vendorOnboarding.checkGSTINVisibility()).toBe(true);
            // businessStatus = await vendorOnboarding.checkStatus();
            // expect(await vendorOnboarding.checkStatusVisibility()).toBe(true);
            // await vendorOnboarding.checkAddress();
            // expect(await vendorOnboarding.checkAddressVisibility()).toBe(true);
            // await vendorOnboarding.checkBusinessType();
            // expect(await vendorOnboarding.checkBusinessTypeVisibility()).toBe(
            //     true
            // );
            // await vendorOnboarding.checkPAN();
            // expect(await vendorOnboarding.checkPANVisibility()).toBe(true);

            await vendorOnboarding.checkDisplayName();
            expect(await vendorOnboarding.checkDisplayNameVisibility()).toBe(
                true
            );

            await vendorOnboarding.clickButton('Next');

            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
            await page.waitForTimeout(2 * 1000);
            // await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.uploadDocument([
                {
                    tdsCert: '333333333',
                    tdsPercentage: '22',
                },
            ]);
            await vendorOnboarding.fileUpload('pan-card.jpg');
            await vendorOnboarding.clickButton('Save');
            await vendorOnboarding.clickButton('Next');
            await vendorOnboarding.bankAccount(BANKDETAILS);
            await vendorOnboarding.checkWizardNavigationClickDocument(
                'Bank Account'
            );

            bankIFSCCode = await getBankDetails.bankIFSCCode();
            expect(bankIFSCCode.slice(0, -1)).toBe(BANKDETAILS[0].ifsc);
            // bankAccountName = await getBankDetails.bankAccountName();
            // expect(bankAccountName).toBe(businessName);

            await vendorOnboarding.clickButton('Next');
            expect(page.getByText('Onboarding Completed')).toBeTruthy();
            await vendorOnboarding.clickButton('Close');
        });

        await test.step('Client Connect', async () => {
            await vendorOnboarding.clickButton('Connect');
            await vendorOnboarding.clientInvitation(clientGSTIN);
            // clientName = await vendorOnboarding.checkBusinessName();
            clientNameGSTIN = await vendorOnboarding.checkGSTIN();
            await vendorOnboarding.checkBusinessType();
            await vendorOnboarding.checkBusinessDetailsPAN();
            await vendorOnboarding.checkStatus();
            bankAccountNumber = await getBankDetails.bankAccountNumber();
        });

        await test.step('Verify Client Connect Details', async () => {
            expect(await vendorOnboarding.getClientIDVisibility()).toBe(true);
            expect(await vendorOnboarding.checkBusinessNameVisibility()).toBe(
                true
            );
            expect(await vendorOnboarding.checkGSTINVisibility()).toBe(true);
            expect(await vendorOnboarding.checkBusinessTypeVisibility()).toBe(
                true
            );
            expect(await vendorOnboarding.getGSTINfromInput()).toBe(
                clientGSTIN
            );
            expect(clientNameGSTIN).toBe(
                await vendorOnboarding.getGSTINfromInput()
            );
            expect(await vendorOnboarding.checkBusinessTypeVisibility()).toBe(
                true
            );
            expect(
                await vendorOnboarding.checkBusinessDetailsPANVisibility()
            ).toBe(true);

            expect(await vendorOnboarding.checkStatusVisibility()).toBe(true);

            expect(bankAccountNumber).toBe(BANKDETAILS[0].accountNumber);
            expect(await getBankDetails.businessDetailsIFSC()).toBe(
                BANKDETAILS[0].ifsc
            );
        });
        await test.step('Upload Mandatory Documents', async () => {
            await vendorOnboarding.clickButton('Next');
            expect(await vendorOnboarding.checkButtonVisibility('Submit')).toBe(
                false
            );

            await vendorOnboarding.uploadImageDocuments('pan-card.jpg');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully saved'
            );
            expect(await vendorOnboarding.checkButtonVisibility('Submit')).toBe(
                true
            );
            await vendorOnboarding.clickButton('Submit');
            expect(await vendorOnboarding.toastMessage()).toBe(
                'Successfully created'
            );
        });
        await test.step('Client Verify and Approve', async () => {
            const invitationDetails = new VendorInvitationDetails(page);
            expect(await invitationDetails.checkFrom()).toBe(
                businessName + '…'
            );
            expect(await invitationDetails.checkFromGSTIN()).toBe(
                businessNameGSTIN
            );
            expect(await invitationDetails.checkClient()).toBe(
                clientName + ' '
            );
            expect(await invitationDetails.checkClientGSTIN()).toBe(
                clientNameGSTIN
            );
        });

        await test.step('Check Uploaded Doucments', async () => {
            const withoutGSTIN = new VendorOnboardingWithGSTIN(page);
            expect(await withoutGSTIN.checkDoument('GSTIN Certificate')).toBe(
                businessStatus
            );
            await withoutGSTIN.checkDoument('Pan Card');
            await withoutGSTIN.checkDoument('MSME');
            await withoutGSTIN.checkDoument('Lower TDS');
            await withoutGSTIN.checkDoument('Bank');
        });

        // await test.step('Client Logout and FinOps Login ', async () => {
        //     await vendorOnboarding.logOut();
        //     const signIn = new SignInHelper(page);
        //     await signIn.signInPage('newtestauto@company.com', '123456');
        // });
    });
});
