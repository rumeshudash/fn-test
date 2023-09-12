import { GradesHelper } from '@/helpers/GradesHelper/grade.helper';
import { test, expect } from '@playwright/test';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
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
        await expect(
            page.locator('//span[contains(text(),"Name")]')
        ).toHaveCount(1);
    });

    PROCESS_TEST('with empty Name feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.addGrades('', 1);
        await expect(await grades.errorMessage()).toBe('Name is required');
    });

    PROCESS_TEST('with empty Priority feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.checkPriority('PROCESS_TEST');
        await expect(await grades.errorMessage()).toBe('Priority is required');
    });

    PROCESS_TEST('with duplicate Name feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.addGrades('E1', 1);

        await expect(await grades.errorMessage()).toBe('Duplicate grade name');
    });

    PROCESS_TEST('With valid Name and Priority', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        const gradeName = await GradesHelper.generateRandomGradeName();
        await grades.addGrades(gradeName, 1);

        await expect(await grades.successToast()).toBe('Successfully saved ');
        await expect(page.getByText(gradeName)).toHaveCount(1);
    });
    PROCESS_TEST('With save and create another checked', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        const gradeName = await GradesHelper.generateRandomGradeName();
        grades.checkWithCheckbox(gradeName, 1);
        await expect(
            page.locator('//span[contains(text(),"Name")]')
        ).toHaveCount(1);
    });
    PROCESS_TEST('Active to inactive', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.activeToInactive('E2');

        // expect(await grades.successToast()).toBe('Status Changed');
    });
    PROCESS_TEST('EditIcon Click', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        const newGradeName = await GradesHelper.generateRandomGradeName();

        await grades.editGrdaes('E1', newGradeName, null);

        expect(await grades.successToast()).toBe('Successfully saved ');
        await expect(page.getByText(newGradeName)).toHaveCount(1);
    });
    PROCESS_TEST('EditIcon Click with empty Name feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.editGrdaes('NEWHAMsss', '', null);
        expect(await grades.errorMessage()).toBe('Name is required');
    });
    PROCESS_TEST('EditIcon Click with  Priority feild', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();

        await grades.editGrdaes('NEWHAMsss', undefined, 19);

        expect(await grades.successToast).toBe('Successfully saved');
    });
});
