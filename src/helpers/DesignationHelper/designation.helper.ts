import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { IMAGE_NAME } from '@/utils/required_data';
import { EmployeeCreation } from '../EmplyeeCreationHelper/employeeCreation.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';

export class DesignationHelper extends BaseHelper {
    public designationInfo;
    public notification: NotificationHelper;
    constructor(designationInfo, page) {
        super(page);
        this.designationInfo = designationInfo;
        this.notification = new NotificationHelper(page);
    }
    async init() {
        await this.navigateTo('DESIGNATIONS');
    }

    async verifyDialog() {
        expect(
            this._page.getByRole('dialog'),
            chalk.red('dialog visibility')
        ).toBeVisible();
    }

    async verifyNameField() {
        await this._page.waitForTimeout(1000);
        const name_field = this.locate('input', { name: 'name' })._locator;
        expect(
            await name_field.isVisible(),
            chalk.red('Name field visibility')
        ).toBe(true);
    }
    async fillNameField() {
        await this.verifyNameField();
        await this.fillText(this.designationInfo.name, { name: 'name' });
    }

    async searchDesignation() {
        await this.fillText(this.designationInfo.name, {
            placeholder: 'Search ( min: 3 characters )',
        });
        await this._page.waitForTimeout(2000);
    }

    async parentTable() {
        return this.locate(
            `//a[text()="${this.designationInfo.name}"]/parent::div/parent::div`,
            { exactText: true }
        )._locator;
    }

    async verifyItemInList() {
        const parentTableLocator = await this.parentTable();
        const designation_name = parentTableLocator.locator('//a');

        const designation_status = parentTableLocator
            .locator('//button', {
                hasText: 'Active',
            })
            .first();

        const designation_date = parentTableLocator
            .locator(
                '//div[@class="table-cell align-middle"]/following-sibling::div'
            )
            .first();
        const itemAction = parentTableLocator
            .locator(
                '//div[contains(@class,"icon-container transition-all")]//div'
            )
            .first();

        await expect(
            designation_name,
            chalk.red('Designation Name visibility')
        ).toBeVisible();

        await expect(
            designation_status,
            chalk.red('Designation Status visibility')
        ).toBeVisible();

        await expect(
            designation_date,
            chalk.red('Designation date visibility')
        ).toBeVisible();

        await expect(
            itemAction,
            chalk.red('Designation action visibility')
        ).toBeVisible();
    }

    async verifyDesignationPage() {
        await expect(
            this._page.locator("(//p[text()='Designation Detail'])[1]"),
            chalk.red('Designation page visibility')
        ).toBeVisible();
        const designationListItem = this._page.locator(
            '//div[contains(@class,"text-base font-semibold")]'
        );
        expect(
            await designationListItem.textContent(),
            chalk.red('Designation Name match')
        ).toBe(this.designationInfo.name);

        const identifier = this.locate('span', {
            id: 'has-Identifier',
        })._locator;
        await expect(
            identifier,
            chalk.red('Identifier visibility')
        ).toBeVisible();
    }

    async clickDesignationName() {
        await this.verifyItemInList();
        const parentTableLocator = await this.parentTable();
        const designationList = parentTableLocator.locator('//a');

        await designationList.click();
        await this._page.waitForTimeout(1000);
    }

    async changeTab(tabName: string) {
        await this._page
            .getByRole('tab', { name: tabName, exact: true })
            .click();

        await this._page.waitForTimeout(2000);
    }

    async clickAction() {
        const itemAction = this.locate(
            '(//div[contains(@class,"icon-container transition-all")]//div)[1]'
        );
        await itemAction.click();
    }
}

export class CreateDesignationHelper extends BaseHelper {
    public designationInfo;
    constructor(designationInfo, page) {
        super(page);
        this.designationInfo = designationInfo;
    }
    async addDesignation() {
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();
    }

    async changeStatus(status: string) {
        const itemStatus = this._page
            .getByRole('button', {
                name: status,
            })
            .first();

        expect(
            await itemStatus.isVisible(),
            chalk.red('Designation button in list visibility')
        ).toBe(true);
        if (await itemStatus.isVisible()) await itemStatus.click();
        await this.verifyChangeStatus(status);
    }
    async verifyChangeStatus(status: string) {
        const itemStatus = this._page
            .getByRole('button', {
                name: status,
            })
            .first();
        expect(
            await itemStatus.isVisible(),
            chalk.red('Designation status visibility')
        );
    }
}

export class DesignationDetailsPageHelper extends BaseHelper {
    public employeeInfo;
    constructor(employeeInfo, page) {
        super(page);
        this.employeeInfo = employeeInfo;
    }

