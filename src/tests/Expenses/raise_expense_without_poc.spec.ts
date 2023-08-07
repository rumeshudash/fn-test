import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/expense.helper';
import {
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/savedExpense.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;

describe('Raise Expense', () => {
    PROCESS_TEST(
        'without poc, expense head and department',
        async ({ page }) => {
            const expense = new ExpenseHelper(page);

            await expense.init();

            await expense.nextPage();
            await expense.fillExpenses([
                {
                    to_nth: 1,
                    from_nth: 1,
                    invoice: ' inv' + generateRandomNumber(),
                    amount: 1000,
                    taxable_amount: 900,
                    desc: 'Dummy Text',
                },
            ]);
            await expense.addTaxesData([
                {
                    gst: '12%',
                    cess: '200',
                    // tds_text: "194C",
                    tds: '2', //index number of TDS
                    tcs: '12',
                },
            ]);
            await expense.clickButton('Save');
            const savedExpensePage = new SavedExpenseCreation(page);

            await test.step('Check Saved and Party Status', async () => {
                expect(await savedExpensePage.toastMessage()).toBe(
                    'Invoice raised successfully.'
                );
                expect(await savedExpensePage.checkPartyStatus()).toBe('Open');
            });
        }
    );

    PROCESS_TEST('with poc', async ({ page }) => {
        const expense = new ExpenseHelper(page);

        await expense.init();

        await expense.nextPage();
        await test.step('Fill Expense', async () => {
            await expense.fillExpenses([
                {
                    to_nth: 1,
                    from_nth: 1,
                    invoice: ' inv' + generateRandomNumber(),
                    amount: 10000,
                    taxable_amount: 9000,
                    department: 'Hr',
                    expense_head: 'Rent',
                    poc: 'Abhishek',
                    pay_to: 'Vendor',
                },
            ]);
        });
        await test.step('Add Taxes', async () => {
            await expense.addTaxesData([
                {
                    gst: '8%',
                    cess: '250',
                    tds: '4',
                    tcs: '20',
                },
            ]);
            await expense.clickButton('Save');
        });

        const savedExpensePage = new SavedExpenseCreation(page);

        await test.step('Check Saved and Party Status with poc', async () => {
            expect(await savedExpensePage.toastMessage()).toBe(
                'Invoice raised successfully.'
            );
            expect(await savedExpensePage.checkPartyStatus()).toBe('Submitted');
        });

        await test.step('Check Approval Flows', async () => {
            await savedExpensePage.clickTab('Approval Workflows');

            const verificationFlows = new ApprovalWorkflowsTab(page);
            await verificationFlows.checkLevel();
            await verificationFlows.checkUser();
            await verificationFlows.checkEmail();
            await verificationFlows.checkApprovalStatus();
        });
    });
});
