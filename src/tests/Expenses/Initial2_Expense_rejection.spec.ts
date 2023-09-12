import { TEST_URL } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { TabHelper } from '@/helpers/BaseHelper/tab.helper';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalToggleHelper,
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;
describe('TECF006', () => {
    PROCESS_TEST('Expense Rejection with Comment', async ({ page }) => {
        // const tabHelper = new TabHelper(page);
        const expense = new ExpenseHelper(page);
        const signIn = new SignInHelper(page);
        const verificationFlows = new ApprovalWorkflowsTab(page);

        const toggleHelper = new ApprovalToggleHelper(page);
        await toggleHelper.gotoExpenseApproval();
        await toggleHelper.allInactive();

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
            await savedExpensePage.notification.checkToastSuccess(
                'Invoice raised successfully.'
            );
            // expect(
            //     await savedExpensePage.toastMessage(),
            //     chalk.red('ToastMessage match')
            // ).toBe('Invoice raised successfully.');
            expect(
                await savedExpensePage.checkPartyStatus(),
                chalk.red('Check party status match')
            ).toBe('Submitted');
        });

        await test.step('Check Approval Flows', async () => {
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');

            await verificationFlows.checkLevel();
            await verificationFlows.checkUser();
            await verificationFlows.checkEmail();
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification approval match')
            ).toBe('Pending Approval');
        });

        await test.step('Expense Approval Reject', async () => {
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage(pocEmail, '1234567');
            await page.waitForSelector('//div[@role="dialog"]', {
                state: 'attached',
            });
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickReject();
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification Approval check')
            ).toBe('Rejected');
        });

        await test.step('Level Status in FinOps', async () => {
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage('newtestauto@company.com', '123456');
            await page.waitForURL(TEST_URL + '/e/f');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkByFinOpsAdmin(
                    'Verification Approvals'
                ),
                chalk.red('Verification approval match')
            ).toBe('Rejected');
            await test.step('Check Expense Status', async () => {
                expect(
                    await savedExpensePage.expenseStatusSuccess('verification'),
                    chalk.red('Verification Status check')
                ).toBe(false);

                expect(
                    await savedExpensePage.expenseStatusSuccess('finops'),
                    chalk.red('FinOps Status check')
                ).toBe(false);
                expect(
                    await savedExpensePage.expenseStatusSuccess('payment'),
                    chalk.red('Payment Status check')
                ).toBe(false);
            });
        });
    });
});
