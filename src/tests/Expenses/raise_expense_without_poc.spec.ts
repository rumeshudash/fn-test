import { PROCESS_TEST } from '@/fixtures';
import { ExpenseHelper } from '@/helpers/expense.helper';

const { expect, describe } = PROCESS_TEST;

describe('Raise Expense', () => {
    PROCESS_TEST('without poc', async ({ page }) => {
        const expense = new ExpenseHelper(page);

        await expense.init();

        await expense.nextPage();
        await expense.fillExpenses([
            {
                to_nth: 1,
                from_nth: 1,
                amount: 1000,
                taxable_amount: 900,
                desc: 'Dummy Text',
            },
        ]);
        await expense.addTaxesData([
            {
                gst: '5%',
                cess: '2000',
            },
        ]);
    });

    PROCESS_TEST('with poc', async ({ page }) => {
        const expense = new ExpenseHelper(page);

        await expense.init();

        await expense.nextPage();
        await expense.fillExpenses([
            {
                to_nth: 1,
                from_nth: 1,
                amount: 10000,
                taxable_amount: 9000,
                department: 'Hr',
                expense_head: 'Rent',
                poc: 'Abhishek',
                pay_to: 'Vendor',
            },
        ]);
    });
});
