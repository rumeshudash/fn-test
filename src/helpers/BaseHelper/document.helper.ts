import { BaseHelper } from '@/baseHelper';
import { Page, expect } from '@playwright/test';
import { FileHelper } from './file.helper';

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
     * Uploads the file in the document container.
     *
     * @return {Promise<void>} Promise that resolves once the file is uploaded
     */
    public async uploadDocument() {
        await this._fileHelper.setFileInput();
    }
}
