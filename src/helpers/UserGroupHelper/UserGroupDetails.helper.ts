import { UserCreation } from './UserGroup.helper';
import { Page, expect } from '@playwright/test';
import chalk from 'chalk';
import { formatDate } from '@/utils/common.utils';
import { FileHelper } from '../BaseHelper/file.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { TabHelper } from '../BaseHelper/tab.helper';

export class UserDetails extends UserCreation {
    public fileHelper: FileHelper;
    public detailsHelper: DetailsPageHelper;
    public documentHelper: DocumentHelper;
    public dialogHelper: DialogHelper;
    public tabHelper: TabHelper;

    constructor(page: Page) {
        super(page);
        this.fileHelper = new FileHelper(page);
        this.detailsHelper = new DetailsPageHelper(page);
        this.documentHelper = new DocumentHelper(page);
        this.dialogHelper = new DialogHelper(page);
        this.tabHelper = new TabHelper(page);
    }

    public async addMember(data: UserGroupData) {
        await this.detailsHelper.openActionButtonItem('Add Member');
        await this._page.waitForSelector("//span[contains(text(), 'Member')]");

        await this.selectOption({
            option: data.memberEmail,
            name: 'user_id',
        });
        await this.clickButton('Save');
    }

    public async verifyMemberAddition(data: UserGroupData): Promise<void> {
        const addedMember = await this.listHelper.findRowInTable(
            data.member,
            'NAME'
        );

        expect(addedMember).not.toBeNull();

        const memberCell = await this.listHelper.getCell(addedMember, 'NAME');
        await expect(memberCell).toContainText(data.member);
    }

    public async addDocument(document): Promise<void> {
        await this.detailsHelper.openActionButtonItem('Add Documents');
        await this.documentHelper.uploadDocument(true);
        await this.fillText(document.comment, { name: 'comments' });
        await this.clickButton('Save');
    }

    public async verifyDocumentAddition(document: {
        comment: string;
        date: Date;
    }): Promise<void> {
        await this.tabHelper.clickTab('Documents');
        await this.documentHelper.toggleDocumentView('Table View');
        await this.documentHelper.checkDocument(
            document.comment,
            document.date
        );
    }

    public async addNotes(
        note: { title: string; date: Date },
        open: boolean
    ): Promise<void> {
        if (!open) {
            await this.detailsHelper.openActionButtonItem('Add Notes');
        }

        if (note.title) {
            await this.fillText(note.title, { name: 'comments' });
        }
        await this.clickButton('Save');
        if (!note.title) {
            console.log(
                chalk.blue('Checking error message and button disabled')
            );
            const error = this._page.locator('span.label.text-error').first();
            expect(await error.textContent(), {
                message: 'Checking error message',
            }).toBe('Notes is required');
            await expect(this._page.locator('//button[text()="Save"]'), {
                message: 'Checking save button visibility',
            }).toBeDisabled();
            console.log(
                chalk.green('Error message verified and button disabled')
            );
        }
    }

    public async verifyNoteAddition(note: {
        title: string;
        date: Date;
    }): Promise<void> {
        await this.tabHelper.clickTab('Notes');
        const notesTab = this._page.locator("//div[@role='tabpanel']").nth(2);
        const notesRow = notesTab.locator('div.flex.gap-4').filter({
            hasText: note.title,
        });
        expect(notesRow).not.toBeNull();
        const formattedDate = formatDate(note.date, true);
        const noteDate = notesRow.getByText(formattedDate);
        expect(noteDate).not.toBeNull();
    }

    public async addRole(data: UserGroupData): Promise<void> {
        await this.detailsHelper.openActionButtonItem('Add Group Role');
        await this._page.waitForSelector("//span[contains(text(), 'Role')]");
        await this.selectOption({
            option: data.role,
            name: 'role_id',
        });
        await this.clickButton('Save');
    }

    public async deleteRole(data: UserGroupData) {
        await this.tabHelper.clickTab('Roles');
        const addedRole = await this.listHelper.findRowInTable(
            data.role,
            'NAME'
        );
        await addedRole.locator('svg').first().click();
        await this._page
            .locator("//div[@role='dialog']")
            .locator('button')
            .getByText('Yes!')
            .click();
    }

    public async verifyRoleAddition(data: UserGroupData) {
        await this.tabHelper.clickTab('Roles');
        const addedRole = await this.listHelper.findRowInTable(
            data.role,
            'NAME'
        );
        expect(addedRole).not.toBeNull();
    }

    public async verifyRoleDeletion(data: UserGroupData) {
        await this.tabHelper.clickTab('Roles');
        const deletedRole = await this.listHelper.findRowInTable(
            data.role,
            'NAME'
        );
        await expect(deletedRole).not.toBeVisible();
    }
}
