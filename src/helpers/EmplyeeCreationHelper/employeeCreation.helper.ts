import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { addSeconds } from 'date-fns';
import { PageHelper } from '../BaseHelper/page.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { employeeCreationInfo } from '@/utils/required_data';

export class EmployeeCreation extends ListingHelper {
    constructor(page) {
        super(page);
    }

    async init() {
        await this.navigateTo('EMPLOYEE_CREATION');
    }
}

export class AddEmployeeCreation extends BaseHelper {
    // public employeeCreationInfo;
    constructor(page) {
        super(page);
        // this.employeeCreationInfo = employeeCreationInfo;
    }
    public async verifyAfterSaveAndCreate() {
        const name_field = await this.locate('input', {
            name: 'name',
        })._locator.inputValue();
        expect(name_field).toBe('');
    }

    async employeeCodeLocator() {
        return this.locate(
            `//a[text()="${employeeCreationInfo.employee_code}"]/parent::div/parent::div`
        )._locator.first();
    }

    async getEmployeeName() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator.locator(
            `//a[text()="${employeeCreationInfo.name}"]`
        );
    }

    async getEmployeeEmail() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator.locator(
            `//a[text()="${employeeCreationInfo.email}"]`
        );
    }

    async getEmployeeStatus() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator
            .locator(`(//div[@class='centralize'])`)
            .first()
            .innerText();
    }

    async getEmployeeDepartment() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator.locator(
            `//a[text()="${employeeCreationInfo.department}"]`
        );
    }

    async getEmployeeDesignation() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator.locator(
            `//a[text()="${employeeCreationInfo.designation}"]`
        );
    }

    async getEmployeeGrade() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator.locator(
            `//p[text()="${employeeCreationInfo.grade}"]`
        );
    }

    async getEmployeeReportingManager() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator
            .locator(`//a[text()="${employeeCreationInfo.reporting_manager}"]`)
            .first();
    }

    async getEmployeeApprovalManager() {
        const parentLocator = await this.employeeCodeLocator();
        return parentLocator
            .locator(`//a[text()="${employeeCreationInfo.reporting_manager}"]`)
            .nth(1);
    }

    async verifyEmployeeDetails() {
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
            if (employeeCreationInfo.department)
                await expect(employee_department).toBeVisible();
            if (employeeCreationInfo.designation)
                await expect(employee_designation).toBeVisible();
            if (employeeCreationInfo.grade)
                await expect(employee_grade).toBeVisible();
            if (employeeCreationInfo.reporting_manager)
                await expect(employee_reporting_manager).toBeVisible();
            if (employeeCreationInfo.reporting_manager)
                await expect(employee_approval_manager).toBeVisible();
        }
        await verifyVisibility();
    }

    async checkEmployeeCodeLink() {
        const employee_code = (await this.employeeCodeLocator())
            .locator('//a')
            .first();
        await employee_code.click();

        const code_locator = this.locate('div', {
            text: employeeCreationInfo.employee_code,
        })._locator;
        await expect(code_locator).toBeVisible();
    }
    async checkEmployeeNameLink() {
        const employee_name = await this.getEmployeeName();
        const name = await employee_name.innerText();
        await employee_name.click();

        const name_locator = this.locate('div', { text: name })._locator;
        await expect(name_locator).toBeVisible();
    }
    async checkEmployeeEmailLink() {
        const employee_email = await this.getEmployeeEmail();
        await employee_email.click();
        const email_locator = await this.locate('span', { id: 'has-Email' })
            ._locator;
        await expect(email_locator).toBeVisible();
    }

    async checkEmployeeDepartmentLink() {
        const employee_department = await this.getEmployeeDepartment();
        await employee_department.click();
        const department_locator = await this.locate(
            '//div[contains(@class,"text-base font-semibold")]'
        )._locator.innerText();

        expect(department_locator).toContain(employeeCreationInfo.department);
    }

    async checkEmployeeDesignationLink() {
        const employee_designation = await this.getEmployeeDesignation();
        await employee_designation.click();

        const designation_locator = this.locate('div', {
            text: employeeCreationInfo.designation,
        })._locator;

        await expect(designation_locator).toBeVisible();
    }

    async checkReportingManagerLink() {
        const employee_reporting_manager =
            await this.getEmployeeReportingManager();
        await employee_reporting_manager.click();

        const reporting_manager_locator = this.locate('div', {
            text: employeeCreationInfo.reporting_manager,
        })._locator;

        await expect(reporting_manager_locator).toBeVisible();
    }

    async checkApprovalManagerLink() {
        const employee_approval_manager =
            await this.getEmployeeApprovalManager();
        await employee_approval_manager.click();

        const approval_mananger_locator = this.locate('div', {
            text: employeeCreationInfo.reporting_manager,
        })._locator;

        await expect(approval_mananger_locator).toBeVisible();
    }

    async clickActionOption(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;
        await optionContainer.getByRole('menuitem', { name: options }).click();
    }
    async changeTab(tabName: string) {
        await this._page
            .getByRole('tab', { name: tabName, exact: true })
            .click();

        await this._page.waitForTimeout(2000);
    }
}
