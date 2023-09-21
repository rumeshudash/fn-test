import { Invalid_Email_Error_Message } from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import { EmployeeDetailsPage } from '@/helpers/EmplyeeCreationHelper/EmployeeDetails.helper';
import { EmployeeCreation } from '@/helpers/EmplyeeCreationHelper/employeeCreation.helper';
import { generateRandomName, generateRandomNumber } from '@/utils/common.utils';
import { DocumentInfo } from '@/utils/required_data';

const { expect, describe } = PROCESS_TEST;
describe.configure({ mode: 'serial' });
describe('Expense Creation>Finops Portal', () => {
    const employeeCreationInfo_SaveAndCreate = {
        name: `${generateRandomName()}`,
        email: `email${generateRandomNumber()}@test.com`,
        identifier: `emp${generateRandomNumber()}`,
        department_id: 'Marketing',
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
        department_id: 'Sales',
        designation_id: 'Admin Accountant',
        grade_id: 'E3',
        manager_id: 'Amit Raj',
        approval_manager_id: 'Ravi',
        notes: 'again with incorrect format',
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

        await PROCESS_TEST.step(
            'Navigate to Employee Creation Page',
            async () => {
                await employeeCreation.init();
                await employeeCreation.clickAddIcon();
                await employeeCreation.dialog.checkDialogTitle('Add Employee');
            }
        );

        await PROCESS_TEST.step('verify mandatory fields', async () => {
            await page.waitForTimeout(1000);
            await employeeCreation.form.checkIsMandatoryFields(
                employeeCreation.employeeCreationSchema
            );
            await employeeCreation.form.fillFormInputInformation(
                employeeCreation.employeeCreationSchema,
                {}
            );
            await employeeCreation.form.submitButton();
            await employeeCreation.form.checkAllMandatoryInputHasErrors(
                employeeCreation.employeeCreationSchema
            );
        });

        await PROCESS_TEST.step('With Invalid Email  ', async () => {
            await employeeCreation.form.fillFormInputInformation(
                employeeCreation.employeeCreationSchema,
                {
                    ...employeeCreation,
                    email: 'usergmail.com',
                },
                'identifier'
            );

            await employeeCreation.form.checkIsInputHasErrorMessage(
                Invalid_Email_Error_Message,
                {
                    name: 'email',
                }
            );
        });

        await PROCESS_TEST.step('Check Save And Create Another', async () => {
            await employeeCreation.form.fillFormInputInformation(
                employeeCreation.employeeCreationSchema,
                employeeCreationInfo_SaveAndCreate
            );
            await employeeCreation.saveAndCreateCheckbox();
            await employeeCreation.form.submitButton();
            await employeeCreation.notification.checkToastSuccess(
                'Successfully created'
            );

            await employeeCreation.form.checkIsInputFieldEmpty('name');
            // checking form still open or not
            await employeeCreation.dialog.checkDialogTitle('Add Employee');
        });

        await PROCESS_TEST.step(
            'Check without save and create another ',
            async () => {
                await employeeCreation.form.fillFormInputInformation(
                    employeeCreation.employeeCreationSchema,
                    employeeCreationInfo
                );
                await employeeCreation.saveAndCreateCheckbox(false);
                await employeeCreation.form.submitButton();
                await employeeCreation.notification.checkToastSuccess(
                    'Successfully created'
                );
                await employeeCreation.dialog.checkFormIsOpen(false);
            }
        );

        await PROCESS_TEST.step('Verify Created Data in table', async () => {
            await employeeCreation.listing.searchInList(
                employeeCreationInfo.name
            );
            await employeeCreation.verifyEmployeeTableData();
        });

        await PROCESS_TEST.step('verify clickable links', async () => {
            await PROCESS_TEST.step('Check Name ', async () => {
                await employeeCreation.checkEmployeeNameLink();
                await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                    'Employee Detail'
                );
                await employeeCreation.breadCrumb.clickBreadCrumbsLink(
                    'Employees'
                );
            });

            await PROCESS_TEST.step('Check Email', async () => {
                await employeeCreation.listing.searchInList(
                    employeeCreationInfo.name
                );
                await employeeCreation.checkEmployeeEmailLink();
                await employeeCreation.breadCrumb.checkBreadCrumbTitle(
                    'Employee Detail'
                );
                await employeeCreation.breadCrumb.clickBreadCrumbsLink(
                    'Employees'
                );
            });

            await PROCESS_TEST.step('Check Department', async () => {
                await employeeCreation.listing.searchInList(
                    employeeCreationInfo.name
                );
                await employeeCreation.checkEmployeeDepartmentLink();
                await page.goBack({
                    waitUntil: 'networkidle',
                });
            });

            await PROCESS_TEST.step('Check Designation', async () => {
                await employeeCreation.listing.searchInList(
                    employeeCreationInfo.name
                );
                await employeeCreation.checkEmployeeDesignationLink();
                await page.goBack({
                    waitUntil: 'networkidle',
                });
            });

            await PROCESS_TEST.step('Check Approval Manager', async () => {
                await employeeCreation.listing.searchInList(
                    employeeCreationInfo.name
                );
                await employeeCreation.checkApprovalManagerLink();
                await employeeCreation.breadCrumb.clickBreadCrumbsLink(
                    'Employees'
                );
            });

            await PROCESS_TEST.step('Check Reporting Manager', async () => {
                await employeeCreation.listing.searchInList(
                    employeeCreationInfo.name
                );
                await employeeCreation.checkReportingManagerLink();
                await employeeCreation.breadCrumb.clickBreadCrumbsLink(
                    'Employees'
                );
            });
        });

        await PROCESS_TEST.step('Verify Employee Status Change', async () => {
            await PROCESS_TEST.step(
                'Change Employee Status Active to Inactive',
                async () => {
                    await employeeCreation.listing.searchInList(
                        employeeCreationInfo.name
                    );
                    await employeeCreation.checkEmployeeNameLink();
                    await employeeCreation.clickButton('Actions');

                    await employeeCreation.clickActionOption('Deactivate');
                    await employeeCreation.clickButton('Yes!');
                    await employeeCreation.notification.checkToastSuccess(
                        'Status Changed'
                    );

                    await page.goBack({
                        waitUntil: 'networkidle',
                    });
                }
            );

            await PROCESS_TEST.step(
                'Verify Inactive Status in table',
                async () => {
                    await employeeCreation.tab.clickTab('Inactive');
                    expect(await employeeCreation.getEmployeeStatus()).toBe(
                        'Inactive'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Change Employee Status Active to Inactive',
                async () => {
                    await employeeCreation.listing.searchInList(
                        employeeCreationInfo.name
                    );
                    await employeeCreation.checkEmployeeNameLink();
                    await employeeCreation.clickButton('Actions');

                    await employeeCreation.clickActionOption('Activate');
                    await employeeCreation.clickButton('Yes!');
                    await employeeCreation.notification.checkToastSuccess(
                        'Status Changed'
                    );

                    await page.goBack({
                        waitUntil: 'networkidle',
                    });
                }
            );
            await PROCESS_TEST.step(
                'Verify Active Status in table',
                async () => {
                    await employeeCreation.tab.clickTab('Active');
                    expect(await employeeCreation.getEmployeeStatus()).toBe(
                        'Active'
                    );
                }
            );
        });

        await PROCESS_TEST.step('Check Confirm Form Closed', async () => {
            await employeeCreation.clickAddIcon();
            await page.waitForTimeout(1000);
            await employeeCreation.fillInput(' ', {
                name: 'name',
            });

            await employeeCreation.dialog.checkConfirmDialogOpenOrNot();
            await employeeCreation.dialog.clickConfirmDialogAction('Yes');
            await employeeCreation.dialog.checkFormIsOpen(false);
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
