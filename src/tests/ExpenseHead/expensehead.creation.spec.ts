import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

import { test, expect } from '@playwright/test';

test.describe('Expense Head', () => {
    test('Expense Head page is open', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expect(page.getByText('Expense Heads')).toHaveCount(2);
    });
    test('Click on Add Expense Head', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.clickButton('Add Expense Head');
        await expect(page.getByText('Add Expense Head')).toHaveCount(2);
    });
    test('Create Expense Head empty Name feild', async ({ page }) => {
        const signin = new SignInHelper(page);
        await signin.init();
        const username = 'newtestauto@company.com';
        const password = '123456';
        await signin.checkDashboard({
            username: username,
            password: password,
        });

        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        await expenseHead.AddExpenseHead('');
        await expect(await expenseHead.errorMessage()).toBe('Name is required');
    });
});
