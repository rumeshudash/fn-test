import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

import { NotesHelper } from '../BaseHelper/notes.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';

export class ExpenseHeadDetailsHelper extends ListingHelper {
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public breadCrumbHelper: BreadCrumbHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);

        this.breadCrumbHelper = new BreadCrumbHelper(page);
    }
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }

    public async clickOnExpenseHead(name: string) {
        await this.tabHelper.clickTab('All');

        await this._page.waitForTimeout(1000);

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

    public async addDocument(document: { comment: string; imagePath: string }) {
        // await this.clickButton('Upload Documents');
        await this._page
            .locator("//div[@role='presentation']")
            .locator("//input[@type='file']")
            .setInputFiles(`images/${document.imagePath}`);
        await this._page.waitForTimeout(1000);

        await this.fillText(document.comment, { name: 'comments' });
        await this.clickButton('Save');

        this._page.waitForTimeout(1000);
    }

    public async verifyNoteAddition(note: { title: string; date: Date }) {
        await this.noteHelper.checkNoteExists({
            title: note.title,
        });
    }

    public async editNotes(
        note: { title: string; date: Date },
        newNotes: string
    ) {
        await this.noteHelper.clickNoteTab();

        await this.noteHelper.clickEditIcon({
            title: note.title,
        });

        await this._page.getByRole('menuitem', { name: 'Edit' }).click();

        await this.fillText(newNotes, {
            name: 'comments',
        });

        await this.clickButton('Save');

        await this._page.waitForTimeout(1000);
    }

    public async deleteNotes(note: { title: string; date: Date }) {
        await this.noteHelper.clickNoteTab();

        await this.noteHelper.clickEditIcon({
            title: note.title,
        });

        await this._page.getByRole('menuitem', { name: 'Delete' }).click();

        await this._page.waitForTimeout(1000);

        await this.clickButton('Yes');

        await this._page.waitForTimeout(1000);
    }

    public async checkExpense(expense_number: string) {
        await this._page.waitForTimeout(1000);

        const row = await this.findRowInTable(expense_number, 'EXPENSE NO.');

        await this.clickTextOnTable(row, 'EXPENSE NO.');

        await this._page.waitForTimeout(3000);
    }
}
