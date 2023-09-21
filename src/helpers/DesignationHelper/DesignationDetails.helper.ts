import chalk from 'chalk';
import { expect } from '@playwright/test';
import { DesignationHelper } from './DesignationCreation.helper';
import { FileHelper } from '../BaseHelper/file.helper';

export class DesignationDetailsPageHelper extends DesignationHelper {
    public employeeInfo;
    public file: FileHelper;

    constructor(employeeInfo, page: any) {
        super(page);
        this.employeeInfo = employeeInfo;
        this.file = new FileHelper(page);
    }

    public async optionsParentLocator() {
        return this._page.locator(
            '//div[contains(@class,"breadcrumbs")]/parent::div'
        );
    }

    public async verifyEdit() {
        const editButton = await this.locate(
            "//button[@data-title='Edit']"
        )._locator.isVisible();

        expect(editButton, chalk.red('Edit Button check')).toBe(true);
    }

    public async verifyAction() {
        const actionButton = await this.locate(
            "//button[text()='Actions']"
        )._locator.isVisible();

        expect(actionButton, chalk.red('Action Button check')).toBe(true);
    }

    public async clickEditIcon() {
        const parentLocator = await this.optionsParentLocator();
        const edit_button = parentLocator.locator('//button[1]');
        if (await edit_button.isVisible()) await edit_button.click();
    }

    private async _employeeTabParent(name: string) {
        const row = await this.listing.findRowInTable(name, 'IDENTIFIER');
        return row;
    }
    public async verifyEmployeeTab(name: string, columnName: string) {
        const parentRow = await this._employeeTabParent(name);
        const cell = await this.listing.getCell(parentRow, columnName);
        await expect(cell).toBeVisible();
    }

    public async addNotes() {
        await this.fillText(this.employeeInfo.notes, { id: 'comments' });
    }

    public async verifyNotesTabDetails(notes: string) {
        // await this.click({ role: 'button', text: 'Notes' });
        await this.locate('//button[text()="Notes"]')._locator.click();
        const parentHelper = this.locate(
            `//div[text()="${notes}"]/parent::div/parent::div`
        )._locator;
        const notes_authur = parentHelper.locator('//p[1]').first();
        const notes_added_date = parentHelper.locator('//p[2]').first();

        await expect(
            notes_authur,
            chalk.red('Notes Authur visibility')
        ).toBeVisible();

        await expect(
            notes_added_date,
            chalk.red('Notes Added Date visibility')
        ).toBeVisible();
    }

    public async verifyDocumentsTabDetails() {
        // await this.click({ role: 'button', text: 'Documents' });
        const parentHelper = this.locate(
            '//div[text()="Documents"]/parent::div/parent::div'
        )._locator;

        const imageName = parentHelper.locator(`//div[@data-title]`);

        await expect(
            imageName,
            chalk.red('Image Name visibility check')
        ).toBeVisible();
    }

    // async verifyEmployeeTab() {
    //     const parentIdentifierLocator = this._page.locator(
    //         `//a[text()="${this.employeeInfo.employee_code}"]/parent::div/parent::div`
    //     );

    //     const locateName = parentIdentifierLocator.locator('//p');
    //     const locateDepartment = parentIdentifierLocator.locator('');
    //     const locateEmail = parentIdentifierLocator.locator('');
    // }
}
