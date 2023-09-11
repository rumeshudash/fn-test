import { PROCESS_TEST } from '@/fixtures';
import { FillEmployeeCreationForm } from '@/helpers/BaseHelper/employeeCreation.helper';
import {
    AddEmployeeCreation,
    EmployeeCreation,
} from '@/helpers/EmplyeeCreationHelper/employeeCreation.helper';
import {
    employeeCreationInfo,
    employeeCreationInfo_SaveAndCreate,
} from '@/utils/required_data';
import chalk from 'chalk';

const { expect, test } = require('@playwright/test');

PROCESS_TEST('Verify Employee Creation Page', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    await test.step('Navigate to Employee Creation Page', async () => {
        await employeeCreationPage.init();
        await employeeCreationPage.clickButton('Add Employee');
    });
});

PROCESS_TEST('Save and Create Another', async ({ page }) => {
    const addEmployeeCreationForm = new AddEmployeeCreation(page);
    const employeeCreationPage = new EmployeeCreation(page);
    const employeeCreation = new FillEmployeeCreationForm(page);
    await employeeCreationPage.init();
    await employeeCreationPage.clickButton('Add Employee');

    await test.step('Verify then Fill Employee Form', async () => {
        await employeeCreation.verifyAddEmployeeForm('Name');
        await employeeCreation.verifyAddEmployeeForm('Email');
        await employeeCreation.verifyAddEmployeeForm('Employee Code');
        await employeeCreation.verifyAddEmployeeForm('Department');
        await employeeCreation.verifyAddEmployeeForm('Designation');
        await employeeCreation.verifyAddEmployeeForm('Grade');
        await employeeCreation.verifyAddEmployeeForm('Reporting Manager');
        await employeeCreation.verifyAddEmployeeForm('Approval Manager');
    });

    await test.step('Fill Employee Form', async () => {
        await employeeCreation.fillEmployeeForm(
            employeeCreationInfo_SaveAndCreate
        );
        await employeeCreation.saveAndCreateCheckbox();
        await employeeCreation.clickButton('Save');
        await expect(
            await employeeCreation.toastSuccess(),
            chalk.red('Toast Message match')
        ).toBe('Successfully created');
        await addEmployeeCreationForm.verifyAfterSaveAndCreate();
    });
});

PROCESS_TEST('Fill Employee Form', async ({ page }) => {
    const employeeCreation = new FillEmployeeCreationForm(page);
    const employeeCreationPage = new EmployeeCreation(page);
    await employeeCreationPage.init();
    await employeeCreationPage.clickButton('Add Employee');

    // await test.step('Verify Employee Form', async () => {
    //     await employeeCreation.verifyAddEmployeeForm('Name');
    //     await employeeCreation.verifyAddEmployeeForm('Email');
    //     await employeeCreation.verifyAddEmployeeForm('Employee Code');
    //     await employeeCreation.verifyAddEmployeeForm('Department');
    //     await employeeCreation.verifyAddEmployeeForm('Designation');
    //     await employeeCreation.verifyAddEmployeeForm('Grade');
    //     await employeeCreation.verifyAddEmployeeForm('Reporting Manager');
    //     await employeeCreation.verifyAddEmployeeForm('Approval Manager');
    // });

    await test.step('Fill Employee Form', async () => {
        await employeeCreation.fillEmployeeForm(employeeCreationInfo);
        await employeeCreation.clickButton('Save');
        await expect(
            await employeeCreation.toastSuccess(),
            chalk.red('Toast Message match')
        ).toBe('Successfully created');
    });
});

PROCESS_TEST('Search then Verify Employee Details', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    // const searchEmployee = new SearchHelper(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await test.step('Verify Added Employee Details', async () => {
        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.verifyEmployeeDetails();
    });
});

PROCESS_TEST('Check Employee Code', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);
    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkEmployeeCodeLink();
});

PROCESS_TEST('Check Name ', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkEmployeeNameLink();
});

PROCESS_TEST('Check Email', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkEmployeeEmailLink();
});
PROCESS_TEST('Check Department', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkEmployeeDepartmentLink();
});
PROCESS_TEST('Check Designation', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkEmployeeDesignationLink();
});
PROCESS_TEST('Check Approval Manager', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkApprovalManagerLink();
});
PROCESS_TEST('Check Reporting Manager', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkReportingManagerLink();
});

PROCESS_TEST('Change Employee Status', async ({ page }) => {
    const employeeCreationPage = new EmployeeCreation(page);
    const addEmployeeCreationForm = new AddEmployeeCreation(page);

    await employeeCreationPage.init();
    await employeeCreationPage.searchInList(employeeCreationInfo.name);
    await addEmployeeCreationForm.checkEmployeeNameLink();
    await addEmployeeCreationForm.clickButton('Actions');

    await PROCESS_TEST.step('Deactivate Status', async () => {
        await addEmployeeCreationForm.clickActionOption('Deactivate');
        await addEmployeeCreationForm.clickButton('Yes!');
        await expect(await addEmployeeCreationForm.toastSuccess()).toBe(
            'Status Changed'
        );
        await addEmployeeCreationForm.clickBreadCrumbsLink('Employees');
        await addEmployeeCreationForm.changeTab('Inactive');
        await expect(await addEmployeeCreationForm.getEmployeeStatus()).toBe(
            'Inactive'
        );
    });

    await PROCESS_TEST.step('Activate Status', async () => {
        await addEmployeeCreationForm.checkEmployeeNameLink();
        await addEmployeeCreationForm.clickButton('Actions');
        await addEmployeeCreationForm.clickActionOption('Activate');
        await addEmployeeCreationForm.clickButton('Yes!');
        await expect(await addEmployeeCreationForm.toastSuccess()).toBe(
            'Status Changed'
        );
        await addEmployeeCreationForm.clickBreadCrumbsLink('Employees');
        await addEmployeeCreationForm.changeTab('Active');
        await expect(await addEmployeeCreationForm.getEmployeeStatus()).toBe(
            'Active'
        );
    });
});
