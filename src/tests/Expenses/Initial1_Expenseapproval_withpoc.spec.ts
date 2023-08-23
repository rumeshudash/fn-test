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
const EXPENSEDETAILS = {
    to: 'Hidesign India Pvt Ltd',
    from: 'Adidas India Marketing Private Limited',
    invoice: 'inv' + generateRandomNumber(),
    amount: 900,
    taxable_amount: 900,
    poc: 'Abhishek',
    pay_to: 'Vendor',
    desc: 'Dummy Text',
};

describe('TECF003', () => {
    PROCESS_TEST('Expense Approval by POC', async ({ page, login }) => {
        const expense = new ExpenseHelper(page);
        const signIn = new SignInHelper(page);
        const verificationFlows = new ApprovalWorkflowsTab(page);

        await expense.init();

        await expense.nextPage();
        await test.step('Fill Expense', async () => {
            await expense.fillExpenses([EXPENSEDETAILS]);
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
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                )
            ).toBe('Pending Approval');
        });

        await test.step('Expense Approve', async () => {
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();

            await signIn.signInPage(pocEmail, '1234567');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove([
                {
                    department: 'Admin',
                    expense_head: 'Refund',
                },
            ]);
            await savedExpensePage.clickTab('Approval Workflows');
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                )
            ).toBe('Approved');
        });
        await test.step('Level Status in FinOps', async () => {
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await signIn.signInPage('newtestauto@company.com', '123456');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickTab('Approval Workflows');
            expect(
                await verificationFlows.checkByFinOpsAdmin(
                    'Verification Approvals'
                )
            ).toBe('Approved');
        });

        await test.step('Check Expense Status', async () => {
            expect(
                await savedExpensePage.expenseStatusSuccess('verification')
            ).toBe(true);
            expect(await savedExpensePage.expenseStatusSuccess('finops')).toBe(
                true
            );
            expect(await savedExpensePage.expenseStatusSuccess('payment')).toBe(
                true
            );
        });

        await test.step('Check Business and Vendor', async () => {
            expect(await savedExpensePage.checkExpenseTo()).toBe(
                EXPENSEDETAILS.to + '…'
            );
            expect(await savedExpensePage.checkExpenseFrom()).toBe(
                EXPENSEDETAILS.from + '…'
            );
            await page.waitForTimeout(1000);
        });
    });
});