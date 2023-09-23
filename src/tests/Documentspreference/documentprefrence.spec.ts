import { DocumentspreferenceHelper } from '@/helpers/DocumentpreferenceHelper/documentspreference.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { SignupHelper } from '@/helpers/SignupHelper/signup.helper';

import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Configuration - Document Preference', () => {
    const userData = {
        name: 'Test User',
        email: '',
        password: '123456',
        confirmPassword: '123456',
    };
    test('TDP001 -   Create Document Preference - Negative Case ', async ({
        page,
    }) => {
        const documents_preference = new DocumentspreferenceHelper(page);
        const signup = new SignupHelper(page);
        const username = SignupHelper.genRandomEmail();
        userData.email = username;
        const name = 'test';

        await signup.init();
        await signup.fillSignup({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            confirm_password: userData.confirmPassword,
        });
        await signup.clickButton('Next →');

        await signup.fillOtp('111111', 6);

        await signup.clickButton('Verify →');
        await signup.clickButton('Continue →');
        await signup.fillInput(name, { name: 'organization_name' });

        await signup.clickButton('Continue');
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: userData.email,
            password: userData.password,
        });

        const notification = documents_preference.notificationHelper;

        await documents_preference.init();

        await test.step('Add Document Preference with empty Documents', async () => {
            const count = await documents_preference.checkRowCount();
            if (count < 5) {
                await documents_preference.clickAddBtn();
                await documents_preference.clickButton('Save');

                expect(await notification.getErrorMessage()).toBe(
                    'Document is required'
                );
            }
        });
    });

    test('TDP002 - Create Document Preference - Positive Case', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: userData.email,
            password: userData.password,
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await test.step('Add Document Preference', async () => {
            await documents_preference.addDocumentPreference(); // Running this test case again may give the issue since we caant use same name
        });

        await test.step('Add with Both Mandatory', async () => {
            await documents_preference.addWithBothMandatory(); // Running this test case again may give the issue since we caant use same name
        });
        await test.step('Add With Document Mandatory', async () => {
            await documents_preference.addDocumentMendatory(); // Running this test case again may give the issue since we caant use same name
        });
        await test.step('Add With Document File Mandatory', async () => {
            await documents_preference.addDocumentFileMendatory(); // Running this test case again may give the issue since we caant use same name
        });
        await test.step('Check Add and Save Another ', async () => {
            await documents_preference.addAndClickCheck(); // Running this test case again may give the issue since we caant use same name
        });
    });
});
