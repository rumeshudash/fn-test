import { expect } from '@playwright/test';

import { NotesHelper } from '../BaseHelper/notes.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';

export class ExpenseHeadDetailsHelper extends ListingHelper {
    /**
     *
     * @description - Creating instnce of NotesHelper, TabHelper, NotificationHelper, BreadCrumbHelper, DocumentHelper, DialogHelper, DetailsPageHelper
     */
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public breadCrumbHelper: BreadCrumbHelper;

    public documentHelper: DocumentHelper;

    public dialogHelper: DialogHelper;

    public detailsHelper: DetailsPageHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);

        this.breadCrumbHelper = new BreadCrumbHelper(page);

        this.documentHelper = new DocumentHelper(page);

        this.dialogHelper = new DialogHelper(page);

        this.detailsHelper = new DetailsPageHelper(page);
    }
    /**
     * @description - Navigate to Expense Head Page
     */
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }
    /**
     *@description - This function will click on the Expense Head
     *
     * @param {string}name - Name of the Expense Head to be redirected
     */

    public async clickOnExpenseHead(name: string) {
        await this.tabHelper.clickTab('All');

        await this._page.waitForTimeout(1000);

        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickTextOnTable(row, 'NAME');

        await this._page.waitForTimeout(3000);
    }

    /**
     *@description - This function will click on the manager name and redirect to the manager details page
     *
     * @param name - Name of the manager
     */
    public async clickOnManagerName(name: string) {
        await this._page.getByText(name).click();

        this._page.waitForTimeout(2000);
    }

    /**
     * @description - This function will click on the edit icon of expense head details page
     *
     */
    public async clickOnEditIcon() {
        await this._page.locator('.items-center > button').first().click();

        this._page.waitForTimeout(2000);
    }

    /**
     * @description - This function will Edit the Expense Head with name of the expense head, parent and manager
     *
     * @param {string} name -Name of the Expense Head
     *
     * @param {string} parent - The optional parent feild to be edited selected from select option
     * @param {string}manager - The optional manager feild to be edited selected from select option
     */

    public async editExpenseHead(
        name: string,
        parent?: string,
        manager?: string
    ) {
        await this._page.waitForTimeout(1000);
        await this.fillText(name, {
            name: 'name',
        });
        if (parent) {
            await this.selectOption({
                input: parent,
                name: 'parent_id',
            });
        }
        if (manager) {
            await this.selectOption({
                input: manager,
                name: 'manager_id',
            });
        }
        await this._page.waitForTimeout(1000);
        await this.click({ role: 'button', name: 'save' });
    }
    /**
     * @description - This function will click on the Actions button
     *
     */
    public async clickOnActions() {
        this.clickButton('Actions');
        this._page.waitForTimeout(1000);
    }

    /**
     * @description - This function will click on the tab
     * @param {string} tabName - Name of the tab to be clicked
     *
     */

    public async clickOnTab(tabName: string) {
        await this.tabhelper.clickTab(tabName);
    }

    /**
     *@description - This function will will add the Notes on specific expense head
     *
     * @param notes - Notes to be added
     */
    public async addNotes(notes: string) {
        await this.clickButton('Add Notes');
        await this.fillText(notes, {
            name: 'comments',
        });
        await this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }
    /**
     *
     * @description - This function will add the Documents on specific expense head
     *
     * @param  document {comment: string; imagePath: string; date: Date} - Comment and Image Path of the document to be added
     *
     */
    public async addDocument(document: { comment: string; imagePath: string }) {
        await this.detailsHelper.openActionButtonItem('Add Documents');
        await this.documentHelper.uploadDocument(true);
        await this.fillText(document.comment, { name: 'comments' });
        await this.clickButton('Save');
        await this._page.waitForTimeout(1000);
    }
    /**
     * @description - This function will verify the addition of the document
     *
     * @param document {comment: string; imagePath: string; date: Date} - Comment, Image Path and Date of the document to be added
     */
    public async verifyDocumentAddition(document: {
        comment: string;
        imagePath: string;
        date: Date;
    }) {
        await this.tabHelper.clickTab('Documents');
        await this.documentHelper.toggleDocumentView('Table View');
        await this.documentHelper.checkDocument(
            document.comment,
            document.date
        );
    }
    /**
     * @description - This function will verify check the zoom functionality
     *
     */
    public async checkZoom() {
        await this.documentHelper.toggleDocumentView('Document View');
        await this.documentHelper.checkZoom();
    }
    /**
     *
     * @description - This function will check the pagination
     */
    public async checkPagination() {
        await this.documentHelper.checkPagination();
    }
    /**
     *
     * @description - This function will Verify the addition of the notes
     *
     * @param note {title: string; date: Date} - Title and Date of the note to be added
     */
    public async verifyNoteAddition(note: { title: string; date: Date }) {
        await this.noteHelper.checkNoteExists({
            title: note.title,
        });
    }
    /**
     *
     * @description - This function will delete the documents
     *
     * @param document {comment: string; date: Date} - Comment and Date of the document to be deleted
     */
    public async documentDelete(document: { comment: string; date: Date }) {
        await this.documentHelper.toggleDocumentView('Table View');
        await this.documentHelper.checkDocumentDelete({
            comment: document.comment,
        });
    }
    /**
     *
     * @description - This function will Edits the notes
     *
     * @param note {title: string; date: Date} - Title and Date of the note to be edited
     * @param {string} newNotes - New notes to be added
     */
    public async editNotes(
        note: { title: string; date: Date },
        newNotes: string
    ) {
        await this.noteHelper.clickEditButton({
            title: note.title,
        });

        await this.fillText(newNotes, {
            name: 'comments',
        });

        await this.clickButton('Save');

        await this._page.waitForTimeout(1000);
    }

    /**
     *
     * @description - This function will delete the notes
     *
     * @param note {title: string; date: Date} - Title and Date of the note to be deleted
     */
    public async deleteNotes(note: { title: string; date: Date }) {
        await this.noteHelper.clickDeleteIcon({
            title: note.title,
        });
    }

    /**
     *
     *@description - This function will redirect to the details page of the expense ,bill from and bill to from expense head details page
     *
     * @param {string} expense_number - The Expense Number to be searched
     * @param {string} columnName - The Column Name to be searched
     */

    public async openDetailsPage(expense_number: string, columnName: string) {
        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(expense_number, 'EXPENSE NO.');

        await this.clickTextOnTable(row, columnName);

        await this._page.waitForTimeout(3000);
    }

    public async checkExpenseStatus(expense_number: string, status: string) {
        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(expense_number, 'EXPENSE NO.');

        const statusText = await this.getCellText(row, 'STATUS');

        expect(statusText).toBe(status);
    }

    public async checkBalance(expense_number: string, balance: string) {
        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(expense_number, 'EXPENSE NO.');

        const balanceText = await this.getCellText(row, 'BALANCE');

        expect(balanceText).toBe(balance);
    }

    public async checkExpenseAmnt(expense_number: string, amnt: string) {
        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(expense_number, 'EXPENSE NO.');

        const amntText = await this.getCellText(row, 'EXPENSE AMOUNT');

        expect(amntText).toBe(amnt);
    }

    public async checkDate(expense_number: string, date: string) {
        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(expense_number, 'EXPENSE NO.');

        const dateText = await this.getCellText(row, 'EXPENSE DATE');

        expect(dateText).toBe(date);
    }
}
