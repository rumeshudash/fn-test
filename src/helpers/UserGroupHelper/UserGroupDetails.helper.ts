import { UserCreation } from './UserGroup.helper';
import { Page, expect } from '@playwright/test';
import chalk from 'chalk';
import { formatDate } from '@/utils/common.utils';
import { FileHelper } from '../BaseHelper/file.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { Logger } from '../BaseHelper/log.helper';

export class UserDetails extends UserCreation {
    public fileHelper: FileHelper;
    public detailsHelper: DetailsPageHelper;
    public documentHelper: DocumentHelper;
    public dialogHelper: DialogHelper;
    public tabHelper: TabHelper;
    public notificationHelper: NotificationHelper;

    constructor(page: Page) {
        super(page);
        this.fileHelper = new FileHelper(page);
        this.detailsHelper = new DetailsPageHelper(page);
        this.documentHelper = new DocumentHelper(page);
        this.dialogHelper = new DialogHelper(page);
        this.tabHelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);
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

    public async addDocument(document: { comment: string }): Promise<void> {
        const docSchema = {
            comments: {
                type: 'textarea',
                required: true,
            },
        };

        await this.detailsHelper.openActionButtonItem('Add Documents');
        await this.documentHelper.uploadDocument(true);
        await this.fillFormInputInformation(docSchema, {
            comments: document.comment,
        });
        await this.submitButton();
        await this._page.waitForTimeout(1000);
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

    public async verifyNoteAddition(note: {
        comments: string;
        date: Date;
    }): Promise<void> {
        await this.tabHelper.clickTab('Notes');
        const notesTab = this._page.locator("//div[@role='tabpanel']").nth(2);
        const notesRow = notesTab.locator('div.flex.gap-4').filter({
            hasText: note.comments,
        });
        expect(notesRow).not.toBeNull();
        const formattedDate = formatDate(note.date, true);
        const noteDate = notesRow.getByText(formattedDate);
        expect(noteDate).not.toBeNull();
    }

    public async deleteRole(data: UserGroupData) {
        await this.tabHelper.clickTab('Roles');
        const addedRole = await this.listHelper.findRowInTable(
            data.role_id,
            'NAME'
        );
        await addedRole.locator('svg').first().click();
        await this.dialogHelper.clickConfirmDialogAction('Yes!');
    }

    public async verifyRoleAddition(data: UserGroupData) {
        await this.tabHelper.clickTab('Roles');
        const addedRole = await this.listHelper.findRowInTable(
            data.role_id,
            'NAME'
        );
        await expect(addedRole).toBeVisible();
    }

    public async verifyRoleDeletion(data: UserGroupData) {
        await this.tabHelper.clickTab('Roles');
        const deletedRole = await this.listHelper.findRowInTable(
            data.role_id,
            'NAME'
        );
        await expect(deletedRole).not.toBeVisible();
    }
}
