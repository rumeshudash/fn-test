import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.helper';
import { ExpenseHeadDetailsHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.details.helper';

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

            await PROCESS_TEST.step('Check Warning, Yes and No', async () => {
                const name = await ExpenseHeadHelper.generateRandomGradeName();

                await expenseHead.checkWarning(name);
            });
        }
    );

    PROCESS_TEST(
        'TEH002 - Expense Head Creation  -  Positive case',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            await expenseHead.init();
            const Name = await ExpenseHeadHelper.generateRandomGradeName();
            const notification = await expenseHead.notificationHelper;

            const dialog = await expenseHead.dialogHelper;

            PROCESS_TEST.step(
                'Create Expense Head With Name Feild',
                async () => {
                    await expenseHead.addExpenseHead(Name);

                    expect(await notification.getToastSuccess()).toBe(
                        'Successfully saved'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Add expense Head with duplicate name',
                async () => {
                    await expenseHead.clickButton('Add Expense Head');

                    await expenseHead.addExpenseHead(Name);

                    const notification = await expenseHead.notificationHelper;

                    expect(await notification.getErrorMessage()).toBe(
                        'Duplicate expense head name'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Add Expense Head with All feild',
                async () => {
                    const Name =
                        await ExpenseHeadHelper.generateRandomGradeName();
                    await expenseHead.addExpenseHead(Name, 'Time', 'Ravi');

                    expenseHeadData['Name'] = Name;

                    expenseHeadData['Parent'] = 'Time';

                    expenseHeadData['Manager'] = 'Ravi';

                    expect(await notification.getToastSuccess()).toBe(
                        'Successfully saved'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Change Active status to Inactive Status',
                async () => {
                    await expenseHead.changeActiveStatus(Name);
                }
            );

            await PROCESS_TEST.step(
                'Change Inactive status to Active Status',
                async () => {
                    await expenseHead.changeInactiveStatus(Name);
                }
            );

            await PROCESS_TEST.step(
                'Edit Expense Head with empty Name feild',
                async () => {
                    await expenseHead.editExpenseHead(Name, '');

                    const notification = await expenseHead.notificationHelper;

                    expect(await notification.getErrorMessage()).toBe(
                        'Name is required'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Edit Expense Head with duplicate name ',
                async () => {
                    await expenseHead.editExpenseHead(Name, 'Rent');

                    const notification = await expenseHead.notificationHelper;

                    expect(await notification.getErrorMessage()).toBe(
                        'Duplicate expense head name'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Edit Expense Head with valid name ',
                async () => {
                    const NewName =
                        await ExpenseHeadHelper.generateRandomGradeName();
                    await expenseHead.editExpenseHead(Name, NewName);

                    const notification = await expenseHead.notificationHelper;

                    expect(await notification.getToastSuccess()).toBe(
                        'Successfully saved '
                    );
                }
            );

            await PROCESS_TEST.step('Check save and AddAnother ', async () => {
                const name = await ExpenseHeadHelper.generateRandomGradeName();

                await expenseHead.addAndClickCheckbox(name);

                await dialog.checkDialogTitle('Add Expense Head');
            });
        }
    );

    PROCESS_TEST('TEH003-Expense Head Deatails', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        await expenseHeadDetails.init();
        await PROCESS_TEST.step('Check expense head Deatils page', async () => {
            await expenseHeadDetails.clickOnExpenseHead(
                expenseHeadData['Name']
            );
        });

        await PROCESS_TEST.step('Check expense head name', async () => {
            expect(page.getByText(expenseHeadData['Name'])).toHaveCount(1);
        });
        await PROCESS_TEST.step('Check expense head parent', async () => {
            expect(page.getByText(expenseHeadData['Parent'])).toHaveCount(1);
        });

        await PROCESS_TEST.step('Check expense head manager', async () => {
            await expenseHeadDetails.clickOnManagerName(
                expenseHeadData['Manager']
            );

            expect(page.getByText(expenseHeadData['Manager'])).toHaveCount(1);
        });

        await PROCESS_TEST.step('Click on Edit Icon', async () => {
            await page.goBack();
        });
    });
});
