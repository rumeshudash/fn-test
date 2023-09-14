import { ListingHelper } from '../BaseHelper/listing.helper';
import { expect } from '@playwright/test';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
export class DocumentspreferenceHelper extends ListingHelper {
    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.notificationHelper = new NotificationHelper(page);
        this.dialogHelper = new DialogHelper(page);
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

    public async clickAddBtn() {
        await this.clickButton('Add New');

        const title = await this.dialogHelper.getDialogTitle();

        expect(title).toBe('Add Document Preference');
    }

    public async addDocumentPreference(Document: string) {
        const text = await this.ifRowExists(Document, 'NAME');

        expect(text).toBe(false);

        await this.clickAddBtn();
        if (Document) {
            await this.selectOption({
                option: Document,
                hasText: 'Search...',
            });
        }

        await this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }

    public async addDocumentMendatory(Document: string) {
        const text = await this.ifRowExists(Document, 'NAME');

        expect(text).toBe(false);

        await this.clickAddBtn();
        if (Document) {
            await this.selectOption({
                option: Document,
                hasText: 'Search...',
            });
        }
        await this._page
            .locator('label')
            .filter({ hasText: 'Document Mandatory' })
            .click();

        await this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }
    public async addDocumentFileMendatory(Document: string) {
        const text = await this.ifRowExists(Document, 'NAME');

        expect(text).toBe(false);

        await this.clickAddBtn();
        if (Document) {
            await this.selectOption({
                option: Document,
                hasText: 'Search...',
            });
        }
        await this._page
            .locator('label')
            .filter({ hasText: 'Document Files Mandatory' })
            .click();

        await this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }

    public async addWithBothMandatory(Document: string) {
        const text = await this.ifRowExists(Document, 'NAME');

        expect(text).toBe(false);

        await this.clickAddBtn();
        if (Document) {
            await this.selectOption({
                option: Document,
                hasText: 'Search...',
            });
        }
        await this._page
            .locator('label')
            .filter({ hasText: 'Document Mandatory' })
            .click();

        await this._page
            .locator('label')
            .filter({ hasText: 'Document Files Mandatory' })
            .click();

        await this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }

    public async addAndClickCheck(Document: string) {
        const text = await this.ifRowExists(Document, 'NAME');

        expect(text).toBe(false);

        await this.clickAddBtn();
        if (Document) {
            await this.selectOption({
                option: Document,
                hasText: 'Search...',
            });
        }
        await this._page
            .locator('label')
            .filter({ hasText: 'save and create another' })
            .click();

        await this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }
}
