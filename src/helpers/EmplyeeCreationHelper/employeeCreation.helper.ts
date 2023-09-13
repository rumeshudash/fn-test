import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { addSeconds, isThisSecond } from 'date-fns';
import { PageHelper } from '../BaseHelper/page.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { bankAccountInfo, employeeCreationInfo } from '@/utils/required_data';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { Locator } from 'playwright';
import chalk from 'chalk';
import { tr } from 'date-fns/locale';

export class EmployeeCreation extends ListingHelper {
    public notification: NotificationHelper;
    public breadcrumb: BreadCrumbHelper;
    constructor(page: any) {
        super(page);
        this.notification = new NotificationHelper(page);
        this.breadcrumb = new BreadCrumbHelper(page);
    }

    async init() {
        await this.navigateTo('EMPLOYEE_CREATION');
    }

    async clickEmployeeInfo(title: string, columnName: string) {
        const row = await this.findRowInTable(title, columnName);
        const clickCell = (await this.getCell(row, columnName)).locator('a');
        await clickCell.click();
        await this._page.waitForTimeout(2000);
    }
}

export class AddEmployeeCreation extends BaseHelper {
    // public employeeCreationInfo;
    public listing: ListingHelper;
    public formHelper: FormHelper;
    public breadCrumb: BreadCrumbHelper;
    constructor(page: any) {
        super(page);
        this.listing = new ListingHelper(page);
        this.formHelper = new FormHelper(page);
        this.breadCrumb = new BreadCrumbHelper(page);
        // this.employeeCreationInfo = employeeCreationInfo;
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
        return await parentLocator
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
    // async changeTab(tabName: string) {
    //     await this._page
    //         .getByRole('tab', { name: tabName, exact: true })
    //         .click();

    //     await this._page.waitForTimeout(2000);
    // }
}

export class EmployeeDetailsPage extends BaseHelper {
    public breadCrumb: BreadCrumbHelper;
    public listing: ListingHelper;
    constructor(page: any) {
        super(page);
        this.listing = new ListingHelper(page);
    }

    async parentEmployeeDetails() {
        return this.locate('//div[contains(@class,"h-full overflow-hidden")]')
            ._locator;
    }

    async checkEmployeeName() {
        const parentHelper = await this.parentEmployeeDetails();
        const locateName = parentHelper.filter({
            hasText: employeeCreationInfo.name,
        });

        await expect(locateName).toBeVisible();
    }

    async checkEmployeeCode() {
        const parentHelper = await this.parentEmployeeDetails();
        const locateCode = parentHelper.locator(
            "//div[@class='text-sm text-base-secondary']"
        );
        expect(await locateCode.innerText()).toBe(
            employeeCreationInfo.employee_code
        );
    }

    async checkEmployeeDetails(locator: string, text: string) {
        const parentHelper = await this.parentEmployeeDetails();
        const isVisible = await parentHelper.locator(locator).innerText();
        expect(isVisible).toBe(text);
    }

    async clickEditIcon() {
        await this._page.locator("//button[@data-title='Edit']").click();
    }
    async checkBankInfo() {
        const row = await this.listing.findRowInTable(
            bankAccountInfo.ifsc_code,
            'IFSC CODE'
        );
        expect(await row.isVisible(), 'Check row of IFSC Code').toBe(true);
    }

    async checkInviteUserEmail() {
        const email = this.locate(
            `(//span[text()='${employeeCreationInfo.email}'])[2]`
        )._locator;
        await expect(
            email,
            chalk.red(`${employeeCreationInfo.email} Visibility check`)
        ).toBeVisible();
    }
    async checkDocumentName(name: string | number) {
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
