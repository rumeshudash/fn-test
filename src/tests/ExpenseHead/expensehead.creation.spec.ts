import { ExpenseHeadHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.helper';
import { ExpenseHeadDetailsHelper } from '@/helpers/ExpenseHeadHelpef/expensehead.details.helper';

import { PROCESS_TEST } from '@/fixtures';

import { test, expect } from '@playwright/test';
import { generateRandomNumber } from '@/utils/common.utils';

test.describe('Configuration - Expense Head', () => {
    const expenseHeadData = {
        // Name: 'test' + generateRandomNumber(),
        // Parent: 'Time',
        // Manager: 'Ravi',
        // Notes: 'test' + generateRandomNumber(),
        // NewName: 'test' + generateRandomNumber(),
        // NewNotes: 'test' + generateRandomNumber(),
    };
    let document = {
        imagePath: 'pan-card.jpg',

        comment: 'test' + generateRandomNumber(),
        date: new Date(),
    };

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
            await expenseHeadDetails.editExpenseHead('Rent');

            const notification = await expenseHeadDetails.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Duplicate expense head name'
            );
        });

        await PROCESS_TEST.step('Edit Name with Valid Name', async () => {
            const name = await ExpenseHeadHelper.generateRandomGradeName();

            await expenseHeadDetails.editExpenseHead(name);

            expenseHeadData['Name'] = name;

            const notification = await expenseHeadDetails.notificationHelper;

            expect(await notification.getToastSuccess()).toBe(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Click on Actions Button', async () => {
            await expenseHeadDetails.clickOnActions();

            const dialog = await expenseHeadDetails.dialogHelper;

            expect(
                await dialog.getLocator().getByText('Add Notes')
            ).toHaveCount(1);
        });

        await PROCESS_TEST.step('Click on Expense Tab', async () => {
            await expenseHeadDetails.clickOnTab('Expenses');
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
        await expenseHeadDetails.init();
        await PROCESS_TEST.step('Click on Notes Tab', async () => {
            await expenseHeadDetails.clickOnExpenseHead(
                expenseHeadData['Name']
            );

            await expenseHeadDetails.clickOnTab('Notes');
        });

        await PROCESS_TEST.step('Add Notes with Empty Notes', async () => {
            const notes = await ExpenseHeadHelper.generateRandomGradeName();

            await expenseHeadDetails.clickOnAddNotes(notes);

            expenseHeadData['Notes'] = notes;
        });

        await PROCESS_TEST.step('Verify Notes', async () => {
            await expenseHeadDetails.verifyNoteAddition({
                title: expenseHeadData['Notes'],
                date: new Date(),
            });
        });

        await PROCESS_TEST.step('Edit Notes', async () => {
            const notes = await ExpenseHeadHelper.generateRandomGradeName();

            await expenseHeadDetails.editNotes(
                {
                    title: expenseHeadData['Notes'],
                    date: new Date(),
                },
                notes
            );

            expenseHeadData['Notes'] = notes;
        });

        await PROCESS_TEST.step('Delete Notes', async () => {
            await expenseHeadDetails.deleteNotes({
                title: expenseHeadData['Notes'],
                date: new Date(),
            });
        });
    });

    PROCESS_TEST(
        'TEH005-Expense Head Details Documents Tab',
        async ({ page }) => {
            const expenseHeadDetails = new ExpenseHeadDetailsHelper(page);
            await expenseHeadDetails.init();

            await PROCESS_TEST.step('Click on Documents Tab', async () => {
                await expenseHeadDetails.clickOnExpenseHead(
                    expenseHeadData['Name']
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

            await PROCESS_TEST.step('Check Paginations', async () => {
                await expenseHeadDetails.checkPagination();
            });

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
        }
    );
});
