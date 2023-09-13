import { BaseHelper } from '@/baseHelper';
import { Page, expect } from '@playwright/test';
import { FileHelper } from './file.helper';
import { formatDate } from '@/utils/common.utils';

type tableView = 'Table View' | 'Document View';

export class DocumentHelper extends BaseHelper {
    _fileHelper: FileHelper;

    constructor(page: Page) {
        super(page);
        this._fileHelper = new FileHelper(page);
    }

    /**
     * Retrieve the document container element.
     *
     * @return {HTMLElement} The document container element.
     */
    public getDocumentContainer() {
        return this.locate(
            "//div[@role='tabpanel'][.//text()[contains(., 'Documents')]]"
        );
    }

    /**
     * Checks if the button is present in document container.
     *
     * @param {string} buttonName - Button name to be checked.
     * @return {Promise<void>} Promise that resolves once the button is checked.
     */
    public async checkButton(buttonName: string) {
        const container = this.getDocumentContainer().getLocator();
        const button = container.locator(
            `//button[@data-title='${buttonName}']`
        );
        await expect(button).toBeVisible();
    }

    /**
     * Toggles the document view
     *
     * @param {string} state - Current state of the button.
     * @return {Promise<void>} Promise that resolves once the button is checked.
     */
    public async toggleDocumentView(state: tableView) {
        const container = this.getDocumentContainer().getLocator();
        const button = container.locator(`//button[@data-title='${state}']`);
        await button.click();
    }

    /**
     * Checks if all the buttons are present in document container.
     *
     * @return {Promise<void>} Promise that resolves once all the buttons are checked.
     */

    public async checkAllButtonsVisibility() {
        await this.checkButton('Download');
        await this.checkButton('Table View');
        await this.checkButton('Delete');
        await this.checkButton('Zoom');
    }

    /**
     * Checks if the added document is present in list.
     *
     * @param {comment} comment - comment to be checked.
     * @param {date} date - date to be checked.
     * @return {Promise<void>} Promise that resolves once the document is checked.
     */

    public async checkDocument(comment: string, date: Date) {
        const row = this.getDocumentContainer()
            .getLocator()
            .locator("//div[contains(@class,'flex gap-4')]")
            .filter({
                hasText: comment,
            });
        expect(row).not.toBeNull();

        const formattedDate = formatDate(date);
        await expect(row).toContainText(formattedDate);
    }

    /**
     * Uploads the file in the document container.
     *
     * @param {boolean} isDialog - Whether the file is uploaded from dialog or not.
     * @return {Promise<void>} Promise that resolves once the file is uploaded
     */
    public async uploadDocument(isDialog: boolean) {
        await this._fileHelper.setFileInput({ isDialog: isDialog });
    }
}
