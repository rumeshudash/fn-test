import { expect } from '@playwright/test';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { bankAccountInfo, employeeInfo } from '@/utils/required_data';
import { FormHelper } from '../BaseHelper/form.helper';
import chalk from 'chalk';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { ObjectDto } from '@/types/common.types';

// const employeeCreationInfo = {
//     name: 'Admin Create6',
//     email: 'employeecreation6@test.com',
//     status: 'Active',
//     identifier: 'EC06',
//     department_id: 'Test',
//     designation_id: 'Admin Accountant',
//     grade_id: 'E3',
//     manager_id: 'Amit Raj',
//     approval_manager_id: 'Ravi',
//     notes: 'again with incorrect format',
// };
export class EmployeeCreation extends ListingHelper {
    public formHelper: FormHelper;
    public notification: NotificationHelper;
    public breadCrumb: BreadCrumbHelper;
    constructor(page: any) {
        super(page);
        this.notification = new NotificationHelper(page);
        this.formHelper = new FormHelper(page);
        this.breadCrumb = new BreadCrumbHelper(page);
    }

    public async init() {
        await this.navigateTo('EMPLOYEE_CREATION');
    }
    public async clickAddIcon() {
        await this._page
            .locator(
                "//div[contains(@class,'flex-wrap justify-end')]//button[1]"
            )
            .click();
    }
    public async clickEmployeeInfo(title: string, columnName: string) {
        const row = await this.findRowInTable(title, columnName);
        const clickCell = (await this.getCell(row, columnName)).locator('a');
        await clickCell.click();
        await this._page.waitForTimeout(2000);
    }
}

export class AddEmployeeCreation extends EmployeeCreation {
    public employeeInfo;
    constructor(employeeInfo, page: any) {
        super(page);
        this.employeeInfo = employeeInfo;
    }
    public async employeeRowLocator() {
        const row = await this.findRowInTable(
            this.employeeInfo.identifier,
            'EMPLOYEE CODE'
        );
        return row;
    }

    public async getEmployeeCode() {
        const parentRow = await this.employeeRowLocator();
        const cellCode = await this.getCell(parentRow, 'EMPLOYEE CODE');
        return cellCode;
    }

    public async getEmployeeName() {
        const parentRow = await this.employeeRowLocator();
        const cellName = await this.getCell(parentRow, 'NAME');
        return cellName;
    }

    public async getEmployeeEmail() {
        const parentRow = await this.employeeRowLocator();
        const cellEmail = await this.getCell(parentRow, 'EMAIL');
        return cellEmail;
    }

    public async getEmployeeStatus() {
        const parentRow = await this.employeeRowLocator();
        const cellStatus = (
            await this.getCell(parentRow, 'STATUS')
        ).innerText();
        return cellStatus;
    }

    public async getEmployeeDepartment() {
        const parentRow = await this.employeeRowLocator();
        const cellDepartment = await this.getCell(parentRow, 'DEPARTMENT');
        return cellDepartment;
    }

    public async getEmployeeDesignation() {
        const parentRow = await this.employeeRowLocator();
        const cellDesignation = await this.getCell(parentRow, 'DESIGNATION');
        return cellDesignation;
    }

    public async getEmployeeGrade() {
        const parentRow = await this.employeeRowLocator();
        const cellGrade = await this.getCell(parentRow, 'GRADE');
        return cellGrade;
    }

    public async getEmployeeReportingManager() {
        const parentRow = await this.employeeRowLocator();
        const cellReportingManager = await this.getCell(
            parentRow,
            'REPORTING MANAGER'
        );
        return cellReportingManager;
    }

    public async getEmployeeApprovalManager() {
        const parentRow = await this.employeeRowLocator();
        const cellApprovalManager = await this.getCell(
            parentRow,
            'APPROVAL MANAGER'
        );
        return cellApprovalManager;
    }

    public async verifyEmployeeDetails() {
        const employee_code = await this.getEmployeeCode();
        const employee_name = await this.getEmployeeName();
        const employee_email = await this.getEmployeeEmail();
        const employee_department = await this.getEmployeeDepartment();
        const employee_designation = await this.getEmployeeDesignation();
        const employee_grade = await this.getEmployeeGrade();
        const employee_reporting_manager =
            await this.getEmployeeReportingManager();
        const employee_approval_manager =
            await this.getEmployeeApprovalManager();

        // async function checkEmployeeDetailsMatch() {
        console.log(this.employeeInfo);
        if (this.employeeInfo.identifier)
            await expect(employee_code).toHaveText(
                this.employeeInfo.identifier
            );

        if (this.employeeInfo.name)
            await expect(employee_name).toHaveText(this.employeeInfo.name);

        if (this.employeeInfo.email)
            await expect(employee_email).toHaveText(this.employeeInfo.email);

        if (this.employeeInfo.email)
            await expect(employee_email).toHaveText(this.employeeInfo.email);

        if (this.employeeInfo.department_id)
            await expect(employee_department).toHaveText(
                this.employeeInfo.department_id
            );

        if (this.employeeInfo.designation_id)
            await expect(employee_designation).toHaveText(
                this.employeeInfo.designation_id
            );

        if (this.employeeInfo.grade_id)
            await expect(employee_grade).toHaveText(this.employeeInfo.grade_id);

        if (this.employeeInfo.manager_id)
            await expect(employee_reporting_manager).toHaveText(
                this.employeeInfo.manager_id
            );

        if (this.employeeInfo.approval_manager_id)
            await expect(employee_approval_manager).toHaveText(
                this.employeeInfo.approval_manager_id
            );
        // }
        // await checkEmployeeDetailsMatch();
    }

