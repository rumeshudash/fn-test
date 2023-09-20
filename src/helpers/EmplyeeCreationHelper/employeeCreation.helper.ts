import { expect } from '@playwright/test';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import chalk from 'chalk';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { BaseHelper } from '../BaseHelper/base.helper';
import { FileHelper } from '../BaseHelper/file.helper';

// export class EmployeeCreation extends BaseHelper {
//     public form: FormHelper;
//     public notification: NotificationHelper;
//     public breadCrumb: BreadCrumbHelper;
//     public tab: TabHelper;
//     public dialog: DialogHelper;
//     public listing: ListingHelper;
//     public file: FileHelper;

//     constructor(page: any) {
//         super(page);
//         this.notification = new NotificationHelper(page);
//         this.form = new FormHelper(page);
//         this.breadCrumb = new BreadCrumbHelper(page);
//         this.tab = new TabHelper(page);
//         this.dialog = new DialogHelper(page);
//         this.listing = new ListingHelper(page);
//         this.file = new FileHelper(page);
//     }

// }

export class EmployeeCreation extends BaseHelper {
    public employeeInfo;
    public form: FormHelper;
    public notification: NotificationHelper;
    public breadCrumb: BreadCrumbHelper;
    public tab: TabHelper;
    public dialog: DialogHelper;
    public listing: ListingHelper;
    public file: FileHelper;

    public employeeCreationSchema = {
        name: {
            type: 'text',
            required: true,
        },
        email: {
            type: 'text',
            required: true,
        },
        identifier: {
            type: 'text',
            required: true,
        },
        department_id: {
            type: 'reference_select',
        },
        designation_id: {
            type: 'reference_select',
        },
        grade_id: {
            type: 'reference_select',
        },
        manager_id: {
            type: 'reference_select',
        },
        approval_manager_id: {
            type: 'reference_select',
        },
    };

    constructor(employeeInfo, page: any) {
        super(page);
        this.employeeInfo = employeeInfo;
        this.notification = new NotificationHelper(page);
        this.form = new FormHelper(page);
        this.breadCrumb = new BreadCrumbHelper(page);
        this.tab = new TabHelper(page);
        this.dialog = new DialogHelper(page);
        this.listing = new ListingHelper(page);
        this.file = new FileHelper(page);
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
        const row = await this.listing.findRowInTable(title, columnName);
        const clickCell = (await this.listing.getCell(row, columnName)).locator(
            'a'
        );
        await clickCell.click();
        await this._page.waitForTimeout(2000);
    }

    public async employeeRowLocator() {
        const row = await this.listing.findRowInTable(
            this.employeeInfo.identifier,
            'EMPLOYEE CODE'
        );
        return row;
    }

    public async getEmployeeCode() {
        const parentRow = await this.employeeRowLocator();
        const cellCode = await this.listing.getCell(parentRow, 'EMPLOYEE CODE');
        return cellCode;
    }

    public async getEmployeeName() {
        const parentRow = await this.employeeRowLocator();
        const cellName = await this.listing.getCell(parentRow, 'NAME');
        return cellName;
    }

    public async getEmployeeEmail() {
        const parentRow = await this.employeeRowLocator();
        const cellEmail = await this.listing.getCell(parentRow, 'EMAIL');
        return cellEmail;
    }

    public async getEmployeeStatus() {
        const parentRow = await this.employeeRowLocator();
        const cellStatus = (
            await this.listing.getCell(parentRow, 'STATUS')
        ).innerText();
        return cellStatus;
    }

    public async getEmployeeDepartment() {
        const parentRow = await this.employeeRowLocator();
        const cellDepartment = await this.listing.getCell(
            parentRow,
            'DEPARTMENT'
        );
        return cellDepartment;
    }

    public async getEmployeeDesignation() {
        const parentRow = await this.employeeRowLocator();
        const cellDesignation = await this.listing.getCell(
            parentRow,
            'DESIGNATION'
        );
        return cellDesignation;
    }

    public async getEmployeeGrade() {
        const parentRow = await this.employeeRowLocator();
        const cellGrade = await this.listing.getCell(parentRow, 'GRADE');
        return cellGrade;
    }

    public async getEmployeeReportingManager() {
        const parentRow = await this.employeeRowLocator();
        const cellReportingManager = await this.listing.getCell(
            parentRow,
            'REPORTING MANAGER'
        );
        return cellReportingManager;
    }

    public async getEmployeeApprovalManager() {
        const parentRow = await this.employeeRowLocator();
        const cellApprovalManager = await this.listing.getCell(
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

        const checkEmployeeDetailsMatch = async () => {
            if (this.employeeInfo.identifier)
                await expect(employee_code).toHaveText(
                    this.employeeInfo.identifier
                );

            if (this.employeeInfo.name)
                await expect(employee_name).toHaveText(this.employeeInfo.name);

            if (this.employeeInfo.email)
                await expect(employee_email).toHaveText(
                    this.employeeInfo.email
                );

            if (this.employeeInfo.email)
                await expect(employee_email).toHaveText(
                    this.employeeInfo.email
                );

            if (this.employeeInfo.department_id)
                await expect(employee_department).toHaveText(
                    this.employeeInfo.department_id
                );

            if (this.employeeInfo.designation_id)
                await expect(employee_designation).toHaveText(
                    this.employeeInfo.designation_id
                );

            if (this.employeeInfo.grade_id)
                await expect(employee_grade).toHaveText(
                    this.employeeInfo.grade_id
                );

            if (this.employeeInfo.manager_id)
                await expect(employee_reporting_manager).toHaveText(
                    this.employeeInfo.manager_id
                );

            if (this.employeeInfo.approval_manager_id)
                await expect(employee_approval_manager).toHaveText(
                    this.employeeInfo.approval_manager_id
                );
        };
        await checkEmployeeDetailsMatch();
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
