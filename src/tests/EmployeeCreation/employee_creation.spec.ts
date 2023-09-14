import { PROCESS_TEST } from '@/fixtures';
import { BreadCrumbHelper } from '@/helpers/BaseHelper/breadCrumb.helper';
import { DialogHelper } from '@/helpers/BaseHelper/dialog.helper';
import { TabHelper } from '@/helpers/BaseHelper/tab.helper';
import {
    AddEmployeeCreation,
    EmployeeCreation,
} from '@/helpers/EmplyeeCreationHelper/employeeCreation.helper';
import { FormHelper } from '@/helpers/BaseHelper/form.helper';

import { generateRandomNumber } from '@/utils/common.utils';

const { expect, describe } = PROCESS_TEST;

const employeeCreationInfo_SaveAndCreate = {
    name: 'Admin SnC7',
    email: `empcreation${generateRandomNumber()}@test.com`,
    identifier: `EMP${generateRandomNumber()}`,
    department_id: 'Test',
    designation_id: 'Admin Accountant',
    grade_id: 'E3',
    manager_id: 'Amit Raj',
    approval_manager_id: 'Ravi',
    notes: 'Adding Notes for testing',
};

const employeeCreationInfo = {
    name: 'Admin Create6',
    email: `empcreation${generateRandomNumber()}@test.com`,
    identifier: `EMP${generateRandomNumber()}`,
    status: 'Active',
    department_id: 'Test',
    designation_id: 'Admin Accountant',
    grade_id: 'E3',
    manager_id: 'Amit Raj',
    approval_manager_id: 'Ravi',
    notes: 'again with incorrect format',
};

const employeeCreationSchema = {
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
        type: 'select',
    },
    designation_id: {
        type: 'select',
    },
    grade_id: {
        type: 'select',
    },
    manager_id: {
        type: 'select',
    },
    approval_manager_id: {
        type: 'select',
    },
};

