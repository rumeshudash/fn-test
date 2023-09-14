import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelper/expensehead.helper';
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

        const dialog = await expenseHead.dialogHelper;

        await dialog.checkDialogTitle('Add Expense Head');
    });
    PROCESS_TEST('Create Expense Head empty Name feild', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        await expenseHead.addExpenseHead('');

        const notification = await expenseHead.notificationHelper;

        expect(await notification.getErrorMessage()).toBe('Name is required');
    });

    PROCESS_TEST(
        'Create Expense Head with  Duplicate Name feild',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            await expenseHead.addExpenseHead('Rent');
            const notification = await expenseHead.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
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
            const notification = await expenseHead.notificationHelper;

            expect(await notification.getToastSuccess()).toBe(
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
        const notification = await expenseHead.notificationHelper;

        expect(await notification.getToastSuccess()).toBe(
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
            const notification = await expenseHead.notificationHelper;

            expect(await notification.getToastSuccess()).toBe('Status Changed');

            await page.getByText('Inactive').click();

            await page.waitForTimeout(1000);
            await page.getByText('Test10').click();
        }
    );

    PROCESS_TEST('Change Inactive to active', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.changeInactiveStatus('Salary');

        const notification = await expenseHead.notificationHelper;

        expect(await notification.getToastSuccess()).toBe('Status Changed');
    });
    PROCESS_TEST(
        'Edit Expense Head with empty Name feild',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            await expenseHead.editExpenseHead('Test10', '');
            const notification = await expenseHead.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Name is required'
            );
        }
    );

    PROCESS_TEST('Edit Expense Head with duplicate name ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        await expenseHead.editExpenseHead('Test10', 'Rent');
        const notification = await expenseHead.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Duplicate expense head name'
        );
    });
    PROCESS_TEST('Edit Expense Head with valid name ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.editExpenseHead('Time', 'Test10');

        const notification = await expenseHead.notificationHelper;

        expect(await notification.getToastSuccess()).toBe(
            'Successfully saved '
        );
    });

    PROCESS_TEST('Check save and AddAnother ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        const name = await ExpenseHeadHelper.generateRandomGradeName();
        const name2 = await ExpenseHeadHelper.generateRandomGradeName();

        await expenseHead.addAndClickCheckbox(name);

        await expect(await page.getByText('Add Expense Head')).toHaveCount(2);
    });
});
