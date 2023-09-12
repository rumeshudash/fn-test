import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';

import { PROCESS_TEST } from '@/fixtures';

import { test, expect } from '@playwright/test';

test.describe('Expense Head', () => {
    PROCESS_TEST('Expense Head page is open', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expect(page.getByText('Expense Heads')).toHaveCount(2);
    });
    PROCESS_TEST('Click on Add Expense Head', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.clickButton('Add Expense Head');
        await expect(page.getByText('Add Expense Head')).toHaveCount(2);
    });
    PROCESS_TEST('Create Expense Head empty Name feild', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        await expenseHead.addExpenseHead('');
        await expect(await expenseHead.errorMessage()).toBe('Name is required');
    });

    PROCESS_TEST(
        'Create Expense Head with  Duplicate Name feild',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            await expenseHead.addExpenseHead('Rent');
            await expect(await expenseHead.errorMessage()).toBe(
                'Duplicate expense head name'
            );
        }
    );
    PROCESS_TEST(
        'Create Expense Head with  valid Name feild',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            const Name = await ExpenseHeadHelper.generateRandomGradeName();
            await expenseHead.addExpenseHead(Name);
            await expect(await expenseHead.successToast()).toBe(
                'Successfully saved '
            );

            await expect(page.getByText(Name)).toHaveCount(1);
        }
    );
    PROCESS_TEST('Create Expense Head with  All feild', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        const Name = await ExpenseHeadHelper.generateRandomGradeName();
        await expenseHead.addExpenseHead(Name, 'Test10', 'Ravi');
        await expect(await expenseHead.successToast()).toBe(
            'Successfully saved '
        );
    });
    PROCESS_TEST(
        'Change Active to inactive and check in inactive',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            const Name = await ExpenseHeadHelper.generateRandomGradeName();
            await expenseHead.changeActiveStatus('Test10');
            await expect(await expenseHead.successToast()).toBe(
                'Status Changed'
            );

            await page.getByText('Inactive').click();

            await page.waitForTimeout(1000);
            await page.getByText('Test10').click();
        }
    );

    PROCESS_TEST('Change Inactive to active', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.changeInactiveStatus('Salary');

        await expect(await expenseHead.successToast()).toBe('Status Changed');
    });
    PROCESS_TEST(
        'Edit Expense Head with empty Name feild',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            await expenseHead.editExpenseHead('Test10', '');
            await expect(await expenseHead.errorMessage()).toBe(
                'Name is required'
            );
        }
    );

    PROCESS_TEST('Edit Expense Head with duplicate name ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        await expenseHead.editExpenseHead('Test10', 'Rent');
        await expect(await expenseHead.errorMessage()).toBe(
            'Duplicate expense head name'
        );
    });
    PROCESS_TEST('Edit Expense Head with valid name ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.editExpenseHead('Time', 'Test10');

        await expect(await expenseHead.successToast()).toBe(
            'Successfully saved '
        );
    });

    PROCESS_TEST('Check save and AddAnother ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        const name = await ExpenseHeadHelper.generateRandomGradeName();
        const name2 = await ExpenseHeadHelper.generateRandomGradeName();

        await expenseHead.addandClickCheckbox(name);

        await expect(await page.getByText('Add Expense Head')).toHaveCount(2);
    });
});
