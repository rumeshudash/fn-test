import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/ExpenseHelper/expense.helper';
import {
    ApprovalToggleHelper,
    SavedExpenseCreation,
} from '@/helpers/ExpenseHelper/savedExpense.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe('FinOps_ExpenseCreation', () => {
    const BusinessInfo = {
        to: 'Hidesign India Pvt Ltd',
        from: 'Adidas India Marketing Private Limited',
    };
    const EXPENSEDETAILS = {
        invoice: ' inv' + generateRandomNumber(),
        amount: 10000,
        taxable_amount: 10000,
        // expense_head: 'Stationary',
        pay_to: 'Vendor',
        desc: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. N',
    };
    PROCESS_TEST.fixme('TECF001', async ({ page }) => {
        const expense = new ExpenseHelper(page);
        const toggleHelper = new ApprovalToggleHelper(page);
        const savedExpensePage = new SavedExpenseCreation(page);
        await toggleHelper.gotoExpenseApproval();
        await toggleHelper.allInactive();
        await expense.init();

        await PROCESS_TEST.step('Fill Expense Details', async () => {
            await expense.addDocument();
            await expense.fillBusinessDetails([BusinessInfo]);
            await expense.fillExpenses([EXPENSEDETAILS]);
        });

        await PROCESS_TEST.step('Fill Tax ', async () => {
            await expense.addTaxesData([
                {
                    gst: '12%',
                    cess: '200',
                    tds: 'Salaries', //takes from second row
                    tcs: '12',
                },
            ]);
        });
        await PROCESS_TEST.step('Remove default input value', async () => {
            await expense.removeDefaultInputValue('poc');
            await expense.removeDefaultInputValue('department');
        });
        // await page.getByRole('button', { name: 'Save' }).click();
        await expense.clickButton('Save');

        await PROCESS_TEST.step('Check Saved and Party Status', async () => {
            await savedExpensePage.notification.checkToastSuccess(
                'Invoice raised successfully.'
            );
            // expect(
            //     await savedExpensePage.toastMessage(),
            //     chalk.red('Invoice not raised.')
            // ).toBe('Invoice raised successfully.');
            expect(
                await savedExpensePage.checkPartyStatus(),
                chalk.red('Party Status not open.')
            ).toBe('Open');
        });

        await PROCESS_TEST.step('Expense Status', async () => {
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

        await PROCESS_TEST.step('Check Business and Vendor', async () => {
            expect(
                await savedExpensePage.checkExpenseTo(),
                chalk.red('Check To match')
            ).toBe(BusinessInfo.to);
            expect(
                await savedExpensePage.checkExpenseFrom(),
                chalk.red('Check from match')
            ).toBe(BusinessInfo.from);
        });
    });
});
