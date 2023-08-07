import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;
describe.configure({ mode: 'serial' });
describe('Expense Approval', () => {
    PROCESS_TEST(
        'Raise Expense with POC, Expense Head and Department',
        async ({ page }) => {
            const expense = new ExpenseHelper(page);
            const verificationFlows = new ApprovalWorkflowsTab(page);

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
                        poc: 'Abhishek',
                        pay_to: 'Vendor',
                        desc: 'Dummy Text',
                    },
                ]);
            });
            await test.step('Add Taxes', async () => {
                await expense.addTaxesData([
                    {
                        gst: '5%',
                        cess: '250',
                        tds: 'Cash withdrawal exceeding ',
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
                expect(await savedExpensePage.checkPartyStatus()).toBe(
                    'Submitted'
                );
            });

            await test.step('Check Approval Flows', async () => {
                await savedExpensePage.clickTab('Approval Workflows');

                await verificationFlows.checkLevel();
                await verificationFlows.checkUser();
                await verificationFlows.checkEmail();
                console.log('POC Email ', await verificationFlows.checkEmail());
                expect(await verificationFlows.checkApprovalStatus()).toBe(
                    'Pending Approval'
                );
            });

            test('Expense Approve', async ({ page }) => {
                // const pocEmail = await verificationFlows.checkEmail();
                console.log('POC Email', await verificationFlows.checkEmail());
            });
        }
    );
});
