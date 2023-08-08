import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;
describe.configure({ mode: 'serial' });
describe('TECF003', () => {
    PROCESS_TEST('Expense Approval by POC', async ({ page, login }) => {
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
            expect(await savedExpensePage.checkPartyStatus()).toBe('Submitted');
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

        await test.step('Expense Approve', async () => {
            const signIn = new SignInHelper(page);
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await verificationFlows.logOut();

            await signIn.signInPage(pocEmail, '1234567');
            await verificationFlows.clickLink('Expenses');
            await verificationFlows.clickLink(expData.slice(1));
            await verificationFlows.clickApprove([
                {
                    department: 'Admin',
                    expense_head: 'Refund',
                },
            ]);
            await savedExpensePage.clickTab('Approval Workflows');
            expect(await verificationFlows.checkApprovalStatus()).toBe(
                'Approved'
            );
        });
    });
});
