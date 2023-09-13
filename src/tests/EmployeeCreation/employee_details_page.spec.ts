import { PROCESS_TEST } from '@/fixtures';
import { DialogHelper } from '@/helpers/BaseHelper/dialog.helper';
import { FillEmployeeCreationForm } from '@/helpers/BaseHelper/addEmployeeForm.helper';
import { FormHelper } from '@/helpers/BaseHelper/form.helper';
import { NotificationHelper } from '@/helpers/BaseHelper/notification.helper';
import { TabHelper } from '@/helpers/BaseHelper/tab.helper';
import {
    EmployeeCreation,
    EmployeeDetailsPage,
} from '@/helpers/EmplyeeCreationHelper/employeeCreation.helper';
import {
    DocumentInfo,
    EditEmployeeCreationInfo,
    bankAccountInfo,
} from '@/utils/required_data';

const employeeCreationInfo = {
    name: 'Admin Create6',
    email: 'employeecreation6@test.com',
    status: 'Active',
    identifier: 'EC06',
    department_id: 'Test',
    designation_id: 4018,
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
        required: false,
    },
    designation_id: {
        type: 'select',
        required: false,
    },
    grade_id: {
        type: 'select',
        required: false,
    },
    manager_id: {
        type: 'select',
        required: false,
    },
    approval_manager_id: {
        type: 'select',
        required: false,
    },
};

const bankAccountSchema = {};
const { describe, expect } = PROCESS_TEST;
describe('TED001', () => {
    PROCESS_TEST('Verify to Employee Code Page', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);

        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.identifier,
            'EMPLOYEE CODE'
        );
        await employeeCreation.breadcrumb.checkBreadCrumbTitle(
            'Employee Detail'
        );
        await detailsPage.checkEmployeeName();
        await detailsPage.checkEmployeeCode();
        await detailsPage.checkEmployeeDetails(
            '#has-Account\\ Status',
            'Active'
        );
        await detailsPage.checkEmployeeDetails(
            '#has-Department',
            employeeCreationInfo.department_id
        );
        await detailsPage.checkEmployeeDetails(
            '#has-Designation',
            employeeCreationInfo.designation_id
        );
        await detailsPage.checkEmployeeDetails(
            '#has-Reporting\\ Manager',
            employeeCreationInfo.manager_id
        );
        await detailsPage.checkEmployeeDetails(
            '#has-Approval\\ Manager',
            employeeCreationInfo.approval_manager_id
        );
        await detailsPage.checkEmployeeDetails(
            '#has-Email',
            employeeCreationInfo.email
        );
        await detailsPage.checkEmployeeDetails(
            '#has-Grade',
            employeeCreationInfo.grade_id
        );
    });

    PROCESS_TEST('Edit Employee Info', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        const editEmployeeForm = new FillEmployeeCreationForm(page);
        const notification = new NotificationHelper(page);
        const dialog = new DialogHelper(page);
        const formHelper = new FormHelper(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);
        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.email,
            'EMAIL'
        );
        await detailsPage.clickEditIcon();
        await dialog.checkDialogTitle('Edit Employee');
        await formHelper.fillFormInputInformation(
            employeeCreationSchema,
            EditEmployeeCreationInfo
        );
        await editEmployeeForm.clickButton('Save');
        await notification.checkToastSuccess('Successfully created');
    });

    PROCESS_TEST('Verify Action Options', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        // const editEmployeeForm = new FillEmployeeCreationForm(page);
        // const notification = new NotificationHelper(page);
        // const dialog = new DialogHelper(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);
        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.email,
            'EMAIL'
        );
        await detailsPage.clickActionButton();
        await detailsPage.verifyActionOptions('Invite User');
        await detailsPage.verifyActionOptions('Add Bank Account');
        await detailsPage.verifyActionOptions('Add Notes');
        await detailsPage.verifyActionOptions('Add Documents');
        await detailsPage.verifyActionOptions('Deactivate');
    });

    PROCESS_TEST('Add Bank Account - Action Options', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        const notification = new NotificationHelper(page);
        const tab = new TabHelper(page);
        const form = new FormHelper(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);
        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.email,
            'EMAIL'
        );
        await detailsPage.clickActionButton();
        await detailsPage.clickActionOption('Add Bank Account');
        await form.fillFormInputInformation(bankAccountSchema, bankAccountInfo);
        await form.submitButton();
        await form.submitButton();
        await notification.checkToastSuccess('Successfully saved');
        await notification.getErrorMessage();

        await PROCESS_TEST.step('Verify Bank Account', async () => {
            await tab.clickTab('Bank');
            await detailsPage.checkBankInfo();
        });
    });

    PROCESS_TEST('Add Documents - Action Options', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        const notification = new NotificationHelper(page);
        const tab = new TabHelper(page);
        const form = new FormHelper(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);
        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.email,
            'EMAIL'
        );
        await detailsPage.clickActionButton();
        await detailsPage.clickActionOption('Add Documents');
        await form.uploadDocument(DocumentInfo.document);
        await form.fillTextAreaForm(DocumentInfo.comment);
        await form.submitButton();
        await notification.getToastSuccess();

        await PROCESS_TEST.step('Verify Uploaded Documents', async () => {
            await tab.clickTab('Documents');
            await detailsPage.checkDocumentName(DocumentInfo.document.file);
        });
    });

    PROCESS_TEST('Invite User - Action Options', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        const dialog = new DialogHelper(page);
        const notification = new NotificationHelper(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);
        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.email,
            'EMAIL'
        );
        await detailsPage.clickActionButton();
        await detailsPage.clickActionOption('Invite User');
        await dialog.checkDialogTitle('Invite User');
        await detailsPage.checkInviteUserEmail();
        await detailsPage.setRole('AP Manager');
        await detailsPage.setRole('Finops Admin');
        await detailsPage.setRole('Vendor Manager');
        await employeeCreation.clickButton('Save');
        await notification.checkToastSuccess('Successfully Invited User');
    });

    PROCESS_TEST('Add Notes and Verify - Action Options', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(page);
        const detailsPage = new EmployeeDetailsPage(page);
        const dialog = new DialogHelper(page);
        const tab = new TabHelper(page);
        const notification = new NotificationHelper(page);
        await employeeCreation.init();
        await employeeCreation.searchInList(employeeCreationInfo.identifier);
        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.email,
            'EMAIL'
        );
        await detailsPage.clickActionButton();
        await detailsPage.clickActionOption('Add Notes');
        await dialog.checkDialogTitle('Add Notes');

        //Add Notes
        await detailsPage.addNotes(employeeCreationInfo.notes);
        await detailsPage.clickButton('Save');
        // await notification.checkToastSuccess('Successfully added');

        await PROCESS_TEST.step('Verify Added Notes', async () => {
            await tab.clickTab('Notes');
            await detailsPage.checkNotes(employeeCreationInfo.notes);
        });
    });
});
