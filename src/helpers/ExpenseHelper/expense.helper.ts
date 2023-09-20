import { expect } from '@playwright/test';
import { uuidV4 } from '../../utils/common.utils';
import { BaseHelper } from '.././BaseHelper/base.helper';
import { FormHelper } from '../BaseHelper/form.helper';

export class ExpenseHelper extends BaseHelper {
    public form: FormHelper;
    constructor(page: any) {
        super(page);
        this.form = new FormHelper(page);
    }
    // private static DOM_SELECTOR =
    //     '//div[text()='Details']/parent::div/parent::div';
    private static DETAIL_DOM_SELECTOR = '//div[text()="Details"]/parent::div';

    private static ADD_TAX_DOM_SELECTOR = '//div[@role="dialog"]';
    public amounts = [
        '100', // Auto Reject
        '110', //testing managers
        '2000', //Departmental
        '10000', // Verification Approval Travel Auto Approve
        '20000', // Auto Approval
        '810000', // All expenses
        '5000', // All travel bill
        '110000', // Sales bill greater than
        '510000', //Finance department invoices greater than
    ];
    public tax = '80';
    public department = 'Sales';
    public expenseHead = 'Travelling';

    public async init() {
        await this.navigateTo('RAISE_EXPENSES');
    }

    public static genInvoiceNumber() {
        return `INV-${uuidV4()}-${Date.now()}`;
    }

    /**
     * Performs the action of clicking the "Next" button and waits for 2 seconds.
     *
     * @return {Promise<void>} - A promise that resolves once the action is completed.
     */
    public async nextPage() {
        await this.click({ text: 'Next' });
        await this._page.waitForTimeout(1000);
    }

    /**
     * Selects a dropdown option based on the dropdown name and selectors.
     *
     * @param {string} dropdownName - The name of the dropdown.
     * @param {string} selectors.dropdownLabel - The label of the dropdown.
     * @param {string} selectors.name - The name of the dropdown value.
     * @param {string} selectors.gstin - The GSTIN (Goods and Services Tax Identification Number) of the dropdown value.
     * @param {number} selectors.nth - The index of the dropdown value.
     */
    private async _selectDropdown(
        dropdownName: string,
        selectors: {
            dropdownLabel?: string;
            name?: string;
            gstin?: string;
            nth?: number;
        }
    ) {
        const { dropdownLabel = 'bill-to' } = selectors;

        const dropdown = this.locate(
            `//button[text()="${dropdownName}"]/parent::div[@aria-label="${dropdownLabel}"]`
        );

        if (!(await dropdown.isVisible())) {
            await this.locateByLabel(`${dropdownLabel}-card`)
                .locator('//a[text()="Edit"]')
                .click();

            await this._selectDropdownValues(selectors);
            return;
        }

        await dropdown.click();
        await this._selectDropdownValues(selectors);
    }

    private async _selectDropdownValues({
        name,
        gstin,
        nth,
    }: {
        name?: string;
        gstin?: string;
        nth?: number;
    }) {
        if (!name && !gstin && !nth) throw new Error('No name or gstin or nth');

        let menuSelector =
            '//div[@data-radix-popper-content-wrapper]/div[@role="dialog"]';
        const dropdownMenu = this.locate(menuSelector);

        expect(await dropdownMenu.isVisible()).toBeTruthy();

        if (nth) {
            menuSelector += `/div/div[position()=2]/div[position()=${nth}]`;
            await this.locate(menuSelector).click();
            return;
        }

        menuSelector += '//span';

        if (name) menuSelector += `[contains(text(), "${name}")]`;
        if (gstin) menuSelector += `[contains(text(), "${gstin}")]`;

        menuSelector += `/parent::div/parent::div`;

        await this.locate(menuSelector).click();
    }

    /**
     * Fills the expenses with the given data array.
     *
     * @param {ExpenseDetailInputs[]} data - The array of expense detail inputs.
     * @return {Promise<void>} A promise that resolves when the expenses are filled.
     */

    public async fillExpenses(data: ExpenseDetailInputs[] = []) {
        const helper = this.locate(ExpenseHelper.DETAIL_DOM_SELECTOR);

        for (let expData of data) {
            if (expData.to)
                await helper._selectDropdown('Select Business', {
                    name: expData.to,
                });
            if (expData.to_nth)
                await helper._selectDropdown('Select Business', {
                    nth: expData.to_nth,
                });
            await helper.fillText(expData.invoice, {
                name: 'invoice_number',
            });
            await this._page.waitForTimeout(1000);

            if (expData.from)
                await helper._selectDropdown('Select Vendor', {
                    dropdownLabel: 'bill-from',
                    name: expData.from,
                });
            if (expData.from_nth)
                await helper._selectDropdown('Select Vendor', {
                    dropdownLabel: 'bill-from',
                    nth: expData.from_nth,
                });

            await helper.fillInput(expData.amount, {
                name: 'amount',
            });
            await helper.fillInput(expData.taxable_amount, {
                name: 'taxable_amount',
            });

            if (expData.department)
                await helper.selectOption({
                    input: expData.department,
                    name: 'department',
                });

            // remove default poc
            await this._page
                .locator(
                    "//input[@name='poc']/parent::div[contains(@class,'selectbox-container')]"
                )
                .locator('svg')
                .first()
                .click();

            if (expData.expense_head)
                await helper.selectOption({
                    input: expData.expense_head,
                    placeholder: 'Select Expense Head',
                });

            if (expData.poc)
                await helper.selectOption({
                    input: expData.poc,
                    name: 'poc',
                });

            if (expData.pay_to)
                await helper.selectOption({
                    option: expData.pay_to,
                    name: 'pay_to',
                });
            if (expData.employee) {
                await this._page.waitForTimeout(300);
                await helper.selectOption({
                    option: expData.employee,
                    placeholder: 'Select Employee',
                });
            }
            await helper.fillText(expData.desc, { name: 'description' });
        }
    }

    public async addTaxesData(data: AddTaxesData[] = []) {
        await this._page.getByRole('button', { name: 'Add Taxes' }).click();
        await this._page.waitForSelector('//div[@role="dialog"]', {
            state: 'attached',
        });
        const helper = this.locate(ExpenseHelper.ADD_TAX_DOM_SELECTOR);
        for (let taxData of data) {
            if (taxData.gst) {
                await helper._page
                    .getByRole('tab', { name: 'GST', exact: true })
                    .click();
                await helper.selectOption({
                    option: taxData.gst,
                    hasText: '5%',
                });
            }
            if (taxData.cess) {
                await helper._page.getByRole('tab', { name: 'CESS' }).click();
                await helper.fillText(taxData.cess, {
                    placeholder: 'Enter Amount',
                });
            }

            if (taxData.tds) {
                await helper._page.getByRole('tab', { name: 'TDS' }).click();
                await helper.selectOption({
                    option: taxData.tds,
                    placeholder: 'Select...',
                });
            }
            if (taxData.tcs) {
                await helper._page.getByRole('tab', { name: 'TCS' }).click();
                await helper.fillText(taxData.tcs, {
                    placeholder: 'Enter Percentage',
                });
            }
            await this._page.getByRole('button', { name: 'Save' }).click();
        }
    }

    public async addDocument() {
        await this._page
            .locator("//div[@role='presentation']")
            .locator("//input[@type='file']")
            .setInputFiles('images/pan-card.jpg');
        await this._page.waitForTimeout(1000);
    }
}
