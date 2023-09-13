import { DocumentspreferenceHelper } from '@/helpers/DocumentpreferenceHelper/documentspreference.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

import { test, expect } from '@playwright/test';

test.describe('Add Documents Prefrence', () => {
    test('Adding Documents Preference with new login', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'resetpassword@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.clickAddBtn();
    });

    test('Adding Documents Preference with empty Documents', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'resetpassword@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.addDocumentPreference('');

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Document is required'
        );
    });
    test('Adding Documents Preference Valid Document Name', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'resetpassword@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.addDocumentPreference('Pan Card'); // Running this test case again may give the issue since we caant use same name

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getToastSuccess()).toBe(
            'Successfully created document preference'
        );
    });

    test('Adding Documents Preference with same Document Name', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'resetpassword@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.addWithBothMandatory('Pan Card'); // Running this test case again may give the issue since we caant use same name

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getToastSuccess()).toBe(
            'Successfully created document preference'
        );
    });

    test('Adding Documents Preference with Documents Mandatory', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'resetpassword@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.addDocumentMendatory('Pan Card'); // Running this test case again may give the issue since we caant use same name

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getToastSuccess()).toBe(
            'Successfully created document preference'
        );
    });

    test('Adding Documents Preference with Documents Files Mandatory', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'resetpassword@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.addDocumentFileMendatory('Pan Card'); // Running this test case again may give the issue since we caant use same name

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getToastSuccess()).toBe(
            'Successfully created document preference'
        );
    });
});
