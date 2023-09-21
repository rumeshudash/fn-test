import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalToggleHelper,
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;
describe('Expense Creation - Finops Portal', () => {
    PROCESS_TEST('Raise Expense with POC', async ({ page }) => {
        // const tabHelper = new TabHelper(page);
        const expense = new ExpenseHelper(page);
        const toggleHelper = new ApprovalToggleHelper(page);
        await toggleHelper.gotoExpenseApproval();
        await toggleHelper.allInactive();
        await expense.init();

        await expense.addDocument();
        await PROCESS_TEST.step('TECF002', async () => {
            await expense.fillBusinessDetails([
                {
                    to: 'Hidesign India Pvt Ltd',
                    from: 'Adidas India Marketing Private Limited',
                },
            ]);
            await expense.fillExpenses([
                {
                    invoice: ' inv' + generateRandomNumber(),
                    amount: 10000,
                    taxable_amount: 10000,
                    // department: 'Hr',
                    // expense_head: 'Rent',
                    poc: 'Abhishek',
                    pay_to: 'Vendor',
                    desc: 'Dummy Text',
                },
            ]);
        });
        await PROCESS_TEST.step('Add Taxes', async () => {
            await expense.addTaxesData([
                {
                    gst: '8%',
                    cess: '250',
                    tds: 'Cash withdrawal exceeding ',
                    tcs: '20',
                },
            ]);
        });
        await PROCESS_TEST.step('Remove default input value', async () => {
            await expense.removeDefaultInputValue('department');
        });
        await expense.clickButton('Save');

        const savedExpensePage = new SavedExpenseCreation(page);

        await PROCESS_TEST.step(
            'Check Saved and Party Status with poc',
            async () => {
                await savedExpensePage.notification.checkToastSuccess(
                    'Invoice raised successfully.'
                );
                // expect(
                //     await savedExpensePage.toastMessage(),
                //     chalk.red('Toast message match')
                // ).toBe('Invoice raised successfully.');
                expect(
                    await savedExpensePage.checkPartyStatus(),
                    chalk.red('Check party status match')
                ).toBe('Submitted');
            }
        );

        await PROCESS_TEST.step('Check Approval Flows', async () => {
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');

            const verificationFlows = new ApprovalWorkflowsTab(page);
            await verificationFlows.checkLevel();
            await verificationFlows.checkUser();
            await verificationFlows.checkEmail();
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification Approvals match')
            ).toBe('Pending Approval');
        });
    });
});
