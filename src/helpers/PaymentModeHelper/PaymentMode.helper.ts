import { Page, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';

export class PaymentModesHelper extends BaseHelper {
    public PaymentModeInfo;
    public PaymentMode_Update_Info;
    public notification: NotificationHelper;
    public form: FormHelper;
    public dialog: DialogHelper;
    public listing: ListingHelper;
    public status: StatusHelper;
    public breadCrumb: BreadCrumbHelper;
    constructor(PaymentModeInfo, page: any) {
        super(page);
        this.PaymentModeInfo = PaymentModeInfo;
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

    public async verifyAddNewPaymentMode() {
        const addPaymentHeading = await this.locate()
            ._locator.getByRole('heading')
            .textContent();
        expect(
            addPaymentHeading,
            chalk.red('Payment Mode Heading check')
        ).toContain('Add payment mode');
    }

    private _parentRow(name: string) {
        const row = this.listing.findRowInTable(name, 'NAME');
        return row;
    }
    public async verifyPaymentDetails(name: string, columnName: string) {
        const parentRow = (await this._parentRow(name)).first();
        const cell = await this.listing.getCell(parentRow, columnName);
        await expect(cell).toBeVisible();
    }

    public async verifyBankStatus(status: string) {
        const parentHelper = this.locate(
            `//p[text()="${this.PaymentModeInfo.name}"]/parent::div/parent::div`
        )._locator.first();
        const bank_status = await parentHelper
            .locator(`//button[text()="${status}"]`)
            .isVisible();
        expect(bank_status, chalk.red('Bank status visibility')).toBe(true);
    }
}
