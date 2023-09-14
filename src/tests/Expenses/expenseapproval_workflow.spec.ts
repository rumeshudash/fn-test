import { TEST_URL } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalToggleHelper,
    ApprovalWorkflowsTab,
    FinOpsVerificationHelper,
    PaymentVerificationHelper,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;
const EXPENSEDETAILS = {
    to: 'Hidesign India Pvt Ltd',
    from: 'Chumbak Design Private Limited',
    invoice: ' inv' + generateRandomNumber(),
    amount: 10000,
    taxable_amount: 10000,
    department: 'Sales',
    expense_head: 'Refund',
    poc: 'Sunil',
    pay_to: 'Vendor',
    desc: 'Dummy Text',
};
describe('TECF007', () => {
    PROCESS_TEST('Expense Approval by FinOps', async ({ page }) => {
        // const tabHelper = new TabHelper(page);
        const signIn = new SignInHelper(page);
        const expense = new ExpenseHelper(page);
        const verificationFlows = new ApprovalWorkflowsTab(page);
        const finOpsFlows = new FinOpsVerificationHelper(page);
        const paymentFlows = new PaymentVerificationHelper(page);

        const toggleHelper = new ApprovalToggleHelper(page);

        // toggle workflow options for expense approvals
        await toggleHelper.gotoExpenseApproval();
        await toggleHelper.toggleOption(
            'Amount >1000 and Auto Approve',
            'Active'
        );
        await toggleHelper.toggleOption(
            'Category,Amount & Department Manager',
            'Inactive'
        );
        await toggleHelper.gotoTab('Finops');
        await toggleHelper.toggleOption(
            'Department and auto Approve',
            'Inactive'
        );
        await toggleHelper.toggleOption(
            'Amount >1000 and Individual',
            'Active'
        );
        await toggleHelper.gotoTab('Payment');
        await toggleHelper.toggleOption(
            'Amount >=5000 and Individual',
            'Inactive'
        );
        await toggleHelper.toggleOption(
            'Amount >1000 and Individual',
            'Active'
        );

        await expense.init();

        await expense.addDocument();

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
            await savedExpensePage.notification.checkToastSuccess(
                'Invoice raised successfully.'
            );
            // expect(
            //     await savedExpensePage.toastMessage(),
            //     chalk.red('Toast message match')
            // ).toBe('Invoice raised successfully.');

            expect(
                await savedExpensePage.checkPartyStatus(),
                chalk.red('Check party status')
            ).toBe('Submitted');
        });

        await test.step('Check Approval Flows', async () => {
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');

            await verificationFlows.checkLevel();
            await verificationFlows.checkUser();
            await verificationFlows.checkEmail();
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification approval match')
            ).toBe('Pending Approval');
        });

        await test.step('POC Approval', async () => {
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage(pocEmail, '1234567');
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove();
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification approval match')
            ).toBe('Approved');
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
            await verificationFlows.checkApprovalByFinOps();
        });
        await test.step('Check pending flows and party status in finops', async () => {
            await verificationFlows.checkPendingFlows();
        });

        await test.step('Check finOpsFlows Details', async () => {
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            await finOpsFlows.getLevelName();
            await finOpsFlows.getLevelStatus();
            await finOpsFlows.getEmailName();
            await finOpsFlows.getFinopsEmail();
        });

        await test.step('FinOps Approval', async () => {
            const finOpsEmail = await finOpsFlows.getFinopsEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage(finOpsEmail, '1234567');
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove();

            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await finOpsFlows.getLevelStatus(),
                chalk.red('FinOps level status match')
            ).toBe('Approved');
        });

        await test.step('Payment Approval', async () => {
            const paymentEmail = await paymentFlows.getPaymentEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage(paymentEmail, '1234567');
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));

            await savedExpensePage.clickApprove();

            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await paymentFlows.getLevelStatus(),
                chalk.red('Payment level status match')
            ).toBe('Approved');
        });
        await test.step('Check Business and Vendor', async () => {
            expect(
                await savedExpensePage.checkExpenseTo(),
                chalk.red('Check To Expense Details match')
            ).toBe(EXPENSEDETAILS.to + '…');
            await page.waitForTimeout(1000);
        });
    });
});
