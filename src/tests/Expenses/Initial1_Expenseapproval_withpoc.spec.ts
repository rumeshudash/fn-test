import { TEST_URL } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
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

describe('Expense Creation - Finops Portal', () => {
    const BusinessInfo = {
        to: 'Hidesign India Pvt Ltd',
        from: 'Adidas India Marketing Private Limited',
    };
    const EXPENSEDETAILS = {
        invoice: 'inv' + generateRandomNumber(),
        amount: 900,
        taxable_amount: 900,
        poc: 'Abhishek',
        pay_to: 'Vendor',
        desc: 'Dummy Text',
    };
    PROCESS_TEST.fixme('TECF003', async ({ page }) => {
        // const tabHelper = new TabHelper(page);
        const expense = new ExpenseHelper(page);
        const signIn = new SignInHelper(page);
        const verificationFlows = new ApprovalWorkflowsTab(page);
        const toggleHelper = new ApprovalToggleHelper(page);
        await toggleHelper.gotoExpenseApproval();
        await toggleHelper.allInactive();
        await expense.init();

        await expense.addDocument();
        await PROCESS_TEST.step('Fill Expense', async () => {
            await expense.fillBusinessDetails([BusinessInfo]);
            await expense.fillExpenses([EXPENSEDETAILS]);
        });
        // await expense.checkDepartmentFetch();
        await PROCESS_TEST.step('Add Taxes', async () => {
            await expense.addTaxesData([
                {
                    gst: '5%',
                    cess: '250',
                    tds: 'Cash withdrawal exceeding ',
                    tcs: '20',
                },
            ]);
        });
        // await PROCESS_TEST.step('Remove default input value', async () => {
        //     await expense.removeDefaultInputValue('department');
        // });
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
                    chalk.red('Check party status')
                ).toBe('Submitted');
            }
        );

        await PROCESS_TEST.step('Check Approval Flows', async () => {
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');

            await verificationFlows.checkLevel();
            await verificationFlows.checkUser();
            await verificationFlows.checkEmail();
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification Approval match')
            ).toBe('Pending Approval');
        });

        await PROCESS_TEST.step('Expense Approve', async () => {
            const pocEmail = await verificationFlows.checkEmail();
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await page.waitForLoadState('domcontentloaded');
            await signIn.signInPage(pocEmail, '1234567');
            // await page.waitForSelector('//div[@role="dialog"]', {
            //     state: 'attached',
            // });
            await page.getByText('New Test Auto').click();
            await page.waitForURL(TEST_URL + '/e/e');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.clickApprove([
                {
                    department: 'Sales',
                    expense_head: 'Foods & Accommodations',
                    comment: 'Expense approval with POC',
                },
            ]);
            // await tabHelper.clickTab('Approval Workflows');
            await page
                .locator('//button[@role="tab"]')
                .getByText('Approval Workflows')
                .click();
            await page.waitForTimeout(1000);
            expect(
                await verificationFlows.checkApprovalStatus(
                    'Verification Approvals'
                ),
                chalk.red('Verification Approval match')
            ).toBe('Approved');
        });
        await PROCESS_TEST.step('Level Status in FinOps', async () => {
            const expData = await verificationFlows.getExpData();
            await savedExpensePage.logOut();
            await signIn.signInPage('newtestauto@company.com', '123456');
            await savedExpensePage.clickLink('Expenses');
            await savedExpensePage.clickLink(expData.slice(1));
            await savedExpensePage.tabHelper.clickTab('Approval Workflows');
            expect(
                await verificationFlows.checkByFinOpsAdmin(
                    'Verification Approvals'
                ),
                chalk.red('Verification approval match')
            ).toBe('Approved');
        });

        await PROCESS_TEST.step('Check Expense Status', async () => {
            expect(
                await savedExpensePage.expenseStatusSuccess('verification'),
                chalk.red('Verification Status check')
            ).toBe(true);

            expect(
                await savedExpensePage.expenseStatusSuccess('finops'),
                chalk.red('FinOps Status check')
            ).toBe(true);
            expect(
                await savedExpensePage.expenseStatusSuccess('payment'),
                chalk.red('Payment status check')
            ).toBe(true);
        });

        await PROCESS_TEST.step('Check Business and Vendor', async () => {
            expect(
                await savedExpensePage.checkExpenseTo(),
                chalk.red('Client name match')
            ).toBe(BusinessInfo.to);
            expect(
                await savedExpensePage.checkExpenseFrom(),
                chalk.red('Vendor name match')
            ).toBe(BusinessInfo.from);
            await page.waitForTimeout(1000);
        });
    });
});

/**
 * @todo: Select department is yet to implement
 */
