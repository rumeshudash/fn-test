import { Locator, Page, expect } from '@playwright/test';
import { PageHelper } from './page.helper';
import { TabHelper } from './tab.helper';
import chalk from 'chalk';

export class ListingHelper extends PageHelper {
    public tabHelper: TabHelper;

    public constructor(page: Page) {
        super(page);
        this.tabHelper = new TabHelper(page);
    }

    /**
     * Performs a search in the list using the specified query.
     *
     * @param {string | number} query - The query to search for in the list.
     * @return {Promise<void>} A promise that resolves once the search is complete.
     */
    public async searchInList(query: string | number): Promise<void> {
        await this.fillInput(query, { type: 'search' });
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
    }

    /**
     * Retrieves the table container element from the DOM.
     *
     * @return {Locator} The locator of the table container element.
     */
    public getTableContainer(): Locator {
        return this.locate('div', {
            class: ['table', 'finnoto__table__container'],
        }).getLocator();
    }

    /**
     * Retrieves the column names of a table.
     *
     * @return {Promise<string[]>} An array of column names.
     */
    public async getTableColumnNames(): Promise<string[]> {
        const table = this.getTableContainer();
        return table
            .locator('div.table-header-group > div.table-row > div.table-cell')
            .allInnerTexts();
    }

    /**
     * Finds a row in the table based on a query and the column title to search by.
     *
     * @param {string} query - The query to search for in the table.
     * @param {string} columnName - The columnName of the column to search by.
     * @return {Promise<Locator>} - The element handle of the row that matches the query.
     */
    public async findRowInTable(
        query: string,
        columnName: string
    ): Promise<Locator> {
        await this._page.waitForLoadState('networkidle');
        const table = this.getTableContainer();
        const titleIndex = await this._findColumnIndex(columnName);

        return table
            .locator(
                `> div.table-row.body-row > div.table-cell:nth-child(${
                    titleIndex + 1
                })`
            )
            .getByText(query, { exact: true })
            .locator('//ancestor::div[contains(@class,"table-row")]');
    }

    /**
     * Retrieves the cell element in a table row based on the given title.
     *
     * @param {Locator} row - The table row locator.
     * @param {string} columnName - The columnName to search for in the table.
     * @return {Promise<Locator>} The locator of the cell element.
     */
    public async getCell(row: Locator, columnName: string): Promise<Locator> {
        const titleIndex = await this._findColumnIndex(columnName);
        return row.locator(`> div.table-cell:nth-child(${titleIndex + 1})`);
    }

    /**
     * Retrieves the text of a cell in a table based on the row and the title of the cell.
     *
     * @param {Locator} row - The locator of the row.
     * @param {string} columnName - The columnName of the cell to search for.
     * @return {Promise<string>} The inner text of the cell.
     */
    public async getCellText(
        row: Locator,
        columnName: string
    ): Promise<string> {
        return (await this.getCell(row, columnName)).innerText();
    }

    /**
     * Retrieves the button element within a cell based on the row and title.
     *
     * @param {Locator} row - The row locator of the cell.
     * @param {string} columnName - The columnName to search for within the cell.
     * @return {Promise<Locator>} The locator of the button element in the cell.
     */
    public async getCellButton(
        row: Locator,
        columnName: string
    ): Promise<Locator> {
        const cell = await this.getCell(row, columnName);
        return cell.locator('button');
    }

    /**
     * Clicks a button in a table row based on the provided locator and searchByTitle.
     *
     * @param {Locator} row - The locator of the table row.
     * @param {string} columnName - The columnName to search for in the table row.
     * @return {Promise<void>} - A promise that resolves when the button is clicked.
     */
    public async clickButtonInTable(
        row: Locator,
        columnName: string
    ): Promise<void> {
        await (await this.getCellButton(row, columnName)).click();
    }

    /**
     * Find the index of a column in the table based on its title.
     *
     * @param {string} columnName - The columnName of the column to search for.
     * @return {number} The index of the column, or -1 if it is not found.
     */
    private async _findColumnIndex(columnName: string): Promise<number> {
        const headingTitles = await this.getTableColumnNames();
        return headingTitles.indexOf(columnName);
    }

    public async openDialogFormByButtonText(text: string) {
        const button = await this.locateByText(text);

        expect(await button.isVisible(), {
            message: `opening "${text}" dialog form`,
        }).toBe(true);
        await button.click();
        console.log(chalk.blue('Open Add Business Form'));
    }

    /**
     * Opens details page based on identifier of the row.
     *
     * @param {string} id - The identifier of the row.
     * @param {string} columnName - The columnName to search for in the table row.
     * @return {Promise<void>} - Promise that resolves when the link is clicked.
     */
    public async openDetailsPage(
        id: string,
        columnName: string
    ): Promise<void> {
        await this.searchInList(id);
        const row = await this.findRowInTable(id, columnName);
        const cell = await this.getCell(row, columnName);
        await cell.locator('a').click();
    }

    /**
     * This function helps to get Locator of the text element in the cell.
     * @param {Locator} row - The locator of the table row.
     *
     * @param {string} columnName - The columnName to search for in the table row.
     * @return {Promise<Locator>} - The locator of the text element in the cell.
     */

    private async getTextLocator(
        row: Locator,
        columnName: string
    ): Promise<Locator> {
        const cell = await this.getCell(row, columnName);
        const locator = cell.locator('a');
        console.log(chalk.blue('Get Text Locator', locator));
        return locator;
    }

    /**
     * @description This function helps to click on the text element in the cell.
     * @param {Locator} row - The locator of the table row.
     * @param {string} columnName - The columnName to search for in the table row.
     */

    public async clickTextOnTable(
        row: Locator,
        columnName: string
    ): Promise<void> {
        const text = await this.getTextLocator(row, columnName);
        await text.click();
    }

    /**
     *
     * @description This function helps to check if row exists or not
     * @param {string}query - The query to search for in the table row.
     * @param {string}columnName - The columnName to search for in the table row.
     * @returns {Promise<boolean>} - returns true if row exists else false
     */
    public async ifRowExists(
        query: string,
        columnName: string
    ): Promise<boolean> {
        const row = await this.findRowInTable(query, columnName);

        return row.isVisible();
    }
}
