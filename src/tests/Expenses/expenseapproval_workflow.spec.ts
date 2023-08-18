import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalWorkflowsTab,
    FinOpsVerificationHelper,
    PaymentVerificationHelper,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

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
        const signIn = new SignInHelper(page);
        const expense = new ExpenseHelper(page);
        const verificationFlows = new ApprovalWorkflowsTab(page);
        const finOpsFlows = new FinOpsVerificationHelper(page);
        const paymentFlows = new PaymentVerificationHelper(page);

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

        await test.step('POC Approval', async () => {
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();

            await signIn.signInPage(pocEmail, '1234567');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove();
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

            // expect(
            //     await savedExpensePage.expenseStatus('verification')
            // ).toBeTruthy();
        });
        await test.step('Check pending flows and party status in finops', async () => {
            expect(
                await verificationFlows.nextPendingFlows(
                    'Verification Approvals'
                )
            ).toBe('Pending Approval');
            // expect(await savedExpensePage.checkPartyStatus()).toBe(
            //     'Pending Approval'
            // );
        });

        await test.step('Check finOpsFlows Details', async () => {
            await savedExpensePage.clickTab('Approval Workflows');
            await finOpsFlows.getLevelName();
            await finOpsFlows.getLevelStatus();
            await finOpsFlows.getEmailName();
            await finOpsFlows.getFinopsEmail();
        });

        await test.step('FinOps Approval', async () => {
            const finOpsEmail = await finOpsFlows.getFinopsEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await signIn.signInPage(finOpsEmail, '1234567');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove();

            await savedExpensePage.clickTab('Approval Workflows');
            expect(await finOpsFlows.getLevelStatus()).toBe('Approved');
        });

        await test.step('Payment Approval', async () => {
            const paymentEmail = await paymentFlows.getPaymentEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await signIn.signInPage(paymentEmail, '1234567');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));

            await savedExpensePage.clickApprove();

            await savedExpensePage.clickTab('Approval Workflows');
            expect(await paymentFlows.getLevelStatus()).toBe('Approved');
        });
        await test.step('Check Business and Vendor', async () => {
            expect(await savedExpensePage.checkExpenseTo()).toBe(
                EXPENSEDETAILS.to + '…'
            );
            await page.waitForTimeout(1000);
        });
    });
});
