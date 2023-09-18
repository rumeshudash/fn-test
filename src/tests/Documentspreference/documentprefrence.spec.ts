import { DocumentspreferenceHelper } from '@/helpers/DocumentpreferenceHelper/documentspreference.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

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
    PROCESS_TEST('TDP003 - Document preference Details', async ({ page }) => {
        const documents_preference = new DocumentspreferenceHelper(page);
        const notification = await documents_preference.notificationHelper;

        await documents_preference.init();

        PROCESS_TEST.step('Check page is opening', async () => {
            await documents_preference.checkPageTitle('Document Preferences');
        });

        PROCESS_TEST.step('Check Data is present in list', async () => {
            await documents_preference.searchTextInList('COI');
        });

        PROCESS_TEST.step('Check List Feild', async () => {
            await documents_preference.getTableHeader([
                'S.N',
                'NAME',
                'DOCUMENT MANDATORY',
                'MANDATORY',
            ]);
        });

        PROCESS_TEST.step('Change Document Mandatory Status', async () => {
            await documents_preference.changeSatus('COI', 'DOCUMENT MANDATORY');

            expect(await notification.getToastSuccess()).toBe('Status Changed');
        });
        PROCESS_TEST.step('Change Mandatory Status', async () => {
            await documents_preference.changeSatus('COI', 'MANDATORY');

            expect(await notification.getToastSuccess()).toBe('Status Changed');
        });
    });
});
