import { GradesHelper } from '@/helpers/GradesHelper/grade.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Grades', () => {
    PROCESS_TEST('without details', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await expect(page.getByText('Grades')).toHaveCount(4);
    });
    PROCESS_TEST('Click on Add Grade', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.clickButton('Add Grade');
        const dialog = await grades.dialogHelper;

        await expect(await dialog.getDialogTitle()).toBe('Add Grade');
    });

    PROCESS_TEST('with empty Name feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.addGrades('', 1);
        const notification = await grades.notificationHelper;

        expect(await notification.getErrorMessage()).toBe('Name is required');
    });

    PROCESS_TEST('with empty Priority feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.checkPriority('PROCESS_TEST');
        const notification = await grades.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Priority is required'
        );
    });

    PROCESS_TEST('with duplicate Name feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.addGrades('E1', 1);

        const notification = await grades.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Duplicate grade name'
        );
    });

    PROCESS_TEST('With valid Name and Priority', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        const gradeName = await GradesHelper.generateRandomGradeName();
        await grades.addGrades(gradeName, 1);

        // const notification = await grades.notificationHelper;

        // expect(await notification.getToastSuccess()).toBe('Successfully saved');
        await grades.verifyGrades(gradeName, 1);
    });
    PROCESS_TEST('With save and create another checked', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        const gradeName = await GradesHelper.generateRandomGradeName();
        await grades.checkWithCheckbox(gradeName, 1);

        const dialog = await grades.dialogHelper;

        await expect(await dialog.getDialogTitle()).toBe('Add Grade');
    });
    PROCESS_TEST('Active to inactive', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.checkPageTitle('Grades');
        await grades.activeToInactive('E2');

        // expect(await grades.successToast()).toBe('Status Changed');
        await page.waitForTimeout(1000);
    });
    PROCESS_TEST('EditIcon Click', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        const newGradeName = await GradesHelper.generateRandomGradeName();

        await grades.editGrdaes('E1', newGradeName, null);

        const notification = await grades.notificationHelper;

        expect(await notification.getToastSuccess).toBe('Successfully saved ');
        await expect(page.getByText(newGradeName)).toHaveCount(1);
    });
    PROCESS_TEST('EditIcon Click with empty Name feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.editGrdaes('NEWHAMsss', '', null);
        const notification = await grades.notificationHelper;

        expect(await notification.getErrorMessage()).toBe('Name is required');
    });
    PROCESS_TEST('EditIcon Click with  Priority feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.editGrdaes('NEWHAMsss', undefined, 19);

        const notification = await grades.notificationHelper;

        expect(await notification.getToastSuccess()).toBe('Successfully saved');
    });
    PROCESS_TEST('Check warning ', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        const name = 'abcdhg';

        await grades.checkWarning(name);
    });
});
