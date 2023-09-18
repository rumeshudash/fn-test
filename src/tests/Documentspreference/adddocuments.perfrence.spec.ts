import { DocumentspreferenceHelper } from '@/helpers/DocumentpreferenceHelper/documentspreference.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

import { test, expect } from '@playwright/test';

test.describe('Configuration - Document Preference', () => {
    test('TDP001 -   Create Document Preference - Negative Case ', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'document@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);

        const notification = await documents_preference.notificationHelper;

        await documents_preference.init();

        test.step('click On Add Button', async () => {
            await documents_preference.clickAddBtn();
        });
        test.step('Add Document Preference with empty Documents', async () => {
            await documents_preference.clickButton('Save');

            expect(await notification.getErrorMessage()).toBe(
                'Document is required'
            );
        });
    });

    test('TDP002 - Create Document Preference - Positive Case', async ({
        page,
    }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        await signin.checkDashboard({
            username: 'document@company.com',
            password: '123456',
        });

        const documents_preference = new DocumentspreferenceHelper(page);
        const notification = documents_preference.notificationHelper;

        await documents_preference.init();

        test.step('Add Document Preference', async () => {
            await documents_preference.addDocumentPreference(); // Running this test case again may give the issue since we caant use same name

            expect(await notification.getToastSuccess()).toBe(
                'Successfully created document preference'
            );
        });

        test.step('Add with Both Mandatory', async () => {
            await documents_preference.addWithBothMandatory(); // Running this test case again may give the issue since we caant use same name

            expect(await notification.getToastSuccess()).toBe(
                'Successfully created document preference'
            );
        });
        test.step('Add With Document Mandatory', async () => {
            await documents_preference.addDocumentMendatory(); // Running this test case again may give the issue since we caant use same name

            expect(await notification.getToastSuccess()).toBe(
                'Successfully created document preference'
            );
        });
        test.step('Add With Document File Mandatory', async () => {
            await documents_preference.addDocumentFileMendatory(); // Running this test case again may give the issue since we caant use same name

            expect(await notification.getToastSuccess()).toBe(
                'Successfully created document preference'
            );
        });
        test.step('Check Add and Save Another ', async () => {
            await documents_preference.addAndClickCheck(); // Running this test case again may give the issue since we caant use same name

            expect(await notification.getToastSuccess()).toBe(
                'Successfully created document preference'
            );
        });
    });
});
