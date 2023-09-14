import { expect } from '@playwright/test';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { bankAccountInfo } from '@/utils/required_data';
import { FormHelper } from '../BaseHelper/form.helper';
import chalk from 'chalk';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';

const employeeCreationInfo = {
    name: 'Admin Create6',
    email: 'employeecreation6@test.com',
    status: 'Active',
    identifier: 'EC06',
    department_id: 'Test',
    designation_id: 'Admin Accountant',
    grade_id: 'E3',
    manager_id: 'Amit Raj',
    approval_manager_id: 'Ravi',
    notes: 'again with incorrect format',
};
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
    public async profile() {
        const profileLocator = this.locate(
            "(//div[@id='user-popover']//div)"
        )._locator.first();
        const myProfile = this.locate(
            '//p[text()="My Profile"]/parent::div'
        )._locator;
        await profileLocator.click();
        await myProfile.click();
        await this._page.waitForTimeout(2000);
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
    public async employeeCodeLocator() {
        const row = await this.findRowInTable(
            employeeCreationInfo.identifier,
            'EMPLOYEE CODE'
        );
        return row;
    }

    public async getEmployeeName() {
        const parentRow = await this.employeeCodeLocator();
        const cellName = await this.getCell(parentRow, 'NAME');
        return cellName;
    }

    public async getEmployeeEmail() {
        const parentRow = await this.employeeCodeLocator();
        const cellEmail = await this.getCell(parentRow, 'EMAIL');
        // return parentLocator.locator(
        //     `//a[text()="${employeeCreationInfo.email}"]`
        // );
        return cellEmail;
    }

    public async getEmployeeStatus() {
        const parentRow = await this.employeeCodeLocator();
        // return await parentLocator
        //     .locator(`(//div[@class='centralize'])`)
        //     .first()
        //     .innerText();
        const cellStatus = await this.getCell(parentRow, 'STATUS');
        return cellStatus;
    }

    public async getEmployeeDepartment() {
        const parentRow = await this.employeeCodeLocator();
        // return parentLocator.locator(
        //     `//a[text()="${employeeCreationInfo.department_id}"]`
        // );
        const cellDepartment = await this.getCell(parentRow, 'DEPARTMENT');
        return cellDepartment;
    }

    public async getEmployeeDesignation() {
        const parentRow = await this.employeeCodeLocator();
        // return parentLocator.locator(
        //     `//a[text()="${employeeCreationInfo.designation_id}"]`
        // );
        const cellDesignation = await this.getCell(parentRow, 'DESIGNATION');
        return cellDesignation;
    }

    public async getEmployeeGrade() {
        const parentRow = await this.employeeCodeLocator();
        // return parentLocator.locator(
        //     `//p[text()="${employeeCreationInfo.grade_id}"]`
        // );
        const cellGrade = await this.getCell(parentRow, 'GRADE');
        return cellGrade;
    }

    public async getEmployeeReportingManager() {
        const parentRow = await this.employeeCodeLocator();
        // return parentLocator
        //     .locator(`//a[text()="${employeeCreationInfo.manager_id}"]`)
        //     .first();
        const cellReportingManager = await this.getCell(
            parentRow,
            'REPORTING MANAGER'
        );
        return cellReportingManager;
    }

    public async getEmployeeApprovalManager() {
        const parentRow = await this.employeeCodeLocator();
        // return parentLocator
        //     .locator(
        //         `//a[text()="${employeeCreationInfo.approval_manager_id}"]`
        //     )
        //     .nth(1);
        const cellApprovalManager = await this.getCell(
            parentRow,
            'APPROVAL MANAGER'
        );
        return cellApprovalManager;
    }

    public async verifyEmployeeDetails() {
        const employee_name = await this.getEmployeeName();
        const employee_email = await this.getEmployeeEmail();
        const employee_department = await this.getEmployeeDepartment();
        const employee_designation = await this.getEmployeeDesignation();
        const employee_grade = await this.getEmployeeGrade();
        const employee_reporting_manager =
            await this.getEmployeeReportingManager();
        const employee_approval_manager =
            await this.getEmployeeApprovalManager();

        async function verifyVisibility() {
            if (employeeCreationInfo.name)
                await expect(employee_name).toBeVisible();
            if (employeeCreationInfo.email)
                await expect(employee_email).toBeVisible();
            await expect(employee_email).toBeVisible();
            if (employeeCreationInfo.department_id)
                await expect(employee_department).toBeVisible();
            if (employeeCreationInfo.designation_id)
                await expect(employee_designation).toBeVisible();
            if (employeeCreationInfo.grade_id)
                await expect(employee_grade).toBeVisible();
            if (employeeCreationInfo.manager_id)
                await expect(employee_reporting_manager).toBeVisible();
            if (employeeCreationInfo.approval_manager_id)
                await expect(employee_approval_manager).toBeVisible();
        }
        await verifyVisibility();
    }

    public async checkEmployeeCodeLink() {
        const employee_code = (await this.employeeCodeLocator())
            .locator('//a')
            .first();
        await employee_code.click();

        const code_locator = this.locate('div', {
            text: employeeCreationInfo.identifier,
        })._locator;
        await expect(code_locator).toBeVisible();
    }
    public async checkEmployeeNameLink() {
        const employee_name = await this.getEmployeeName();
        const name = await employee_name.innerText();
        await employee_name.click();

        const name_locator = this.locate('div', { text: name })._locator;
        await expect(name_locator).toBeVisible();
    }
    public async checkEmployeeEmailLink() {
        const employee_email = await this.getEmployeeEmail();
        await employee_email.click();
        const email_locator = this.locate('span', { id: 'has-Email' })._locator;
        await expect(email_locator).toBeVisible();
    }

    public async checkEmployeeDepartmentLink() {
        const employee_department = await this.getEmployeeDepartment();
        await employee_department.click();
        const department_locator = await this.locate(
            '//div[contains(@class,"text-base font-semibold")]'
        )._locator.innerText();

        expect(department_locator).toContain(
            employeeCreationInfo.department_id
        );
    }

    public async checkEmployeeDesignationLink() {
        const employee_designation = await this.getEmployeeDesignation();
        await employee_designation.click();

        const designation_locator = this.locate('div', {
            text: employeeCreationInfo.designation_id,
        })._locator;

        await expect(designation_locator).toBeVisible();
    }

    public async checkReportingManagerLink() {
        const employee_reporting_manager =
            await this.getEmployeeReportingManager();
        await employee_reporting_manager.click();

        const reporting_manager_locator = this.locate('div', {
            text: employeeCreationInfo.manager_id,
        })._locator;

        await expect(reporting_manager_locator).toBeVisible();
    }

    public async checkApprovalManagerLink() {
        const employee_approval_manager =
            await this.getEmployeeApprovalManager();
        await employee_approval_manager.click();

        const approval_mananger_locator = this.locate('div', {
            text: employeeCreationInfo.manager_id,
        })._locator;

        await expect(approval_mananger_locator).toBeVisible();
    }

    public async clickActionOption(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;
        await optionContainer.getByRole('menuitem', { name: options }).click();
    }
    // public async changeTab(tabName: string) {
    //     await this._page
    //         .getByRole('tab', { name: tabName, exact: true })
    //         .click();

    //     await this._page.waitForTimeout(2000);
    // }
}

export class EmployeeDetailsPage extends EmployeeCreation {
    public async parentEmployeeDetails() {
        return this.locate('//div[contains(@class,"h-full overflow-hidden")]')
            ._locator;
    }

    public async checkEmployeeName() {
        const parentHelper = await this.parentEmployeeDetails();
        const locateName = parentHelper.filter({
            hasText: employeeCreationInfo.name,
        });

        await expect(locateName).toBeVisible();
    }

    public async checkEmployeeCode() {
        const parentHelper = await this.parentEmployeeDetails();
        const locateCode = parentHelper.locator(
            "//div[@class='text-sm text-base-secondary']"
        );
        expect(await locateCode.innerText()).toBe(
            employeeCreationInfo.identifier
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
            `(//span[text()='${employeeCreationInfo.email}'])[2]`
        )._locator;
        await expect(
            email,
            chalk.red(`${employeeCreationInfo.email} Visibility check`)
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
