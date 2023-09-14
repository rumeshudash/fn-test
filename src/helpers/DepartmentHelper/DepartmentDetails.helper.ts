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

    public async openAndVerifyActionButton() {
        await this._page.getByRole('button', { name: 'Actions' }).click();
        const dropdownItems = this._page.locator('//div[@role="menu"]');
        await expect(dropdownItems).toContainText('Employee Add');
        await expect(dropdownItems).toContainText('Add Notes');
        await expect(dropdownItems).toContainText('Add Documents');
    }

    public async openForm(option: string) {
        await this._page.getByRole('button', { name: 'Actions' }).click();
        await this._page
            .locator("//div[@role='menuitem']")
            .getByText(option)
            .click();
    }

    public async addEmployee(data: EmployeeCreationData) {
        this.detailsHelper.openActionButtonItem('Employee Add');
        await this._page.waitForSelector(
            "//div[contains(text(), 'Select Designation')]"
        );
        await this.fillInput(data.name, { name: 'name' });
        await this.fillInput(data.email, { name: 'email' });
        await this.fillInput(data.identifier, { name: 'identifier' });
        await this.selectOption({
            option: data.manager,
            name: 'manager_id',
        });
        await this.selectOption({
            option: data.designation,
            name: 'designation_id',
        });
        await this.clickButton('Save');
        await this._page.waitForTimeout(1000);
    }

    public async verifyEmployeeAddition(data: EmployeeCreationData) {
        const addedEmployeeRow = await this.listingHelper.findRowInTable(
            data.identifier,
            'IDENTIFIER'
        );

        Object.keys(data).forEach(async (key) => {
            if (key === 'manager') return;
            const value = data[key];
            const cell = await this.listingHelper.getCellText(
                addedEmployeeRow,
                key.toUpperCase()
            );
            expect(cell).toBe(value);
        });
    }

    public async addDocument(document: { comment: string; imagePath: string }) {
        await this.detailsHelper.openActionButtonItem('Add Documents');
        await this.documentHelper.uploadDocument(true);
        await this.fillText(document.comment, { name: 'comments' });
        await this.clickButton('Save');
        await this._page.waitForTimeout(1000);
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

    public async addNotes(note: { title: string; date: Date }) {
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

    public async verifyNoteAddition(note: { title: string; date: Date }) {
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
}
