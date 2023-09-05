import { TEST_URL } from '@/constants/api.constants';
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
describe('TECF006', () => {
    PROCESS_TEST('Expense Rejection with Comment', async ({ page }) => {
        const expense = new ExpenseHelper(page);
        const signIn = new SignInHelper(page);
        const verificationFlows = new ApprovalWorkflowsTab(page);

        await expense.init();

        await expense.addDocument();

        await test.step('Fill Expense', async () => {
            await expense.fillExpenses([
                {
                    to_nth: 1,
                    from_nth: 2,
                    invoice: ' inv' + generateRandomNumber(),
                    amount: 10000,
                    taxable_amount: 10000,
                    department: 'Sales',
                    expense_head: 'Refund',
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
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                )
            ).toBe('Pending Approval');
        });

        await test.step('Expense Approval Reject', async () => {
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('load');
            await signIn.signInPage(pocEmail, '1234567');
            await page.waitForSelector('//div[@role="dialog"]', {
                state: 'attached',
            });
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickReject();
            await savedExpensePage.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                )
            ).toBe('Rejected');
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
            ).toBe('Rejected');
            await test.step('Check Expense Status', async () => {
                expect(
                    await savedExpensePage.expenseStatusSuccess('verification')
                ).toBe(false);

                expect(
                    await savedExpensePage.expenseStatusSuccess('finops')
                ).toBe(false);
                expect(
                    await savedExpensePage.expenseStatusSuccess('payment')
                ).toBe(false);
            });
        });
    });
});
