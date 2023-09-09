import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalToggleHelper,
    ApprovalWorkflowsTab,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;
const EXPENSEDETAILS = {
    to: 'Hidesign India Pvt Ltd',
    from: 'Adidas India Marketing Private Limited',
    invoice: ' inv' + generateRandomNumber(),
    amount: 10000,
    taxable_amount: 10000,
    expense_head: 'Rent',
    pay_to: 'Vendor',
    desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. N',
};
describe('TECF001', () => {
    PROCESS_TEST(
        'Raise Expense without poc, expense head and department',
        async ({ page }) => {
            const expense = new ExpenseHelper(page);
            const toggleHelper = new ApprovalToggleHelper(page);
            await toggleHelper.gotoExpenseApproval();
            await toggleHelper.allInactive();
            await expense.init();

            await expense.addDocument();
            await expense.fillExpenses([EXPENSEDETAILS]);
            await expense.addTaxesData([
                {
                    gst: '12%',
                    cess: '200',
                    tds: 'Salaries', //takes from second row
                    tcs: '12',
                },
            ]);
            // await page.getByRole('button', { name: 'Save' }).click();
            await expense.clickButton('Save');
            const savedExpensePage = new SavedExpenseCreation(page);

            await test.step('Check Saved and Party Status', async () => {
                expect(
                    await savedExpensePage.toastMessage(),
                    chalk.red('Invoice not raised.')
                ).toBe('Invoice raised successfully.');
                expect(
                    await savedExpensePage.checkPartyStatus(),
                    chalk.red('Party Status not open.')
                ).toBe('Open');
            });

            await test.step('Expense Status', async () => {
                expect(
                    await savedExpensePage.expenseStatusSuccess('verification'),
                    chalk.red('Verification Status check')
                ).toBe(false);
                expect(
                    await savedExpensePage.expenseStatusSuccess('finops'),
                    chalk.red('FinOps status check')
                ).toBe(false);
                expect(
                    await savedExpensePage.expenseStatusSuccess('payment'),
                    chalk.red('Payment Status check')
                ).toBe(false);
            });

            await test.step('Check Business and Vendor', async () => {
                expect(
                    await savedExpensePage.checkExpenseTo(),
                    chalk.red('Check To match')
                ).toBe(EXPENSEDETAILS.to + '…');
            });
        }
    );
});
