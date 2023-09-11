import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHeadDetailsHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.details.helper';

import { test, expect } from '@playwright/test';

test.describe('Expense Head Details', () => {
    PROCESS_TEST('Expense Head Details page is open', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Time');
        await expect(page.getByText('Expense Head Detail')).toHaveCount(2);
    });

    PROCESS_TEST(
        'Check Name of expense head is displayed',
        async ({ page }) => {
            const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
            await expenseHeadDetails.init();

            await expenseHeadDetails.clickOnExpenseHead('Time');

            await expect(page.getByText('Time')).toHaveCount(1);
        }
    );

    PROCESS_TEST('Click on Manager Name to check details', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Time');

        await expenseHeadDetails.clickOnManagerName('Vasant kishore');
    });

    PROCESS_TEST('Click on Edit Icon', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnEditIcon();

        await expect(page.getByText('Edit Expense Head')).toHaveCount(1);
    });
    PROCESS_TEST(
        'Click on Edit Icon And Edit name with empty feild',
        async ({ page }) => {
            const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
            await expenseHeadDetails.init();

            await expenseHeadDetails.clickOnExpenseHead(
                'Foods & Accommodations'
            );

            await expenseHeadDetails.clickOnEditIcon();

            await page.waitForTimeout(1000);

            await expenseHeadDetails.EditExpenseHead('');

            await expect(await expenseHeadDetails.errorMessage()).toBe(
                'Name is required'
            );
        }
    );
    PROCESS_TEST(
        'Click on Edit Icon And Edit name with Duplicate Name feild',
        async ({ page }) => {
            const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
            await expenseHeadDetails.init();

            await expenseHeadDetails.clickOnExpenseHead(
                'Foods & Accommodations'
            );

            await expenseHeadDetails.clickOnEditIcon();

            await page.waitForTimeout(1000);

            await expenseHeadDetails.EditExpenseHead('Rent');

            await expect(await expenseHeadDetails.errorMessage()).toBe(
                'Duplicate expense head name'
            );
        }
    );
});
