import { DocumentspreferenceHelper } from '@/helpers/DocumentpreferenceHelper/documentspreference.helper';

import { test, expect } from '@playwright/test';

import { ProcessSignup } from '@/helpers/BaseHelper/signup.helper';

test.describe.configure({ mode: 'serial' });

test.describe('FinOps_DocumentPreferences - Configuration - Document Preference', () => {
    let signupHelper = new ProcessSignup();
    let userData = {
        username: '',
        password: '',
    };
    test('TDP001 -   Create Document Preference - Negative Case ', async ({
        page,
    }) => {
        const SignupData = await signupHelper.newSignup(page);

        userData.username = SignupData.username;
        userData.password = SignupData.password;

        await signupHelper.newLogin(page);
        const documents_preference = new DocumentspreferenceHelper(page);

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
        await signupHelper.newLogin(page);
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