    async optionsParentLocator() {
        return this._page.locator(
            '//div[contains(@class,"breadcrumbs")]/parent::div'
        );
    }
    async verifyOptions() {
        const parentLocator = await this.optionsParentLocator();
        await expect(
            parentLocator.locator('.breadcrumbs'),
            chalk.red('breadcrumbs visibility')
        ).toBeVisible();

        const editIconButton = parentLocator.locator('//button[1]');
        await expect(
            editIconButton,
            chalk.red('Action button visibility')
        ).toBeVisible();

        const actionButton = parentLocator.locator(
            '//button[text()="Actions"]'
        );
        await expect(
            actionButton,
            chalk.red('Action Button Visibility')
        ).toBeVisible();
    }

    async clickEditIcon() {
        const parentLocator = await this.optionsParentLocator();
        const edit_button = parentLocator.locator('//button[1]');
        if (await edit_button.isVisible()) await edit_button.click();
    }

    async clickActionButton() {
        const parentLocator = await this.optionsParentLocator();
        const actionButton = parentLocator.locator(
            '//button[text()="Actions"]'
        );
        await actionButton.click();
    }

    async verifyActionOptions(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;

        const verifyOption = optionContainer.getByRole('menuitem', {
            name: options,
        });
        await expect(verifyOption, `${options} visibility`).toBeVisible();
    }

    async clickActionOption(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;
        await optionContainer.getByRole('menuitem', { name: options }).click();
    }

    // async verifyAddEmployeeForm(fieldName) {
    //     await this._page.waitForTimeout(2000);
    //     const parentLocator = this._page.locator(
    //         `//div[@role="dialog"]//span[text()="${fieldName}"]/parent::label/parent::div`
    //     );
    //     await expect(
    //         parentLocator,
    //         chalk.red(`Dialog ${fieldName} visibility`)
    //     ).toBeVisible();
    // }

    // async fillEmployeeForm() {
    //     await this.fillText(this.employeeInfo.name, {
    //         name: 'name',
    //     });
    //     await this.fillText(this.employeeInfo.email, {
    //         name: 'email',
    //     });
    //     await this.fillText(this.employeeInfo.employee_code, {
    //         name: 'identifier',
    //     });
    //     await this.selectOption({
    //         input: this.employeeInfo.department,
    //         placeholder: 'Select  Department',
    //     });
    //     await this.selectOption({
    //         input: this.employeeInfo.grade,
    //         placeholder: 'Select Grade',
    //     });
    //     await this.selectOption({
    //         input: this.employeeInfo.reporting_manager,
    //         placeholder: 'Select Manager',
    //         exact: true,
    //     });
    //     // await this.selectOption({
    //     //     input: this.employeeInfo.approval_mananger,
    //     //     placeholder: 'Select approval Manager',
    //     //     exact: true,
    //     // });
    // }

    async verifyEmployeeTabDetails() {
        // await this.click({ role: 'button', text: 'Employee' });
        await this.locate('//button[text()="Employee"]')._locator.click();
        const parentHelper = this.locate(
            `//a[text()="${this.employeeInfo.employee_code}"]/parent::div/parent::div`
        )._locator;

        const employee_name = parentHelper.locator(
            `//p[text()="${this.employeeInfo.name}"]`
        );
        const employee_email = parentHelper.locator(
            `//p[text()="${this.employeeInfo.email}"]`
        );
        const employee_department = parentHelper.locator(
            `//a[text()="${this.employeeInfo.department}"]`
        );

        await expect(
            employee_name,
            chalk.red('Employee Name match check')
        ).toBeVisible();
        await expect(
            employee_email,
            chalk.red('Employee Email match check')
        ).toBeVisible();
        await expect(
            employee_department,
            chalk.red('Employee Department match check')
        ).toBeVisible();
    }

    async addNotes() {
        await this.fillText(this.employeeInfo.notes, { id: 'comments' });
    }

    async verifyNotesTabDetails() {
        // await this.click({ role: 'button', text: 'Notes' });
        await this.locate('//button[text()="Notes"]')._locator.click();
        const parentHelper = this.locate(
            `//div[text()="${this.employeeInfo.notes}"]/parent::div/parent::div`
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

    async uploadDocuments() {
        await this._page.setInputFiles(
            "//input[@type='file']",
            `./images/${this.employeeInfo.IMAGE_NAME}`
        );
        await this.fillText(this.employeeInfo.comments, { id: 'comments' });

        await this.click({ role: 'button', text: 'Save' });
        await this.click({ role: 'button', text: 'Save' });
    }

    async verifyDocumentsTabDetails() {
        // await this.click({ role: 'button', text: 'Documents' });
        await this.locate('//button[text()="Documents"]')._locator.click();
        const parentHelper = this.locate(
            '//div[text()="Documents"]/parent::div/parent::div'
        )._locator;

        const imageName = parentHelper.locator(
            `//div[text()="${this.employeeInfo.IMAGE_NAME}"]`
        );

        await expect(
            imageName,
            chalk.red('Image Name check visibility')
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
