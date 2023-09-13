import { expect } from '@playwright/test';
import { BaseHelper } from './base.helper';
import chalk from 'chalk';

export class FillEmployeeCreationForm extends BaseHelper {
    constructor(page) {
        super(page);
    }

    async fillEmployeeForm(employeeInfo) {
        if (await employeeInfo.name)
            await this.fillText(employeeInfo.name, {
                name: 'name',
            });

        if (await employeeInfo.email)
            await this.fillText(employeeInfo.email, {
                name: 'email',
            });

        if (await employeeInfo.employee_code)
            await this.fillText(employeeInfo.employee_code, {
                name: 'identifier',
            });
        if (await employeeInfo.department)
            await this.selectOption({
                input: employeeInfo.department,
                placeholder: 'Select  Department',
            });

        if (await employeeInfo.designation)
            await this.selectOption({
                input: employeeInfo.designation,
                placeholder: 'Select Designation',
            });
        if (await employeeInfo.grade)
            await this.selectOption({
                input: employeeInfo.grade,
                placeholder: 'Select Grade',
            });
        if (await employeeInfo.reporting_manager)
            await this.selectOption({
                input: employeeInfo.reporting_manager,
                placeholder: 'Select Manager',
                exact: true,
            });
        // await this.selectOption({
        //     input: this.employeeInfo.approval_mananger,
        //     placeholder: 'Select approval Manager',
        //     exact: true,
        // });
    }
}
