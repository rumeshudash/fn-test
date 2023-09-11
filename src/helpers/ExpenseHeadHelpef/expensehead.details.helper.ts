import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

import { NotesHelper } from '../BaseHelper/notes.helper';

import { formatDate } from '@/utils/common.utils';

export class ExpenseHeadDetailsHelper extends BaseHelper {
    public noteHelper: NotesHelper;
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }

    public async clickOnExpenseHead(name: string) {
        this._page.getByRole('tab', { name: 'All', exact: true }).click();

        this._page.waitForTimeout(1000);

        await this._page.getByText(name).click();

        this._page.waitForTimeout(2000);
    }

    public async clickOnManagerName(name: string) {
        await this._page.getByText(name).click();

        this._page.waitForTimeout(2000);
    }

    public async clickOnEditIcon() {
        await this._page.locator('.items-center > button').first().click();

        this._page.waitForTimeout(2000);
    }

    public async EditExpenseHead(
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
        this._page.getByRole('button', { name: 'Actions' }).click();
        this._page.waitForTimeout(1000);
    }

    public async clickOnTab(tabName: string) {
        await this._page
            .getByRole('tab', { name: `${tabName}`, exact: true })
            .click();

        this._page.waitForTimeout(2000);
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
        await this._page.getByRole('tab').getByText('Notes').click();
        const notesTab = this._page.locator("//div[@role='tabpanel']").nth(2);
        const notesRow = notesTab.locator('div.flex.gap-4').filter({
            hasText: note.title,
        });

        this._page.waitForTimeout(1000);

        await notesRow.click();

        const btnlocator = '//button';

        await notesRow.locator(btnlocator).click();

        // await this._page.getByText('Edit').click();

        await this._page.waitForTimeout(1000);
    }

    public async EditNotes(
        note: { title: string; date: Date },
        newNotes: string
    ) {
        await this.verifyNoteAddition({
            title: note.title,
            date: note.date,
        });
        await this._page.getByText('Edit').click();

        await this.fillText(newNotes, {
            name: 'comments',
        });

        await this.clickButton('Save');

        await this._page.waitForTimeout(1000);
    }
}
