import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';
import { Locator, Page } from '@playwright/test';

import { TabHelper } from './tab.helper';

import { DialogHelper } from './dialog.helper';

export class NotesHelper extends DialogHelper {
    public tabHelper: TabHelper;

    constructor(page: any) {
        super(page);
        this.tabHelper = new TabHelper(page);
    }

    /**
     * @description Navigate to Notes page and Check Title of page
     *
     */
    public async addNotesTitle() {
        await this.checkDialogTitle('Add Note');
    }

    /**
     *@description This function will check if  Note tab is present or not
     *
     *
     */
    public async checkNoteTab() {
        await this.tabHelper.checkTabExists('Notes');
    }

    /**
     * @description This function will Click Notes Tab if  Note tab is present or not
     *
     *
     */
    public async clickNoteTab() {
        await this.tabHelper.clickTab('Notes');
    }

    /**
     * @description This function will return the the container of tab
     *
     *
     */
    public getNotesContainer(): Locator {
        return this.locate('div', {
            class: ['h-full', 'col-flex'],
        }).getLocator();
    }

    /**
     * @description This function will return the Row of the notes
     * @param {string} query - The query to search for in the nth element in row of notes
     *
     */
    public async getNotesRow(query: { title: string }): Promise<Locator> {
        const Notes = this.getNotesContainer();
        return Notes.locator('div.flex.gap-4').filter({
            hasText: query.title,
        });
    }

    /**
     * @description This function will Click on the Row of the notes
     *@param {string} query - The query to search for in the nth element in row of notes
     *
     */
    public async clickNotesRow(query: { title: string }) {
        const Notes = await this.getNotesRow(query);
        await Notes.click();
    }
    /**
     * @description This function will check if  Note is present or not
     *
     */

    public async checkNoteExists(query: { title: string }) {
        await this.clickNoteTab();
        const Notes = await this.getNotesRow(query);

        expect(Notes).toBeTruthy();
    }

    /**
     * @description This function will Click on the Edit button of the notes
     *@param {string} query - The query to search for in the nth element in row of notes
     *
     *
     */
    public async clickEditIcon(query: { title: string }) {
        const notesRow = await this.getNotesRow({
            title: query.title,
        });
        await this.clickNotesRow({
            title: query.title,
        });

        await notesRow.locator('//button').click();

        await this._page.waitForTimeout(1000);
    }
}