    public async checkEmployeeCodeLink() {
        const employee_code = await this.getEmployeeCode();
        const code = await employee_code.innerText();
        await employee_code.locator('//a').click();

        const code_locator = await this.locate(
            '//div[@data-title="detail_subtitle"]'
        )._locator.innerText();
        expect(code_locator).toContain(code);
    }
    public async checkEmployeeNameLink() {
        const employee_name = await this.getEmployeeName();
        const name = await employee_name.innerText();
        await employee_name.locator('//a').click();

        const name_locator = await this.locate(
            '//div[@data-title="detail_subtitle"]'
        )._locator.innerText();
        expect(name_locator).toContain(name);
    }
    public async checkEmployeeEmailLink() {
        const employee_email = await this.getEmployeeEmail();
        const email = await employee_email.innerText();
        await employee_email.locator('//a').click();
        const email_locator = await this.locate('span', {
            id: 'has-Email',
        })._locator.innerText();
        expect(email_locator).toContain(email);
    }

    public async checkEmployeeDepartmentLink() {
        const employee_department = await this.getEmployeeDepartment();
        const department = await employee_department.innerText();
        await employee_department.locator('//a').click();

        const department_locator = await this.locate(
            '//div[@data-title="detail_subtitle"]'
        )._locator.innerText();

        expect(department_locator).toContain(department);
    }

    public async checkEmployeeDesignationLink() {
        const employee_designation = await this.getEmployeeDesignation();
        const designation = await employee_designation.innerText();
        await employee_designation.locator('//a').click();

        const designation_locator = await this.locate(
            '//div[@data-title="detail_subtitle"]'
        )._locator.innerText();

        expect(designation_locator).toContain(designation);
    }

    public async checkReportingManagerLink() {
        const employee_reporting_manager =
            await this.getEmployeeReportingManager();
        const reporting_manager = await employee_reporting_manager.innerText();
        await employee_reporting_manager.locator('//a').click();

        const reporting_manager_locator = await this.locate(
            '//div[@data-title="detail_subtitle"] //h3'
        )._locator.innerText();
        expect(reporting_manager_locator).toContain(reporting_manager);
    }

    public async checkApprovalManagerLink() {
        const employee_approval_manager =
            await this.getEmployeeApprovalManager();
        const approval_manager = await employee_approval_manager.innerText();
        await employee_approval_manager.locator('//a').click();

        const approval_mananger_locator = await this.locate(
            '//div[@data-title="detail_subtitle"] //h3'
        )._locator.innerText();

        expect(approval_mananger_locator).toContain(approval_manager);
    }

    public async clickActionOption(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;
        await optionContainer.getByRole('menuitem', { name: options }).click();
    }
}

export class EmployeeDetailsPage extends EmployeeCreation {
    public employeeCreationInfo;
    constructor(employeeCreationInfo, page: any) {
        super(page);
        this.employeeCreationInfo = employeeCreationInfo;
    }
    public async parentEmployeeDetails() {
        return this.locate('//div[contains(@class,"h-full overflow-hidden")]')
            ._locator;
    }

    public async checkEmployeeName() {
        const parentHelper = await this.parentEmployeeDetails();
        const locateName = parentHelper.filter({
            hasText: this.employeeCreationInfo.name,
        });

        await expect(locateName).toBeVisible();
    }

    public async checkEmployeeCode() {
        const parentHelper = await this.parentEmployeeDetails();
        const locateCode = parentHelper.locator(
            "//div[@class='text-sm text-base-secondary']"
        );
        expect(await locateCode.innerText()).toBe(
            this.employeeCreationInfo.identifier
        );
    }

    public async checkEmployeeDetails(locator: string, text: string) {
        const parentHelper = await this.parentEmployeeDetails();
        const isVisible = await parentHelper.locator(locator).innerText();
        expect(isVisible).toBe(text);
    }

    public async clickEditIcon() {
        await this._page.locator("//button[@data-title='Edit']").click();
    }
    public async checkBankInfo() {
        const row = await this.findRowInTable(
            bankAccountInfo.ifsc_code,
            'IFSC CODE'
        );
        expect(await row.isVisible(), 'Check row of IFSC Code').toBe(true);
    }
    public async setRole(title: string) {
        const role = this.locate(
            `//div[text()='${title}']/parent::div/parent::div`
        )._locator;

        await role.locator('//input').click();
    }

    public async addNotes(notes: string) {
        await this.fillText(notes, {
            selector: 'textarea',
        });
    }

    public async checkNotes(notes: string) {
        const notesParentLocator = this.locate(
            `//div[text()='${notes}']/parent::div/parent::div`
        )._locator.first();

        expect(
            await notesParentLocator.isVisible(),
            chalk.red('Checking Notes visibility')
        ).toBe(true);
        const user = notesParentLocator.locator('//p[1]');
        const date_time = notesParentLocator.locator('//p[2]');

        await expect(user).toBeVisible();
        await expect(date_time).toBeVisible();
    }

    public async checkInviteUserEmail() {
        const email = this.locate(
            `(//span[text()='${this.employeeCreationInfo.email}'])[2]`
        )._locator;
        await expect(
            email,
            chalk.red(`${this.employeeCreationInfo.email} Visibility check`)
        ).toBeVisible();
    }
    public async checkDocumentName(name: string | number) {
        const documentNameContainer = this.locate(
            "//div[contains(@class,'absolute left-0')]"
        )._locator;
        const documentName = documentNameContainer.locator(
            `//div[text()='${name}']`
        );
        await expect(
            documentName,
            chalk.red(`Document ${name} Visibility`)
        ).toBeVisible();
    }
}
