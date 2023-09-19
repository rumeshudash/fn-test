import { PROCESS_TEST } from '@/fixtures';
import { BreadCrumbHelper } from '@/helpers/BaseHelper/breadCrumb.helper';
import { EmployeeDetailsPage } from '@/helpers/EmplyeeCreationHelper/EmployeeDetails.helper';
import { EmployeeCreation } from '@/helpers/EmplyeeCreationHelper/employeeCreation.helper';
import { generateRandomName, generateRandomNumber } from '@/utils/common.utils';
import { DocumentInfo } from '@/utils/required_data';

const { expect, describe } = PROCESS_TEST;
describe.configure({ mode: 'serial' });
describe('Expense Creation>Finops Portal', () => {
    const employeeCreationInfo_SaveAndCreate = {
        name: `${generateRandomName()}`,
        email: `scmail${generateRandomNumber()}@test.com`,
        identifier: `emp${generateRandomNumber()}`,
        department_id: 'Department172857764167',
        designation_id: 'Admin Accountant',
        grade_id: 'E3',
        manager_id: 'Amit Raj',
        approval_manager_id: 'Ravi',
        notes: 'Adding Notes for testing',
    };

    const employeeCreationInfo = {
        name: `${generateRandomName()}`,
        email: `empcreation${generateRandomNumber()}@test.com`,
        identifier: `emp${generateRandomNumber()}`,
        status: 'Active',
        department_id: 'Department172857764167',
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

    const EditEmployeeCreationInfo = {
        name: `${generateRandomName()}`,

        identifier: `edit${generateRandomNumber()}`,
    };

    //Bank Account Details for Employee Details Page

    const EditedEmployeeCreationSchema = {
        name: {
            type: 'text',
            required: true,
        },

        identifier: {
            type: 'text',
            required: true,
        },
    };

    const bankAccountInfo = {
        account_number: '12345678',
        re_account_number: '12345678',
        ifsc_code: 'ICIC0000005',
    };
    const bankAccountSchema = {
        account_number: {
            type: 'password',
            required: true,
        },
        re_account_number: {
            type: 'text',
            required: true,
        },
        ifsc_code: {
            type: 'text',
            required: true,
        },
    };
    PROCESS_TEST('TEC001', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(
            employeeCreationInfo,
            page
        );

        // const addEmployeeCreationForm = new AddEmployeeCreation(
        //     employeeCreationInfo,
        //     page
        // );

        await PROCESS_TEST.step(
            'Navigate to Employee Creation Page',
            async () => {
                await employeeCreation.init();
                await employeeCreation.clickAddIcon();
                await employeeCreation.dialog.checkDialogTitle('Add Employee');
            }
        );

        await PROCESS_TEST.step('Verify Employee Form', async () => {
            await employeeCreation.dialog.verifyInputField('Name');
            await employeeCreation.dialog.verifyInputField('Email');
            await employeeCreation.dialog.verifyInputField('Employee Code');
            await employeeCreation.dialog.verifyInputField('Department');
            await employeeCreation.dialog.verifyInputField('Designation');
            await employeeCreation.dialog.verifyInputField('Grade');
            await employeeCreation.dialog.verifyInputField('Reporting Manager');
            await employeeCreation.dialog.verifyInputField('Approval Manager');
        });

        await PROCESS_TEST.step('Save And Create Employee Form', async () => {
            await employeeCreation.form.fillFormInputInformation(
                employeeCreationSchema,
                employeeCreationInfo_SaveAndCreate
            );
            await employeeCreation.saveAndCreateCheckbox();
            await employeeCreation.clickButton('Save');
            await employeeCreation.notification.checkToastSuccess(
                'Successfully created'
            );

            await employeeCreation.form.checkIsInputFieldEmpty('name');
            await employeeCreation.dialog.closeDialog();
        });

        await PROCESS_TEST.step('Fill Employee Form - 2 ', async () => {
            await employeeCreation.clickAddIcon();

            await employeeCreation.form.fillFormInputInformation(
                employeeCreationSchema,
                employeeCreationInfo
            );
            await employeeCreation.clickButton('Save');
            await employeeCreation.notification.checkToastSuccess(
                'Successfully created'
            );
        });

        await PROCESS_TEST.step(
            'Search then Verify Employee Details',
            async () => {
                // const employeeCreation = new EmployeeCreation(
                //     employeeCreationInfo,
                //     page
                // );
                // const addEmployeeCreationForm = new AddEmployeeCreation(
                //     employeeCreationInfo,
                //     page
                // );

                await employeeCreation.listing.searchInList(
                    employeeCreationInfo.name
                );
                await employeeCreation.verifyEmployeeDetails();
            }
        );

        await PROCESS_TEST.step('Check Name ', async () => {
            // const employeeCreation = new AddEmployeeCreation(
            //     employeeCreationInfo,
            //     page
            // );

            await employeeCreation.checkEmployeeNameLink();
            await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                'Employee Detail'
            );
            await employeeCreation.breadCrumb.clickBreadCrumbsLink('Employees');
        });

        await PROCESS_TEST.step('Check Email', async () => {
            // const addEmployeeCreationForm = new AddEmployeeCreation(
            //     employeeCreationInfo,
            //     page
            // );

            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.checkEmployeeEmailLink();
            await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                'Employee Detail'
            );
            await employeeCreation.breadCrumb.clickBreadCrumbsLink('Employees');
        });

        await PROCESS_TEST.step('Check Department', async () => {
            await employeeCreation.init();

            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.checkEmployeeDepartmentLink();
            await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                'Department Detail'
            );
        });

        await PROCESS_TEST.step('Check Designation', async () => {
            await employeeCreation.init();

            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.checkEmployeeDesignationLink();
            await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                'Designation Detail'
            );
        });

        await PROCESS_TEST.step('Check Approval Manager', async () => {
            await employeeCreation.init();

            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.checkApprovalManagerLink();
            await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                'Employee Detail'
            );
        });

        await PROCESS_TEST.step('Check Reporting Manager', async () => {
            await employeeCreation.init();

            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.checkReportingManagerLink();
            await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                'Employee Detail'
            );
        });

        await PROCESS_TEST.step('Change Employee Status', async () => {
            await employeeCreation.init();

            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.checkEmployeeNameLink();
            await employeeCreation.clickButton('Actions');
        });
        await PROCESS_TEST.step('Deactivate Status', async () => {
            const breadcrumbHelper = new BreadCrumbHelper(page);
            await employeeCreation.clickActionOption('Deactivate');
            await employeeCreation.clickButton('Yes!');
            await employeeCreation.notification.checkToastSuccess(
                'Status Changed'
            );

            await breadcrumbHelper.clickBreadCrumbsLink('Employees');
            await employeeCreation.tab.clickTab('Inactive');
            expect(await employeeCreation.getEmployeeStatus()).toBe('Inactive');
        });

        await PROCESS_TEST.step('Activate Status', async () => {
            await employeeCreation.checkEmployeeNameLink();
            await employeeCreation.clickButton('Actions');
            await employeeCreation.clickActionOption('Activate');
            await employeeCreation.clickButton('Yes!');
            await employeeCreation.notification.checkToastSuccess(
                'Status Changed'
            );

            await employeeCreation.breadCrumb.clickBreadCrumbsLink('Employees');
            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.tab.clickTab('Active');
            expect(await employeeCreation.getEmployeeStatus()).toBe('Active');
        });
    });

    PROCESS_TEST('TED001', async ({ page }) => {
        const employeeCreation = new EmployeeCreation(
            employeeCreationInfo,
            page
        );
        const detailsPage = new EmployeeDetailsPage(employeeCreationInfo, page);
        await employeeCreation.init();
        await employeeCreation.listing.searchInList(
            employeeCreationInfo.identifier
        );

        await employeeCreation.clickEmployeeInfo(
            employeeCreationInfo.identifier,
            'EMPLOYEE CODE'
        );
        await employeeCreation.breadCrumb.checkBreadCrumbTitle(
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

        await PROCESS_TEST.step('Edit Employee Info', async () => {
            await employeeCreation.init();
            await employeeCreation.listing.searchInList(
                employeeCreationInfo.identifier
            );
            await employeeCreation.clickEmployeeInfo(
                employeeCreationInfo.email,
                'EMAIL'
            );
            await detailsPage.clickEditIcon();
            await employeeCreation.dialog.checkDialogTitle('Edit Employee');
            await employeeCreation.form.fillFormInputInformation(
                EditedEmployeeCreationSchema,
                EditEmployeeCreationInfo
            );
            await detailsPage.clickButton('Save');
            await employeeCreation.notification.checkToastSuccess(
                'Successfully created'
            );
        });

        await PROCESS_TEST.step('Verify Action Options', async () => {
            await employeeCreation.init();
            await employeeCreation.listing.searchInList(
                EditEmployeeCreationInfo.identifier
            );
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

        await PROCESS_TEST.step(
            'Add Bank Account - Action Options',
            async () => {
                await employeeCreation.init();
                await employeeCreation.listing.searchInList(
                    EditEmployeeCreationInfo.identifier
                );
                await employeeCreation.clickEmployeeInfo(
                    employeeCreationInfo.email,
                    'EMAIL'
                );
                await detailsPage.clickActionButton();
                await detailsPage.clickActionOption('Add Bank Account');
                await employeeCreation.form.fillFormInputInformation(
                    bankAccountSchema,
                    bankAccountInfo
                );
                await employeeCreation.form.submitButton();
                await employeeCreation.form.submitButton();
                await employeeCreation.notification.checkToastSuccess(
                    'Successfully saved'
                );
                await employeeCreation.notification.getErrorMessage();
            }
        );
        await PROCESS_TEST.step('Verify Bank Account', async () => {
            await employeeCreation.tab.clickTab('Bank');
            await detailsPage.checkBankInfo(bankAccountInfo.ifsc_code);
        });

        await PROCESS_TEST.step('Add Documents - Action Options', async () => {
            await employeeCreation.init();
            await employeeCreation.listing.searchInList(
                EditEmployeeCreationInfo.identifier
            );
            await employeeCreation.clickEmployeeInfo(
                employeeCreationInfo.email,
                'EMAIL'
            );
            await detailsPage.clickActionButton();
            await detailsPage.clickActionOption('Add Documents');
            await employeeCreation.file.setFileInput({ isDialog: true });
            await employeeCreation.form.fillTextAreaForm(DocumentInfo.comment);
            await employeeCreation.form.submitButton();
            await employeeCreation.notification.getToastSuccess();
        });
        await PROCESS_TEST.step('Verify Uploaded Documents', async () => {
            await employeeCreation.tab.clickTab('Documents');
            await detailsPage.checkDocumentName(DocumentInfo.document.file);
        });

        await PROCESS_TEST.step('Invite User - Action Options', async () => {
            await employeeCreation.init();
            await employeeCreation.listing.searchInList(
                EditEmployeeCreationInfo.identifier
            );
            await employeeCreation.clickEmployeeInfo(
                employeeCreationInfo.email,
                'EMAIL'
            );
            await detailsPage.clickActionButton();
            await detailsPage.clickActionOption('Invite User');
            await employeeCreation.dialog.checkDialogTitle('Invite User');
            await detailsPage.checkInviteUserEmail();
            await detailsPage.setRole('AP Manager');
            await detailsPage.setRole('Finops Admin');
            await detailsPage.setRole('Vendor Manager');
            await employeeCreation.clickButton('Save');
            await employeeCreation.notification.checkToastSuccess(
                'Successfully Invited User'
            );
        });

        await PROCESS_TEST.step(
            'Add Notes and Verify - Action Options',
            async () => {
                await employeeCreation.init();
                await employeeCreation.listing.searchInList(
                    EditEmployeeCreationInfo.identifier
                );
                await employeeCreation.clickEmployeeInfo(
                    employeeCreationInfo.email,
                    'EMAIL'
                );
                await detailsPage.clickActionButton();
                await detailsPage.clickActionOption('Add Notes');
                await employeeCreation.dialog.checkDialogTitle('Add Notes');

                //Add Notes
                await detailsPage.addNotes(employeeCreationInfo.notes);
                await detailsPage.clickButton('Save');
            }
        );
        await PROCESS_TEST.step('Verify Added Notes', async () => {
            await employeeCreation.tab.clickTab('Notes');
            await detailsPage.checkNotes(employeeCreationInfo.notes);
        });
    });
});