describe('TEC001', () => {
    PROCESS_TEST('Verify Employee Creation Page', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const dialogForm = new DialogHelper(page);
        await PROCESS_TEST.step(
            'Navigate to Employee Creation Page',
            async () => {
                await employeeCreationPage.profile();
                await employeeCreationPage.init();
                await employeeCreationPage.clickAddIcon();
                await dialogForm.checkDialogTitle('Add Employee');
            }
        );
    });

    PROCESS_TEST('Save and Create Another', async ({ page }) => {
        const dialogForm = new DialogHelper(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);
        const employeeCreationPage = new EmployeeCreation(page);
        await employeeCreationPage.init();
        await employeeCreationPage.clickAddIcon();
        await dialogForm.checkDialogTitle('Add Employee');

        await PROCESS_TEST.step('Verify then Fill Employee Form', async () => {
            await dialogForm.verifyInputField('Name');
            await dialogForm.verifyInputField('Email');
            await dialogForm.verifyInputField('Employee Code');
            await dialogForm.verifyInputField('Department');
            await dialogForm.verifyInputField('Designation');
            await dialogForm.verifyInputField('Grade');
            await dialogForm.verifyInputField('Reporting Manager');
            await dialogForm.verifyInputField('Approval Manager');
        });

        await PROCESS_TEST.step('Fill Employee Form', async () => {
            await employeeCreationPage.formHelper.fillFormInputInformation(
                employeeCreationSchema,
                employeeCreationInfo_SaveAndCreate
            );
            await employeeCreationPage.saveAndCreateCheckbox();
            await employeeCreationPage.clickButton('Save');
            await employeeCreationPage.notification.checkToastSuccess(
                'Successfully created'
            );

            await addEmployeeCreationForm.formHelper.isInputFieldEmpty('name');
            await dialogForm.closeDialog();
        });
    });

    PROCESS_TEST('Fill Employee Form', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);
        const formHelper = new FormHelper(page);
        const dialog = new DialogHelper(page);
        await employeeCreationPage.init();
        await addEmployeeCreationForm.clickAddIcon();
        await dialog.checkDialogTitle('Add Employee');

        await PROCESS_TEST.step('Fill Employee Form', async () => {
            await formHelper.fillFormInputInformation(
                employeeCreationSchema,
                employeeCreationInfo
            );
            await employeeCreationPage.clickButton('Save');
            await employeeCreationPage.notification.checkToastSuccess(
                'Successfully created'
            );
        });
    });

    PROCESS_TEST('Search then Verify Employee Details', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await PROCESS_TEST.step('Verify Added Employee Details', async () => {
            await employeeCreationPage.init();
            await employeeCreationPage.searchInList(employeeCreationInfo.name);
            // await addEmployeeCreationForm.verifyEmployeeDetails();
            await addEmployeeCreationForm.findRowInTable(
                employeeCreationInfo.name,
                'NAME'
            );
        });
    });

    PROCESS_TEST('Check Employee Code', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);
        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        // await addEmployeeCreationForm.listing.findRowInTable(
        //     employeeCreationInfo.employee_code,
        //     'EMPLOYEES CODE'
        // );
        await addEmployeeCreationForm.checkEmployeeCodeLink();
        await addEmployeeCreationForm.breadCrumb.checkBreadCrumbTitle(
            'Employee Detail'
        );
    });

    PROCESS_TEST('Check Name ', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkEmployeeNameLink();
        await addEmployeeCreationForm.breadCrumb.checkBreadCrumbTitle(
            'Employee Detail'
        );
    });

    PROCESS_TEST('Check Email', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkEmployeeEmailLink();
        await employeeCreationPage.breadCrumb.checkBreadCrumbTitle(
            'Employee Detail'
        );
    });

    PROCESS_TEST('Check Department', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkEmployeeDepartmentLink();
        await addEmployeeCreationForm.breadCrumb.checkBreadCrumbTitle(
            'Department Detail'
        );
    });

    PROCESS_TEST('Check Designation', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkEmployeeDesignationLink();
        await addEmployeeCreationForm.breadCrumb.checkBreadCrumbTitle(
            'Designation Detail'
        );
    });

    PROCESS_TEST('Check Approval Manager', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkApprovalManagerLink();
        await addEmployeeCreationForm.breadCrumb.checkBreadCrumbTitle(
            'Employee Detail'
        );
    });

    PROCESS_TEST('Check Reporting Manager', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkReportingManagerLink();
        await addEmployeeCreationForm.breadCrumb.checkBreadCrumbTitle(
            'Employee Detail'
        );
    });

    PROCESS_TEST('Change Employee Status', async ({ page }) => {
        const employeeCreationPage = new EmployeeCreation(page);
        const addEmployeeCreationForm = new AddEmployeeCreation(page);
        const tabHelper = new TabHelper(page);

        await employeeCreationPage.init();
        await employeeCreationPage.searchInList(employeeCreationInfo.name);
        await addEmployeeCreationForm.checkEmployeeNameLink();
        await addEmployeeCreationForm.clickButton('Actions');

        await PROCESS_TEST.step('Deactivate Status', async () => {
            const breadcrumbHelper = new BreadCrumbHelper(page);
            await addEmployeeCreationForm.clickActionOption('Deactivate');
            await addEmployeeCreationForm.clickButton('Yes!');
            await employeeCreationPage.notification.checkToastSuccess(
                'Status Changed'
            );
            // await expect(await addEmployeeCreationForm.toastSuccess()).toBe(
            //     'Status Changed'
            // );
            await breadcrumbHelper.clickBreadCrumbsLink('Employees');
            await tabHelper.clickTab('Inactive');
            expect(await addEmployeeCreationForm.getEmployeeStatus()).toBe(
                'Inactive'
            );
        });

        await PROCESS_TEST.step('Activate Status', async () => {
            const tabHelper = new TabHelper(page);
            const breadcrumbHelper = new BreadCrumbHelper(page);
            await addEmployeeCreationForm.checkEmployeeNameLink();
            await addEmployeeCreationForm.clickButton('Actions');
            await addEmployeeCreationForm.clickActionOption('Activate');
            await addEmployeeCreationForm.clickButton('Yes!');
            await employeeCreationPage.notification.checkToastSuccess(
                'Status Changed'
            );
            // await expect(await addEmployeeCreationForm.toastSuccess()).toBe(
            //     'Status Changed'
            // );
            await breadcrumbHelper.clickBreadCrumbsLink('Employees');
            await tabHelper.clickTab('Active');
            expect(await addEmployeeCreationForm.getEmployeeStatus()).toBe(
                'Active'
            );
        });
    });
});
