import { BaseHelper } from '@/baseHelper';
import { Page, expect } from '@playwright/test';
import { FileHelper } from './file.helper';
import { formatDate } from '@/utils/common.utils';
import { DialogHelper } from './dialog.helper';

type tableView = 'Table View' | 'Document View';

export class DocumentHelper extends BaseHelper {
    private _fileHelper: FileHelper;
    private _dialogHelper: DialogHelper;

    constructor(page: Page) {
        super(page);
        this._fileHelper = new FileHelper(page);
        this._dialogHelper = new DialogHelper(page);
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
     * Retrieve the pagination container element.
     *
     * @return {HTMLElement} The pagination container element.
     */
    public getPaginationContainer() {
        return this.getDocumentContainer()
            .getLocator()
            .locator('.absolute.z-10.gap-2.row-flex');
    }

    /**
     * Retrieve the pagination text.
     *
     * @return {Promise<string>} The pagination text.
     */
    public getPaginationText() {
        const paginationContainer = this.getPaginationContainer();
        return paginationContainer.locator('div').nth(2).textContent();
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

    public async checkDocument(comment: string, date?: Date) {
        const row = this.getDocumentContainer()
            .getLocator()
            .locator("//div[contains(@class,'flex gap-4')]")
            .filter({
                hasText: comment,
            });
        expect(row).not.toBeNull();

        if (date) {
            const formattedDate = formatDate(date);
            await expect(row).toContainText(formattedDate);
        }
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

    /**
     * Check if the document title is visible.
     *
     * @param {string} name - Name of the document to be checked.
     * @return {Promise<void>} Promise that resolves once the document title is checked.
     */
    public async checkDocumentTitle(name: string) {
        const title = this._dialogHelper
            .getDialogContainer()
            .getLocator()
            .locator(
                "//div[@class='overflow-hidden font-medium overflow-ellipsis whitespace-nowrap']"
            );
        const titleText = await title.textContent();
        expect(titleText).toBe(name);
    }

    /**
     * Checks if the zoom button is working.
     *
     *
     * @return {Promise<void>} Promise that resolves once the zoom button is checked.
     */
    public async checkZoom() {
        const container = this.getDocumentContainer().getLocator();
        const button = container.locator(`//button[@data-title='Zoom']`);
        await button.click();

        const zoom = container.getByText('Zoom:');
        await expect(zoom).toBeVisible();
    }

    /**
     * Checks if the pagination button is working
     *
     *
     * @return {Promise<void>} Promise that resolves once the zoom button is checked.
     */
    public async checkPagination() {
        const paginationContainer = this.getPaginationContainer();
        const back = paginationContainer.locator(
            "//button[@data-title='resource_pagination_prev']"
        );
        const next = paginationContainer.locator(
            '//button[@data-title="resource_pagination_next"]'
        );

        // get initial pagination number
        let paginationText = await this.getPaginationText();
        const initialPage = paginationText.split('/')[0];

        // check if back button is disabled initially
        await expect(back).toBeDisabled();
        await next.click();

        // check if back button is enabled after clicking next
        await expect(back).toBeEnabled();

        // check if next button is working
        paginationText = await this.getPaginationText();
        let currentPage = Number(paginationText.split('/')[0]);
        expect(currentPage).toBe(Number(initialPage) + 1);

        // check if back button is working
        await back.click();
        paginationText = await this.getPaginationText();
        currentPage = Number(paginationText.split('/')[0]);
        expect(currentPage).toBe(Number(initialPage));
    }

    /**
     * Checks if the delete document is working.
     *
     * @param {comment} comment - comment of the document to be checked for deletion.
     * @param {date} date - date of the document to be checked for deletion.
     * @return {Promise<void>} Promise that resolves once the document is checked.
     */

    public async checkDocumentDelete(document: {
        comment: string;
        date?: Date;
    }) {
        const container = this.getDocumentContainer().getLocator();
        // delete the document
        const row = container
            .locator("//div[contains(@class,'flex gap-4')]")
            .filter({
                hasText: document.comment,
            });
        await row.click();
        await row.locator('button').last().click();
        await this._dialogHelper.clickConfirmDialogAction('Yes');

        // confirm the deletion
        await this._page
            .locator('div.ct-toast-success')
            .waitFor({ state: 'visible' });

        await this._page.waitForTimeout(500);

        const deletedRow = await container
            .locator("//div[contains(@class,'flex gap-4')]")
            .filter({
                hasText: document.comment,
            })
            .isVisible();

        expect(deletedRow).toBe(false);
    }
}
