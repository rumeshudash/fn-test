import { BaseHelper } from '@/baseHelper';
import { Page } from '@playwright/test';
import { ListingHelper } from './listing.helper';
import { NotificationHelper } from './notification.helper';

export class StatusHelper extends BaseHelper {
    private _listHelper: ListingHelper;
    private _notficationHelper: NotificationHelper;

    constructor(page: Page) {
        super(page);
        this._listHelper = new ListingHelper(page);
        this._notficationHelper = new NotificationHelper(page);
    }

    /**
     * Get the status button of a row.
     *
     * @param {string} name - Identifier of the row.
     * @return {Locator} Toggle Button element.
     */
    private async _getStatusButton(name: string, colName: string) {
        await this._listHelper.searchInList(name);
        const row = await this._listHelper.findRowInTable(name, 'NAME');
        const statusCell = await this._listHelper.getCell(row, colName);
        const toggleButton = statusCell.locator('button').first();
        return toggleButton;
    }

    /**
     * Set the status of a row.
     *
     * @param {string} name - Identifier of the row.
     * @param {string} status - Status to be set for the row.
     * @param {string} colName - Column name of the status button.
     * @return {Promise<void>} Promise that resolves once the status is set.
     */
    public async setStatus(
        name: string,
        status: string,
        colName: string = 'STATUS'
    ) {
        const toggleButton = await this._getStatusButton(name, colName);
        const currentStatus = await toggleButton.textContent();
        if (currentStatus !== status) {
            await toggleButton.click();
            const dialog = await this.locate(
                '//div[@role="dialog"]//div[text()="Do you want to Inactive?"]'
            )._locator.isVisible();

            if (dialog) {
                await this.click({ role: 'button', name: 'Yes!' });
            } else {
                await this.click({ role: 'button', name: 'Yes!' });
            }
            await this._page.waitForTimeout(500);
            await this._page.waitForLoadState('networkidle');
            await this._notficationHelper.checkToastSuccess(`Status Changed`);
        }
    }
}
