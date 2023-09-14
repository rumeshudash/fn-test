import { expect } from '@playwright/test';

import { NotesHelper } from '../BaseHelper/notes.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';

export class ExpenseHeadDetailsHelper extends ListingHelper {
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public breadCrumbHelper: BreadCrumbHelper;

    public documentHelper: DocumentHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);

        this.breadCrumbHelper = new BreadCrumbHelper(page);

        this.documentHelper = new DocumentHelper(page);
    }
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }

    public async clickOnExpenseHead(name: string) {
        await this.tabHelper.clickTab('All');

        await this._page.waitForTimeout(1000);

        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickTextOnTable(row, 'NAME');

        await this._page.waitForTimeout(3000);
    }

    public async clickOnManagerName(name: string) {
        await this._page.getByText(name).click();

        this._page.waitForTimeout(2000);
    }

    public async clickOnEditIcon() {
        await this._page.locator('.items-center > button').first().click();

        this._page.waitForTimeout(2000);
    }

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
                option: parent,
                hasText: 'Select a Parent',
            });
        }
        if (manager) {
            await this.selectOption({
                option: manager,
                hasText: 'Select a manager',
            });
        }
        await this._page.waitForTimeout(1000);
        await this.click({ role: 'button', name: 'save' });
    }

    public async clickOnActions() {
        this.clickButton('Actions');
        this._page.waitForTimeout(1000);
    }

    public async clickOnTab(tabName: string) {
        await this.tabhelper.clickTab(tabName);
    }
    public async clickOnAddNotes(notes: string) {
        await this.clickButton('Add Notes');
        await this.fillText(notes, {
            name: 'comments',
        });
        await this._page.waitForTimeout(1000);
    }

    public async addDocument() {
        // await this.clickButton('Upload Documents');
        await this.documentHelper.uploadDocument(false);

        this._page.waitForTimeout(1000);

        await this.clickButton('Save');
    }

    public async checkDocuments() {
        await this.documentHelper.toggleDocumentView('Table View');
        await this.documentHelper.checkDocument('testTest495235');
    }

    public async checkZoom() {
        await this.documentHelper.checkZoom();
    }

    public async checkPagination() {
        await this.documentHelper.checkPagination();
    }

    public async verifyNoteAddition(note: { title: string; date: Date }) {
        await this.noteHelper.checkNoteExists({
            title: note.title,
        });
    }
    public async checkDocumentDelete() {
        await this.documentHelper.checkDocumentDelete({
            comment: 'testTest626555',
        });
    }

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

    public async deleteNotes(note: { title: string; date: Date }) {
        await this.noteHelper.clickDeleteIcon({
            title: note.title,
        });
    }

    public async checkExpense(expense_number: string, columnName: string) {
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
