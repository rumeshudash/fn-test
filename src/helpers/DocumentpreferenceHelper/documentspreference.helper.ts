import { ListingHelper } from '../BaseHelper/listing.helper';
import { expect } from '@playwright/test';
import { NotificationHelper } from '../BaseHelper/notification.helper';
export class DocumentspreferenceHelper extends ListingHelper {
    public notificationHelper: NotificationHelper;

    constructor(page: any) {
        super(page);
        this.notificationHelper = new NotificationHelper(page);
    }
    public async init() {
        await this.navigateTo('DOCUMENT_PREFERENCES');
    }

    public async searchTextInList(name: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(name, 'NAME');

        const text = await this.getCellText(row, 'NAME');

        expect(text).toBe(name);
    }

    public async getTableHeader(name: string[]) {
        const RowNames = await this.getTableColumnNames();

        expect(RowNames).toEqual(name);
    }

    public async changeSatus(name: string, columnName: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, columnName);

        await this._page.waitForTimeout(1000);
    }
}