import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { ObjectDto } from '@/types/common.types';

const TYPE_PREFIX = ['Cash', 'Ledger'];
export class PaymentModesHelper extends BaseHelper {
    public PaymentModeInfo;
    public PaymentMode_Update_Info;
    public notification: NotificationHelper;
    public form: FormHelper;
    public dialog: DialogHelper;
    public listing: ListingHelper;
    public status: StatusHelper;
    public breadCrumb: BreadCrumbHelper;
    constructor(page: any) {
        super(page);
        // this.PaymentModeInfo = PaymentModeInfo;
        this.notification = new NotificationHelper(page);
        this.form = new FormHelper(page);
        this.dialog = new DialogHelper(page);
        this.listing = new ListingHelper(page);
        this.status = new StatusHelper(page);
        this.breadCrumb = new BreadCrumbHelper(page);
    }

    public async init(): Promise<void> {
        await this.navigateTo('PAYMENTMODES');
    }

    public async addNewPaymentMode(): Promise<void> {
        await this.click({ role: 'button', text: 'Add New' });
        expect(
            await this._page.getByRole('dialog').isVisible(),
            'dialog visibility'
        ).toBe(true);
    }

    /**
     * Verifies the visibility of a bank based on its type.
     *
     * @param {string} type - The type_id from the select .
     * @return {Promise<void>} A Promise that resolves when the verification is complete.
     */
    public async verifyBankVisibility(type: string): Promise<void> {
        const bankField = await this.locate(
            '//div[@role="dialog"]//input[@name="bank_id"]'
        )._locator.isVisible();
        if (!(type in TYPE_PREFIX) && bankField) {
            expect(bankField, 'Check Bank Field Visibility').toBeTruthy();
        }
    }
    /**
     * Fill the payment mode based on the given schema and data.
     *
     * @param {ObjectDto} schema - The schema object.
     * @param {ObjectDto} data - The data object.
     * @return {Promise<void>} A promise that resolves when the payment mode is filled.
     */
    public async fillPaymentModeWithoutBank(
        schema: ObjectDto,
        data: ObjectDto
    ): Promise<void> {
        await this.form.fillFormInputInformation(schema, data, undefined, [
            'bank_id',
        ]);
    }

    /**
     * Retrieves the parent row based on the given name.
     *
     * @param {string} name - The name used to find the row.
     * @return {Promise<typeof row>} The parent row.
     */
    private async _parentRow(name: string): Promise<typeof row> {
        const row = (await this.listing.findRowInTable(name, 'NAME')).first();
        return row;
    }
    /**
     * Verifies the payment details.
     *
     * @param {string} name - The name of the element in row.
     * @param {string} columnName - The name of the column to check.
     * @return {Promise<void>} A Promise that resolves when the verification is complete.
     */
    public async verifyPaymentDetails(
        name: string,
        columnName: string
    ): Promise<void> {
        const parentRow = await this._parentRow(name);
        const cell = await this.listing.getCell(parentRow, columnName);
        await expect(cell).toBeVisible();
    }

    /**
     * Checks if the payment row text matches the expected text.
     *
     * @param {string} name - The name of the element in the row.
     * @param {string} columnName - The name of the column to check.
     * @param {string} expectedText - The expected text to match.
     * @return {Promise<void>} - Returns a Promise that resolves when the check is complete.
     */
    public async checkPaymentRowText(
        name: string,
        columnName: string,
        expectedText: string
    ): Promise<void> {
        const parentRow = await this._parentRow(name);
        const cell = await this.listing.getCellText(parentRow, columnName);

        expect(cell).toBe(expectedText);
    }

    /**
     * Clicks the payment action for a given name.
     *
     * @param {string} name - The name of the element that we want to perform the action button to click.
     * @return {Promise<void>} A promise that resolves when the action is clicked.
     */
    public async clickPaymentAction(name: string): Promise<void> {
        const parentRow = await this._parentRow(name);
        const getAction = await this.listing.getCellButton(parentRow, 'ACTION');
        await getAction.click();
    }

    /**
     * Retrieves the status of a given name.
     *
     * @param {string} name - The name of element that we want to retrieve the status for.
     * @return {Promise<string>} The status of the given name.
     */
    public async getStatus(name: string): Promise<string> {
        const parentRow = await this._parentRow(name);
        const getStatus = await this.listing.getCellText(parentRow, 'STATUS');
        return getStatus;
    }

    public async checkStatus(name: string, state: string): Promise<void> {
        const status = await this.getStatus(name);
        expect(status).toBe(state);
    }
}
