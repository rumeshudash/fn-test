import { expect } from '@playwright/test';
import chalk from 'chalk';
import { formatDate } from '@/utils/common.utils';
import { DepartmentCreation } from './DepartmentCreation.helper';

export class DepartmentDetails extends DepartmentCreation {
    public async openEditForm() {
        const container = this._page.locator(
            `//div[contains(@class,'breadcrumbs')]/ancestor::div[contains(@class,"justify-between")]`
        );
        await container.locator('button').first().click();
    }

    public async verifyEmployeeAddition(data: EmployeeCreationData) {
        const addedEmployeeRow = await this.listingHelper.findRowInTable(
            data.identifier,
            'IDENTIFIER'
        );
        await expect(addedEmployeeRow, {
            message: 'Checking employee row visibility',
        }).toBeVisible();
        await this.listingHelper.validateRow(addedEmployeeRow, data);
    }

    public async addDocument(document: { comment: string; imagePath: string }) {
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
    }

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

    public async verifyNoteAddition(note: { comments: string; date: Date }) {
        await this.tabHelper.clickTab('Notes');
        const notesTab = this._page.locator("//div[@role='tabpanel']").nth(2);
        const notesRow = notesTab.locator('div.flex.gap-4').filter({
            hasText: note.comments,
        });
        expect(notesRow, {
            message: `Checking note row visibility`,
        }).toBeVisible();
        const formattedDate = formatDate(note.date);
        const noteDate = notesRow.getByText(formattedDate);
        expect(noteDate, {
            message: `Checking note date visibility`,
        }).toBeVisible();
    }
}
