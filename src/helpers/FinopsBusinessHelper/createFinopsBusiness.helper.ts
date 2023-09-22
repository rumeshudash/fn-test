import { LISTING_ROUTES } from '@/constants/api.constants';
import { ObjectDto } from '@/types/common.types';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';

export default class CreateFinopsBusinessHelper extends NotificationHelper {
    public listHelper: ListingHelper;
    public formHelper: FormHelper;

    constructor(page) {
        super(page);
        this.listHelper = new ListingHelper(page);
        this.formHelper = new FormHelper(page);
    }
    public async init() {
        const URL = LISTING_ROUTES['BUSINESSESS'];
        await this._page.goto(URL); // go to business page
        await this._page.waitForLoadState('networkidle');
    }

    public async clickNavigationTab(nav: string) {
        await this._page.locator(`//span[text()='${nav}']`).click();
        await this._page.waitForLoadState('networkidle');
    }

    public async checkEmailError(message?: string): Promise<void> {
        const errorMessage = await this.formHelper.getInputErrorMessage({
            name: 'email',
        });
        await this.ErrorMessageHandle(message, errorMessage);
    }
    public async checkMobileError(message?: string): Promise<void> {
        const errorMessage = await this.formHelper.getInputErrorMessage({
            name: 'mobile',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }
    public async checkGstinError(message?: string): Promise<void> {
        const errorMessage = await this.formHelper.getInputErrorMessage({
            name: 'gstin',
        });

        await this.ErrorMessageHandle(message, errorMessage);
    }

    public async ErrorMessageHandle(
        message: string,
        element: any
    ): Promise<void> {
        await this._page.waitForLoadState('networkidle');
        expect(await element.isVisible()).toBe(true);

        // for comparing two error message
        if (!message || !element) return;

        let textContent = await element.textContent();
        textContent = textContent.trim();

        if (textContent === message) return console.log(chalk.red(textContent));
        throw console.log(
            chalk.red(
                `"${textContent}" is not a valid error !! valid valid error should be "${message}"`
            )
        );
    }

    public async verifyBusinessName(
        cell: any,
        business_name: string
    ): Promise<void> {
        await expect(cell, {
            message: 'verifying business name',
        }).toHaveText(business_name);
    }

    public async verifyStatus(
        row: any,
        status: 'Active' | 'Inactive' = 'Active'
    ): Promise<void> {
        expect(await this.listHelper.getCellText(row, 'STATUS'), {
            message: `Checking ${status} status`,
        }).toBe(status);
    }

    public async clickBusinessNameCell(cell: any): Promise<void> {
        await cell.click();
        await this._page.waitForTimeout(1000);
    }
    public async redirectDetailPage(
        columnName: string,
        text: string
    ): Promise<void> {
        const row = await this.listHelper.findRowInTable(text, columnName);
        const name_cell = await this.listHelper.getCell(row, 'NAME');
        await name_cell.locator('//a').click();
        await this._page.waitForLoadState('networkidle');
    }

    public async verifyTableData(
        data: ObjectDto,
        isGstin?: boolean
    ): Promise<void> {
        let row: any;
        if (isGstin) {
            row = await this.listHelper.findRowInTable(data?.gstin, 'GSTIN');
        } else {
            row = await this.listHelper.findRowInTable(data?.name, 'NAME');
        }
        const name_cell = await this.listHelper.getCell(row, 'NAME');

        await this.verifyStatus(row);
        await this.listHelper.getCellText(row, 'ADDED AT');
        await this.verifyBusinessName(
            name_cell,
            isGstin ? data?.trade_name : data?.name
        );

        await this.VerifyTabClickable();
        await this.clickBusinessNameCell(name_cell);
    }

    public async VerifyTabClickable(): Promise<void> {
        await this.listHelper.tabHelper.clickTab('Inactive');
        await this.listHelper.tabHelper.clickTab('All');
        await this.listHelper.tabHelper.clickTab('Active');
    }
}
