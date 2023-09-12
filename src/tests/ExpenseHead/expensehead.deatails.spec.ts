import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHeadDetailsHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.details.helper';
import chalk from 'chalk';

import { test, expect } from '@playwright/test';

test.describe('Expense Head Details', () => {
    PROCESS_TEST('Expense Head Details page is open', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Time');
        // await expect(page.getByText('Expense Head Detail')).toHaveCount(2);
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

            await expenseHeadDetails.editExpenseHead('');

            const notification = await expenseHeadDetails.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
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

            await expenseHeadDetails.editExpenseHead('Rent');

            const notification = await expenseHeadDetails.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Duplicate expense head name'
            );
        }
    );
    PROCESS_TEST('Click on Action Button', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');
        await page.waitForTimeout(1000);

        await expenseHeadDetails.clickOnActions();

        await expect(page.getByText('Add Notes')).toHaveCount(1);
    });
    PROCESS_TEST('Click on Expense Tab', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnTab('Expenses');
    });
    PROCESS_TEST('Click on Notes Tab', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnTab('Notes');
    });
    PROCESS_TEST('Click on Documents Tab', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnTab('Documents');
    });

    PROCESS_TEST('Click ON Notes Tab and check add notes', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');
        await expenseHeadDetails.clickOnTab('Notes');
        await page.waitForTimeout(1000);
        await expenseHeadDetails.clickOnAddNotes('Test');

        await expect(page.getByText('Add Notes')).toHaveCount(2);
    });

    PROCESS_TEST('Click on Upload Document', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');
        await expenseHeadDetails.clickOnTab('Documents');
        await page.waitForTimeout(1000);

        const randomnumber =
            await ExpenseHeadDetailsHelper.generateRandomGradeName();

        const document = {
            imagePath: 'pan-card.jpg',
            comment: 'test' + randomnumber,
            date: new Date(),
        };

        await expenseHeadDetails.addDocument(document);

        console.log(chalk.green('Documents Addition Checked'));
    });

    PROCESS_TEST('Verify Notes', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnTab('Notes');

        await page.waitForTimeout(1000);

        await expenseHeadDetails.verifyNoteAddition({
            title: 'Edit Notes',
            date: new Date(),
        });
    });

    PROCESS_TEST('Edit Notes', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnTab('Notes');

        await page.waitForTimeout(1000);

        await expenseHeadDetails.editNotes(
            {
                title: 'Edit Notes',
                date: new Date(),
            },
            'Edit Notes'
        );

        console.log(chalk.green('Notes Edited'));
    });

    PROCESS_TEST('Delete Notes', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();

        await expenseHeadDetails.clickOnExpenseHead('Foods & Accommodations');

        await expenseHeadDetails.clickOnTab('Notes');

        await page.waitForTimeout(1000);

        await expenseHeadDetails.deleteNotes({
            title: 'Second Notes',
            date: new Date(),
        });

        console.log(chalk.green('Notes Deleted'));
    });
});
