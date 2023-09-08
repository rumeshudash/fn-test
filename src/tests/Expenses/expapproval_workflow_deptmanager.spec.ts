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
    to: 'Bata India Limited',
    from: 'Amazon',
    invoice: ' inv' + generateRandomNumber(),
    amount: 6000,
    taxable_amount: 6000,
    department: 'Sales',
    expense_head: 'Telemarketing Expense',
    poc: 'Sunil',
    pay_to: 'Vendor',
    desc: 'Dummy Text',
};
describe('TECF008', () => {
    PROCESS_TEST('Expense Approval by FinOps', async ({ page }) => {
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
            'Inactive'
        );
        await toggleHelper.toggleOption(
            'Category,Amount & Department Manager',
            'Active'
        );
        await toggleHelper.gotoTab('Finops');
        await toggleHelper.toggleOption(
            'Department and auto Approve',
            'Active'
        );
        await toggleHelper.toggleOption(
            'Amount >1000 and Individual',
            'Inactive'
        );
        await toggleHelper.gotoTab('Payment');
        await toggleHelper.toggleOption(
            'Amount >=5000 and Individual',
            'Active'
        );
        await toggleHelper.toggleOption(
            'Amount >1000 and Individual',
            'Inactive'
        );

        await expense.init();

        await expense.addDocument();

        await test.step('Fill Expense', async () => {
            await expense.fillExpenses([EXPENSEDETAILS]);
        });

        // await test.step('Add Taxes', async () => {
        //     await expense.addTaxesData([
        //         {
        //             gst: '5%',
        //             cess: '250',
        //             tds: 'Cash withdrawal exceeding ',
        //             tcs: '20',
        //         },
        //     ]);
        //     await expense.clickButton('Save');
        // });
        await expense.clickButton('Save');

        const savedExpensePage = new SavedExpenseCreation(page);

        await test.step('Check Saved and Party Status with poc', async () => {
            expect(
                await savedExpensePage.toastMessage(),
                chalk.red('Toast Message match')
            ).toBe('Invoice raised successfully.');

            expect(
                await savedExpensePage.checkPartyStatus(),
                chalk.red('Party Status match')
            ).toBe('Submitted');
        });

        await test.step('Check Approval Flows', async () => {
            await savedExpensePage.clickTab('Approval Workflows');

            await verificationFlows.checkLevel();
            await verificationFlows.checkUser();
            await verificationFlows.checkEmail();
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Approval Status match')
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
            await savedExpensePage.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification Approval match')
            ).toBe('Approved');
        });

        await test.step('Level Status in FinOps', async () => {
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage('newtestauto@company.com', '123456');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkByFinOpsAdmin(
                    'Verification Approvals'
                ),
                chalk.red('Verification Approval match')
            ).toBe('Approved');
            // await verificationFlows.checkApprovalByFinOps();
        });

        await test.step('Level Two Verification Flows', async () => {
            const nextEmail = await verificationFlows.nextApprovalFlows(
                'Verification Approvals'
            );
            console.log('Next Email: ', nextEmail);
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage(nextEmail, '1234567');
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove();
            await page.waitForTimeout(1000);
            await savedExpensePage.clickTab('Approval Workflows');
            await verificationFlows.checkManagerApproval();
        });

        await test.step('Payment Approval', async () => {
            await page.waitForTimeout(1000);
            const paymentEmail = await paymentFlows.getPaymentEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('load');
            await signIn.signInPage(paymentEmail, '1234567');
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));

            await savedExpensePage.clickApprove();

            await savedExpensePage.clickTab('Approval Workflows');
            await page.waitForTimeout(1000);
            expect(
                await paymentFlows.getLevelStatus(),
                chalk.red('Level status match')
            ).toBe('Approved');
        });
    });
});
