import { PROCESS_TEST } from '@/fixtures';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';
import { VerifyEmailHelper } from '@/helpers/SignupHelper/verifyEmail.helper';
import { VendorOnboarding } from '@/helpers/VendorOnboardingHelper/VendorOnboarding.helper';
import { VendorManagedWithoutGSTIN } from '@/helpers/VendorOnboardingHelper/VendorOnboardingwithoutgstin.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { vendorGstinInfo } from '@/utils/required_data';
import { test } from '@playwright/test';

let clientName: string;
let clientNameGSTIN: string;
const VENDORDETAILS = [
    {
        businessName: 'Hello India Pvt Ltd',
        displayName: 'Hello India',
        businessType: 'LLP',
        pinCode: '110001',
        address: 'Delhi',
    },
];
const { expect, describe } = PROCESS_TEST;

//Vendor Managed with Client Connect
describe('VOWOG002', () => {
    PROCESS_TEST('Vendor Onboarding Copy Link', async ({ page }) => {
        const withnogstin = new VendorManagedWithoutGSTIN(page);
        const vendorOnboarding = new VendorOnboarding(vendorGstinInfo, page);
        await vendorOnboarding.clickLink('Vendor Invitations');
        await vendorOnboarding.clickCopyLink();
        expect(await vendorOnboarding.toastMessage()).toBe(
            'Link Successfully Copied!!!'
        );

        await test.step('Open Copied Link', async () => {
            const URL = await vendorOnboarding.linkURL();
            await vendorOnboarding.closeDialog();
            await vendorOnboarding.logOut();
            console.log(URL);
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
            await signup.clickButton('Next');
        });
        await test.step('Verify Email', async () => {
            const verifyEmail = new VerifyEmailHelper(page);
            await verifyEmail.fillCode('1');
            await verifyEmail.clickButton('Verify →');
            await vendorOnboarding.clickButton('Continue →');
        });

        await test.step('Create Business Client', async () => {
            await vendorOnboarding.clickButton('Create New Business');

            await withnogstin.setCheckbox('No');
        });

        await test.step('Fill Vendor Details', async () => {
            await withnogstin.fillVendorDetails(VENDORDETAILS);
            await withnogstin.clickButton('Next');
            expect(await withnogstin.toastMessage()).toBe('Successfully saved');
        });

        await test.step('Fill Document Tab', async () => {
            await withnogstin.fillDocuments([
                {
                    selectInput: 'Lower TDS',

                    tdsNumber: '10',
                    date: '22-02-2023',
                    tdsPercentage: '20',
                    imagePath: 'pan-card.jpg',
                },
            ]);
            await withnogstin.clickButton('Next');
        });

        await test.step('Fill Bank Account Details', async () => {
            await withnogstin.fillBankAccount([
                {
                    accountNumber: '1234567',
                    ifsc: 'HDFC0000001',
                },
            ]);
            await withnogstin.clickButton('Next');
            expect(page.getByText('Onboarding Completed')).toBeTruthy();
            await withnogstin.clickButton('Close');
        });

        await test.step('Without GSTIN Client Connect', async () => {
            await withnogstin.clickButton('Connect');
        });
        await test.step('Client Invitation Field', async () => {
            await withnogstin.clientInvitation();
            await withnogstin.checkBusinessName();
            clientName = await withnogstin.checkBusinessName();
            await withnogstin.checkGSTIN();
            clientNameGSTIN = await withnogstin.checkGSTIN();
            await withnogstin.checkStatus();
            await withnogstin.checkBusinessType();
            // await vendorOnboarding.checkPAN();
            await withnogstin.clickButton('Next');
            await withnogstin.uploadImageDocuments('pan-card.jpg');
            expect(await withnogstin.toastMessage()).toBe('Successfully saved');
            await vendorOnboarding.clickButton('Submit');
            expect(await withnogstin.toastMessage()).toBe(
                'Successfully created'
            );
        });

        await test.step('Client Verify and Approve', async () => {
            expect(await withnogstin.checkFrom()).toBe(
                VENDORDETAILS[0].businessName + '…'
            );
            expect(await withnogstin.checkClient()).toBe(clientName + ' ');

            expect(await withnogstin.checkFromGSTIN()).toBe(
                'Not Registered Business'
            );
            expect(await withnogstin.checkClientGSTIN()).toBe(clientNameGSTIN);
        });

        await test.step('Check Uploaded Doucments', async () => {
            await withnogstin.checkDoument('COI');
            await withnogstin.checkDoument('Pan Card');
            await withnogstin.checkDoument('MSME');
            await withnogstin.checkDoument('Lower TDS');
            await withnogstin.checkDoument('Bank');
        });
    });
});
