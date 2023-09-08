import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

test.describe('CustomeFeild', () => {
    test('Check the page opening', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await expect(page.getByText('Custom')).toHaveCount(2);
    });
    test('Check Expense Tab and Click Expense Tab', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab();
        await expect(
            page.getByRole('tab', { name: 'Expense', exact: true })
        ).toHaveCount(1);
    });

    test('Check Expense Tab and Click Add New', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab();
        await customefeild.clickButton('Add New');
        await expect(page.getByText('Add Expense Custom Field')).toHaveCount(1);
    });
    test('Add Expense With Empty Feilds', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab();
        await customefeild.clickButton('Add New');

        await customefeild.clickButton('Save');

        await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(1);
    });

    test('Add Expense Without Name Feilds', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.AddExpenseCustomeFeild('', 'Text', 1);

        expect(await customefeild.errorMessage()).toBe(
            'Field Name is required'
        );
    });
    test('Add Expense Without Type Feilds', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.AddExpenseCustomeFeild('Test1', '', 1);

        expect(await customefeild.errorMessage()).toBe(
            'Field Type is required'
        );
    });
    test('Add Expense With Text type', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.AddExpenseWithTextType('Test1', 'Text', 1, 'Test1');
        await customefeild.AddExpenseWithTextType('Test2', 'Text', 1);
        await expect(page.getByText('Test1')).toHaveCount(3);
    });
    test('Add Expense With Boolean', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.AddExpenseWitBooleanType(
            'Test1',
            'Boolean',
            1,
            'True'
        );
        await customefeild.AddExpenseWitBooleanType('Test2', 'Boolean', 1);
    });
    test('Add Expense With Number type', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.AddExpenseWithTextType(
            'Number1',
            'Number',
            1,
            'Number1'
        );
        await customefeild.AddExpenseWithTextType('Number2', 'Text', 1);
        await expect(page.getByText('Number1')).toHaveCount(1);
    });
});
