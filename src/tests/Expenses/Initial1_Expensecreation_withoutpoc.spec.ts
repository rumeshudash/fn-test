import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;
describe('TECF001', () => {
    PROCESS_TEST(
        'Raise Expense without poc, expense head and department',
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
                    tds: 'Dividends', //takes from second row
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
});
