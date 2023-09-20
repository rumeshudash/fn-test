import { Page, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
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

    public async init() {
        await this.navigateTo('PAYMENTMODES');
    }

    public async addNewPaymentMode() {
        await this.click({ role: 'button', text: 'Add New' });
        expect(
            await this._page.getByRole('dialog').isVisible(),
            'dialog visibility'
        ).toBe(true);
    }

    public async verifyBankVisibility(type: string) {
        const bankField = await this.locate(
            '//div[@role="dialog"]//input[@name="bank_id"]'
        )._locator.isVisible();
        if (!(type in TYPE_PREFIX) && bankField) {
            expect(bankField, 'Check Bank Field Visibility').toBe(true);
        }
    }
    /**
     * Fill the payment mode based on the given schema and data.
     *
     * @param {ObjectDto} schema - The schema object.
     * @param {ObjectDto} data - The data object.
     * @return {Promise<void>} A promise that resolves when the payment mode is filled.
     */
    public async fillPaymentMode(schema: ObjectDto, data: ObjectDto) {
        const { key, obj } = schema;

        // const type = schema?.type;

        for (const [key, value] of Object.entries(schema)) {
            // console.log(key);
            // console.log(value);
            // console.log(value?.name);
            if (key === 'bank_id') continue;
            if (value in TYPE_PREFIX) {
                await this.fillInput(value, { name: 'name' });

                await this.selectOption({
                    option: value,
                    name: 'type_id',
                });
            } else {
                await this.form.fillFormInputInformation(schema, data);
            }
        }
    }
    // public async fillPaymentMode(data: ObjectDto) {
    //     for (const [key, value, type] of Object.entries(data)) {
    //         if (value in TYPE_PREFIX) {
    //             await this.fillInput(value, { name: key });
    //         } else {
    //             await this.fillInput(value, { name: key });
    //         }
    //     }
    // }

    // public async fillPaymentMode(data={}) {
    //  for (const item in data){
    //     if

    //  }

    // public async fillPaymentMode(data: string) {
    //     if (data in TYPE_PREFIX) {
    //         await this.fillText(data, { name: 'name' });
    //     }else{

    //     }
    // }
    // public async verifyAddNewPaymentMode() {
    //     const addPaymentHeading = await this.locate()
    //         ._locator.getByRole('heading')
    //         .textContent();
    //     expect(
    //         addPaymentHeading,
    //         chalk.red('Payment Mode Heading check')
    //     ).toContain('Add payment mode');
    // }

    private async _parentRow(name: string) {
        const row = (await this.listing.findRowInTable(name, 'NAME')).first();
        return row;
    }
    public async verifyPaymentDetails(name: string, columnName: string) {
        const parentRow = await this._parentRow(name);
        const cell = await this.listing.getCell(parentRow, columnName);
        await expect(cell).toBeVisible();
    }

    public async clickPaymentAction(name: string) {
        const parentRow = await this._parentRow(name);
        const getAction = await this.listing.getCellButton(parentRow, 'ACTION');
        await getAction.click();
    }

    public async getStatus(name: string) {
        const parentRow = await this._parentRow(name);
        const getStatus = await this.listing.getCellText(parentRow, 'STATUS');
        return getStatus;
    }

    public async checkStatus(name: string, state: string) {
        const status = await this.getStatus(name);
        expect(status).toBe(state);
    }

    // public async verifyBankStatus(status: string) {
    //     const parentHelper = this.locate(
    //         `//p[text()="${this.PaymentModeInfo.name}"]/parent::div/parent::div`
    //     )._locator.first();
    //     const bank_status = await parentHelper
    //         .locator(`//button[text()="${status}"]`)
    //         .isVisible();
    //     expect(bank_status, chalk.red('Bank status visibility')).toBe(true);
    // }
}
