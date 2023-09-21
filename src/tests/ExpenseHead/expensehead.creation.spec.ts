import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.helper';
import { ExpenseHeadDetailsHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.details.helper';

import { PROCESS_TEST } from '@/fixtures';

import { test, expect } from '@playwright/test';
import { generateRandomNumber } from '@/utils/common.utils';
test.describe.configure({ mode: 'serial' });

test.describe('Configuration - Expense Head', () => {
    const expenseHeadData = {
        Name: 'Test' + generateRandomNumber(),
        Parent: 'Stationary',
        Manager: 'Abhishek Gupta',
        Notes: 'Test' + generateRandomNumber(),
        NewName: 'Test' + generateRandomNumber(),
        NewNotes: 'Test' + generateRandomNumber(),
    };
    let document = {
        imagePath: 'pan-card.jpg',

        comment: 'Test' + generateRandomNumber(),
        date: new Date(),
    };

    PROCESS_TEST(
        'TEH001 - Expense Head Creation  -  Negative case',
        async ({ page }) => {
            const expenseHead = new ExpenseHeadHelper(page);
            const dialog = expenseHead.dialogHelper;
            const notification = expenseHead.notificationHelper;
            await expenseHead.init();

            await PROCESS_TEST.step('Check the page opening', async () => {
                await expenseHead.breadcrumbHelper.checkBreadCrumbTitle(
                    'Expense Heads'
                );
                // await expect(page.getByText('Expense Heads')).toHaveCount(2);
            });

            await PROCESS_TEST.step('Check Tabs exist', async () => {
                await expenseHead.verifyTabs();
            });

            await PROCESS_TEST.step('Check Table Header', async () => {
                await expenseHead.checkTableHeader();
            });

            await PROCESS_TEST.step('Click On Add Expense Head', async () => {
                await expenseHead.clickButton('Add Expense Head');
                await dialog.checkDialogTitle('Add Expense Head');
            });

            await PROCESS_TEST.step('Check empty Name feild', async () => {
                await expenseHead.addExpenseHead('');

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
            const notification = expenseHead.notificationHelper;
            const dialog = expenseHead.dialogHelper;

            await expenseHead.init();

            await PROCESS_TEST.step(
                'Create Expense Head With Name Feild',
                async () => {
                    await expenseHead.clickButton('Add Expense Head');

                    await expenseHead.addExpenseHead(expenseHeadData.Name);

                    await page.waitForTimeout(1000);

                    // await expenseHead.searchExpense(expenseHeadData.Name);

                    // await expect(await notification.getToastSuccess()).toBe(
                    //     'Successfully saved'
                    // );
                }
            );

            await PROCESS_TEST.step(
                'Add expense Head with duplicate name',
                async () => {
                    await expenseHead.clickButton('Add Expense Head');
                    await expenseHead.addExpenseHead(expenseHeadData.Name);

                    expect(await notification.getErrorMessage()).toBe(
                        'Duplicate expense head name'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Add Expense Head with All feild',
                async () => {
                    await dialog.closeDialog();
                    await expenseHead.clickButton('Yes!');

                    await expenseHead.clickButton('Add Expense Head');
                    await expenseHead.addExpenseHead(
                        expenseHeadData.NewName,
                        expenseHeadData.Parent,
                        expenseHeadData.Manager
                    );
                }
            );

            await PROCESS_TEST.step(
                'Change Active status to Inactive Status',
                async () => {
                    await expenseHead.changeActiveStatus(
                        expenseHeadData.NewName
                    );

                    await expenseHead.tabHelper.clickTab('Inactive');

                    await expenseHead.searchInList(expenseHeadData.NewName);
                }
            );

            await PROCESS_TEST.step(
                'Change Inactive status to Active Status',
                async () => {
                    await expenseHead.changeInactiveStatus(
                        expenseHeadData.NewName
                    );

                    await expenseHead.tabHelper.clickTab('Inactive');

                    await expenseHead.searchInList(expenseHeadData.NewName);
                }
            );

            await PROCESS_TEST.step(
                'Edit Expense Head with empty Name feild',
                async () => {
                    await expenseHead.editExpenseHead(expenseHeadData.Name, '');

                    expect(await notification.getErrorMessage()).toBe(
                        'Name is required'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Edit Expense Head with duplicate name ',
                async () => {
                    await dialog.closeDialog();
                    await expenseHead.clickButton('Yes!');

                    await expenseHead.editExpenseHead(
                        expenseHeadData.Name,
                        expenseHeadData.NewName
                    );

                    expect(await notification.getErrorMessage()).toBe(
                        'Duplicate expense head name'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Edit Expense Head with valid name ',
                async () => {
                    await dialog.closeDialog();
                    await expenseHead.clickButton('Yes!');
                    const NewName =
                        await ExpenseHeadHelper.generateRandomGradeName();
                    await expenseHead.editExpenseHead(
                        expenseHeadData.Name,
                        NewName
                    );

                    expenseHeadData.Name = NewName;

                    notification.checkToastSuccess('Successfully saved');
                }
            );

            // await PROCESS_TEST.step('Check save and AddAnother ', async () => {
            //     const name = await ExpenseHeadHelper.generateRandomGradeName();

            //     await expenseHead.addAndClickCheckbox(name);

            //     await dialog.checkDialogTitle('Add Expense Head');
            // });
        }
    );

    PROCESS_TEST('TEH003-Expense Head Deatails', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        const dialog = expenseHeadDetails.dialogHelper;
        const details = expenseHeadDetails.detailsHelper;
        await expenseHeadDetails.init();
        await PROCESS_TEST.step('Check expense head Deatils page', async () => {
            await expenseHeadDetails.clickOnExpenseHead(
                expenseHeadData.NewName
            );
        });

        await PROCESS_TEST.step('Check expense head name', async () => {
            expect(page.getByText(expenseHeadData.NewName)).toHaveCount(1);
        });
        await PROCESS_TEST.step('Check expense head parent', async () => {
            expect(page.getByText(expenseHeadData.Parent)).toHaveCount(1);
        });

        await PROCESS_TEST.step('Check expense head manager', async () => {
            await expenseHeadDetails.clickOnManagerName(
                expenseHeadData.Manager
            );

            expect(page.getByText(expenseHeadData.Manager)).toHaveCount(1);
        });

        await PROCESS_TEST.step('Go back', async () => {
            await expenseHeadDetails.init();

            await expenseHeadDetails.clickOnExpenseHead(
                expenseHeadData.NewName
            );

            await page.waitForLoadState('networkidle');
            expect(page.getByText(expenseHeadData.NewName)).toHaveCount(1);
        });

        await PROCESS_TEST.step('Click on Edit Icon', async () => {
            await expenseHeadDetails.clickOnEditIcon();

            const dialog = await expenseHeadDetails.dialogHelper;

            await dialog.checkDialogTitle('Edit Expense Head');
        });

        await PROCESS_TEST.step('Edit Name with Empty Feild', async () => {
            await expenseHeadDetails.editExpenseHead('');

            const notification = await expenseHeadDetails.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Name is required'
            );
        });

        await PROCESS_TEST.step('Edit Name with Duplicate Name', async () => {
            await dialog.closeDialog();

            await expenseHeadDetails.clickButton('Yes!');

            await expenseHeadDetails.clickOnEditIcon();
            await expenseHeadDetails.editExpenseHead('Rent');

            const notification = await expenseHeadDetails.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Duplicate expense head name'
            );
        });

        await PROCESS_TEST.step('Edit Name with Valid Name', async () => {
            await dialog.closeDialog();

            await expenseHeadDetails.clickButton('Yes!');

            await expenseHeadDetails.clickOnEditIcon();
            const name = await ExpenseHeadHelper.generateRandomGradeName();

            await expenseHeadDetails.editExpenseHead(name);

            expenseHeadData.NewName = name;

            const notification = await expenseHeadDetails.notificationHelper;

            await notification.checkToastSuccess('Successfully saved');
            await page.waitForLoadState('networkidle');
        });

        await PROCESS_TEST.step('Click on Actions Button', async () => {
            await details.checkActionButtonOptions([
                'Raise Expense',
                'Add Notes',
                'Add Documents',
            ]);
        });

        // await PROCESS_TEST.step('Check Expense', async () => {
        //     await expenseHeadDetails.checkExpense('EXPVN614', 'EXPENSE NO.');

        //     const breadCrumb = expenseHeadDetails.breadCrumbHelper;

        //     await expect(await breadCrumb.getBreadCrumbSubTitle()).toBe(
        //         '#EXPVN614'
        //     );
        // });

        // await PROCESS_TEST.step('Back to the page', async () => {
        //     await page.goBack();
        //     await expenseHeadDetails.clickOnTab('Expenses');
        // });
    });

    PROCESS_TEST('TEH004-Expense Head Details Notes Tab', async ({ page }) => {
        const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
        const notification = expenseHeadDetails.notificationHelper;
        const dialog = expenseHeadDetails.dialogHelper;
        await expenseHeadDetails.init();
        await PROCESS_TEST.step('Click on Notes Tab', async () => {
            await expenseHeadDetails.clickOnExpenseHead(
                expenseHeadData.NewName
            );

            await expenseHeadDetails.clickOnTab('Notes');
        });

        await PROCESS_TEST.step('Add Notes with Empty Notes', async () => {
            await expenseHeadDetails.clickOnAddNotes('');

            notification.checkErrorMessage('Notes is required');
        });

        await PROCESS_TEST.step('Add Notes with Valid Notes', async () => {
            await dialog.closeDialog();

            await expenseHeadDetails.clickOnAddNotes(expenseHeadData.Notes);
        });

        await PROCESS_TEST.step('Verify Notes', async () => {
            await expenseHeadDetails.verifyNoteAddition({
                title: expenseHeadData.Notes,
                date: new Date(),
            });
        });

        await PROCESS_TEST.step('Edit Notes', async () => {
            const notes = await ExpenseHeadHelper.generateRandomGradeName();

            await expenseHeadDetails.editNotes(
                {
                    title: expenseHeadData.Notes,
                    date: new Date(),
                },
                expenseHeadData.NewNotes
            );
        });

        await PROCESS_TEST.step('Delete Notes', async () => {
            await expenseHeadDetails.deleteNotes({
                title: expenseHeadData.NewNotes,
                date: new Date(),
            });

            notification.checkToastSuccess('Successfully deleted');
        });
    });

    PROCESS_TEST(
        'TEH005-Expense Head Details Documents Tab',
        async ({ page }) => {
            const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
            await expenseHeadDetails.init();

            await PROCESS_TEST.step('Click on Documents Tab', async () => {
                await expenseHeadDetails.clickOnExpenseHead(
                    expenseHeadData.NewName
                );

                await expenseHeadDetails.clickOnTab('Documents');
            });

            await PROCESS_TEST.step('Add Document', async () => {
                await expenseHeadDetails.addDocument(document);
            });

            await PROCESS_TEST.step('Verify Document', async () => {
                await expenseHeadDetails.verifyDocumentAddition(document);
            });

            await PROCESS_TEST.step('Check Zoom of documents', async () => {
                await expenseHeadDetails.checkZoom();
            });

            // await PROCESS_TEST.step('Check Paginations', async () => {
            //     await expenseHeadDetails.checkPagination();
            // });

            await PROCESS_TEST.step('Delete Document', async () => {
                await expenseHeadDetails.checkDocumentDelete(document);
            });
        }
    );
    PROCESS_TEST(
        'TEH006-Expense Head Details Expense Tab',
        async ({ page }) => {
            const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
            await expenseHeadDetails.init();

            const expenseHead = {
                name: 'Foods & Accommodations',
                manager: 'Abhishek Gupta',
            };

            await PROCESS_TEST.step('Click on Expense Tab', async () => {
                await expenseHeadDetails.clickOnExpenseHead(expenseHead.name);

                await expenseHeadDetails.clickOnTab('Expenses');
            });

            await PROCESS_TEST.step(
                'Check Expense from expense Tab',
                async () => {
                    await expenseHeadDetails.checkExpense(
                        'EXPVN614',
                        'EXPENSE NO.'
                    );

                    const breadCrumb = expenseHeadDetails.breadCrumbHelper;

                    await expect(await breadCrumb.getBreadCrumbSubTitle()).toBe(
                        '#EXPVN614'
                    );
                }
            );
            await PROCESS_TEST.step('Back to the page', async () => {
                await page.goBack();
                await expenseHeadDetails.clickOnTab('Expenses');
            });

            await PROCESS_TEST.step('Check on Bill Form', async () => {
                await expenseHeadDetails.checkExpense('EXPVN614', 'BILL FROM');

                const breadCrumb = expenseHeadDetails.breadCrumbHelper;

                await expect(await breadCrumb.getBreadCrumbTitle()).toBe(
                    'Vendor Detail'
                );
            });

            await PROCESS_TEST.step('Back to the page', async () => {
                await page.goBack();
                await expenseHeadDetails.clickOnTab('Expenses');
            });
            await PROCESS_TEST.step('Check on Bill To', async () => {
                await expenseHeadDetails.checkExpense('EXPVN614', 'BILL TO');

                const breadCrumb = expenseHeadDetails.breadCrumbHelper;

                await expect(await breadCrumb.getBreadCrumbTitle()).toBe(
                    'Business Details'
                );
            });

            await PROCESS_TEST.step('Back to the page', async () => {
                await page.goBack();
                await expenseHeadDetails.clickOnTab('Expenses');
            });
            await PROCESS_TEST.step(
                'Check on Expense Head Status',
                async () => {
                    await expenseHeadDetails.checkExpenseStatus(
                        'EXPVN614',
                        'Pending'
                    );
                }
            );
            await PROCESS_TEST.step('Check Balance', async () => {
                await expenseHeadDetails.checkBalance('EXPVN614', '₹11,111.00');
            });

            await PROCESS_TEST.step('Check Expense amount', async () => {
                await expenseHeadDetails.checkExpenseAmnt(
                    'EXPVN614',
                    '₹11,111.00'
                );
            });
            await PROCESS_TEST.step('Check Expense Date', async () => {
                await expenseHeadDetails.checkDate(
                    'EXPVN614',
                    '29 Aug, 2023 5:45 AM'
                );
            });
        }
    );
});
