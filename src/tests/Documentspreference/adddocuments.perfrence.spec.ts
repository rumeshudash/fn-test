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
});
