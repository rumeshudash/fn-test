import { DocumentspreferenceHelper } from '@/helpers/DocumentpreferenceHelper/documentspreference.helper';
import { test, expect } from '@playwright/test';

import { PROCESS_TEST } from '@/fixtures';

test.describe('TDP001', () => {
    PROCESS_TEST('Documents Preference', async ({ page }) => {
        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();
        await documents_preference.checkPageTitle('Document Preferences');
    });

    PROCESS_TEST('Check Data is present on list', async ({ page }) => {
        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();
        await documents_preference.checkPageTitle('Document Preferences');
        await documents_preference.searchTextInList('COI');
    });

    PROCESS_TEST('Check List Feilds', async ({ page }) => {
        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.getTableHeader([
            'S.N',
            'NAME',
            'DOCUMENT MANDATORY',
            'MANDATORY',
        ]);
    });
    PROCESS_TEST('Change Document Mandatory Status', async ({ page }) => {
        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.changeSatus('COI', 'DOCUMENT MANDATORY');

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getToastSuccess()).toBe('Status Changed');
    });

    PROCESS_TEST('Change Mandatory Status', async ({ page }) => {
        const documents_preference = new DocumentspreferenceHelper(page);

        await documents_preference.init();

        await documents_preference.changeSatus('COI', 'MANDATORY');

        const notification = await documents_preference.notificationHelper;

        expect(await notification.getToastSuccess()).toBe('Status Changed');
    });
});
