import { GradesHelper } from '@/helpers/GradesHelper/grade.helper';
import { test, expect } from '@playwright/test';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

test.describe('Grades', () => {
    test('without details', async ({ page }) => {
        const signin = new SignInHelper(page);

        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const grades = new GradesHelper(page);
        await grades.init();

        await expect(page.getByText('Grades')).toHaveCount(4);
    });
    test('Click on Add Grade', async ({ page }) => {
        const signin = new SignInHelper(page);

        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.clickButton('Add Grade');
        await expect(
            page.locator('//span[contains(text(),"Name")]')
        ).toHaveCount(1);
    });

    test('with empty Name feild', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const grades = new GradesHelper(page);
        await grades.init();

        await grades.AddGrades('', 1);
        await expect(await grades.errorMessage()).toBe('Name is required');
    });

    test('with empty Priority feild', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const grades = new GradesHelper(page);
        await grades.init();

        await grades.checkPriority('test');
        await expect(await grades.errorMessage()).toBe('Priority is required');
    });

    test('with duplicate Name feild', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const grades = new GradesHelper(page);
        await grades.init();
        await grades.AddGrades('E1', 1);

        await expect(await grades.errorMessage()).toBe('Duplicate grade name');
    });

    test('With valid Name and Priority', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const grades = new GradesHelper(page);
        await grades.init();
        await grades.AddGrades('tes2SDSsss', 1);

        await expect(await grades.successToast()).toBe('Successfully saved ');
        await expect(page.getByText('tes2SDSss')).toHaveCount(1);
    });
    test('With save and create another checked', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const grades = new GradesHelper(page);
        await grades.init();
        grades.checkWithCheckbox('SujanTest', 1);
        await expect(
            page.locator('//span[contains(text(),"Name")]')
        ).toHaveCount(1);
    });
});
