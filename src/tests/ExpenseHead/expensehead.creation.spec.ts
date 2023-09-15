import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.helper';

import { PROCESS_TEST } from '@/fixtures';

import { test, expect } from '@playwright/test';

test.describe('Configuration - Expense Head', () => {
    const expenseHeadData = {};

    PROCESS_TEST(
        'TEH001 - Expense Head Creation  -  Negative case',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            const dialog = await expenseHead.dialogHelper;

            await PROCESS_TEST.step('Check the page opening', async () => {
                await expenseHead.breadcrumbHelper.checkBreadCrumbTitle(
                    'Expense Heads'
                );
                // await expect(page.getByText('Expense Heads')).toHaveCount(2);
            });

            PROCESS_TEST.step('Check Tabs exist', async () => {
                await expenseHead.verifyTabs();
            });

            PROCESS_TEST.step('Check Table Header', async () => {
                await expenseHead.checkTableHeader();
            });

            await PROCESS_TEST.step('Click On Add Expense Head', async () => {
                await expenseHead.clickButton('Add Expense Head');

                const dialog = await expenseHead.dialogHelper;

                await dialog.checkDialogTitle('Add Expense Head');
            });

            await PROCESS_TEST.step('Check empty Name feild', async () => {
                await expenseHead.addExpenseHead('');

                const notification = await expenseHead.notificationHelper;

                expect(await notification.getErrorMessage()).toBe(
                    'Name is required'
                );
            });

            await PROCESS_TEST.step(
                'Add expense Head with duplicate name',
                async () => {
                    await dialog.closeDialog();

                    await expenseHead.clickButton('Yes!');

                    await expenseHead.clickButton('Add Expense Head');

                    await expenseHead.addExpenseHead('Rent');

                    const notification = await expenseHead.notificationHelper;

                    expect(await notification.getErrorMessage()).toBe(
                        'Duplicate expense head name'
                    );
                }
            );
        }
    );

    // PROCESS_TEST('Check Tabs exist', async ({ page }) => {
    //     const expenseHead = new ExpenseHeadHelper(page);
    //     await expenseHead.init();

    //     await expenseHead.verifyTabs();
    // });

    // PROCESS_TEST('Check Table Header', async ({ page }) => {
    //     const expenseHead = new ExpenseHeadHelper(page);
    //     await expenseHead.init();

    //     await expenseHead.checkTableHeader();
    // });

    PROCESS_TEST('Check Expense is Clickable', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.checkExpenseHeadClickable('Foods & Accommodations');
    });

    // PROCESS_TEST(
    //     'Create Expense Head with  Duplicate Name feild',
    //     async ({ page }) => {
    //         const expenseHead = new ExpenseHeadHelper(page);
    //         await expenseHead.init();
    //         await expenseHead.addExpenseHead('Rent');
    //         const notification = await expenseHead.notificationHelper;

    //         expect(await notification.getErrorMessage()).toBe(
    //             'Duplicate expense head name'
    //         );
    //     }
    // );

    PROCESS_TEST(
        'TEH002 - Expense Head Creation  -  Positive case',
        async ({ page }) => {}
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
                'Successfully saved'
            );

            await expect(page.getByText(Name)).toHaveCount(1);
        }
    );
    PROCESS_TEST('Create Expense Head with  All feild', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        const Name = await ExpenseHeadHelper.generateRandomGradeName();
        await expenseHead.addExpenseHead(Name, 'Time', 'Ravi');
        const notification = await expenseHead.notificationHelper;

        expect(await notification.getToastSuccess()).toBe('Successfully saved');
    });
    PROCESS_TEST(
        'Change Active to inactive and check in inactive',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            const Name = await ExpenseHeadHelper.generateRandomGradeName();
            await expenseHead.changeActiveStatus('Time');
            const notification = await expenseHead.notificationHelper;

            // expect(await notification.getToastSuccess()).toBe('Status Changed');

            // await page.getByText('Inactive').click();

            // await page.waitForTimeout(1000);
            // await page.getByText('Test10').click();
        }
    );

    PROCESS_TEST('Change Inactive to active', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.changeInactiveStatus('Salary');

        const notification = await expenseHead.notificationHelper;

        // expect(await notification.getToastSuccess()).toBe('Status Changed');
    });
    PROCESS_TEST(
        'Edit Expense Head with empty Name feild',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            await expenseHead.editExpenseHead('Salary', '');
            const notification = await expenseHead.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Name is required'
            );
        }
    );

    PROCESS_TEST('Edit Expense Head with duplicate name ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();
        await expenseHead.editExpenseHead('Salary', 'Rent');
        const notification = await expenseHead.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Duplicate expense head name'
        );
    });
    PROCESS_TEST('Edit Expense Head with valid name ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        await expenseHead.editExpenseHead('Salary', 'Test10');

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

    PROCESS_TEST('Check warning ', async ({ page }) => {
        const expenseHead = new ExpenseHeadHelper(page);
        await expenseHead.init();

        const name = await ExpenseHeadHelper.generateRandomGradeName();

        await expenseHead.checkWarning(name);
    });
});
