import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DepartmentDetails } from '@/helpers/DepartmentHelper/DepartmentDetails.helper';
import { DepartmentCreation } from '@/helpers/DepartmentHelper/DepartmentCreation.helper';
import { formatDate, generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';
import { Logger } from '@/helpers/BaseHelper/log.helper';

const { expect, describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });

describe('HR -> Department Creation and Details Verification', () => {
    let data: DepartmentCreationData = {
        name: '',
        parent_id: 'Sales',
        manager_id: 'Ravi',
        date: '',
    };

    const departmentSchema = {
        name: {
            type: 'text',
            required: true,
        },
        manager_id: {
            type: 'reference_select',
        },
        parent_id: {
            type: 'reference_select',
        },
    };

    PROCESS_TEST('TDC001', async ({ page }) => {
        const department = new DepartmentCreation(page);
        await department.init();

        // check name error
        await test.step('Check errors', async () => {
            await department.openDepartmentAddForm();
            await department.fillFormInputInformation(departmentSchema, {});
            await department.submitButton();
            await department.checkAllMandatoryInputErrors(departmentSchema);
        });

        // add new department
        await test.step('Add Department with valid details', async () => {
            data.name = 'Test' + generateRandomNumber();
            await department.fillFormInputInformation(departmentSchema, data);
            await department.submitButton();
            data.date = new Date().toDateString();
        });

        let dataForValidation: DepartmentCreationData = {
            NAME: data.name,
            'PARENT DEPARTMENT': data.parent_id,
            // 'APPROVAL MANAGER': data.manager_id,
            'ADDED AT': formatDate(data.date) + ' ',
            status: 'Active',
        };

        await test.step('Check Department Addition', async () => {
            // check if department is present in all tab
            await department.tabHelper.clickTab('All');

            await department.verifyIfPresent({
                data: dataForValidation,
                present: true,
            });

            // check if department is present in active tab
            await department.navigateToTab('Active');
            await department.verifyIfPresent({
                data: dataForValidation,
                present: true,
            });

            // check if department is not present in inactive tab
            await department.navigateToTab('Inactive');
            await department.verifyIfPresent({
                data: dataForValidation,
                present: false,
            });
        });

        // check if page is redirected to department details page
        await test.step('Check Department Details Page', async () => {
            await department.navigateTo('DEPARTMENTS');
            await department.tabHelper.clickTab('All');
            await department.listingHelper.openDetailsPage(data.name, 'NAME');
        });

        // // check toggle status functionality
        await test.step('Check Department status change', async () => {
            // toggle status of the department
            await department.setStatus(data.name, 'Inactive');
            dataForValidation.status = 'Inactive';

            // verify deparment is not present in active tab
            await department.tabHelper.clickTab('Active');

            await department.verifyIfPresent({
                data: dataForValidation,
                present: false,
            });

            // verify deparment is present in inactive tab
            await department.tabHelper.clickTab('Inactive');
            await department.verifyIfPresent({
                data: dataForValidation,
                present: true,
            });

            // toggle status of the department
            await department.setStatus(data.name, 'Active');
            dataForValidation.status = 'Active';

            // verify deparment is present in active tab
            await department.tabHelper.clickTab('Active');
            await department.verifyIfPresent({
                data: dataForValidation,
                present: true,
            });

            // verify deparment is not present in inactive tab
            await department.tabHelper.clickTab('Inactive');
            await department.verifyIfPresent({
                data: dataForValidation,
                present: false,
            });
        });

        // // check parent department form field
        await test.step('Check Parent Department in form', async () => {
            await department.openDepartmentAddForm();
            await department.checkParentDepartment();
        });

        // // check save and create another
        await test.step('Check Save and Create Another', async () => {
            await page.getByLabel('save and create another').click();
            for (let i = 0; i < 2; i++) {
                await department.fillFormInputInformation(departmentSchema, {
                    name: data.name + generateRandomNumber(),
                    parent_id: data.parent_id,
                    manager_id: data.manager_id,
                });

                await department.submitButton();
                await department.checkSaveAndCreateAnother();
                await page.waitForTimeout(1000);
            }
        });
    });

    PROCESS_TEST('TDD001', async ({ page }) => {
        let employeeData: EmployeeCreationData = {
            name: 'Employee' + generateRandomNumber(),
            manager_id: 'newtestauto@company.com',
            identifier: 'E' + generateRandomNumber(),
            email: 'employee' + generateRandomNumber() + '@company.com',
            designation_id: 'aa',
        };

        let employeeColumnData: EmployeeCreationData = {
            name: employeeData.name,
            identifier: employeeData.identifier,
            designation: employeeData.designation_id,
            email: employeeData.email,
        };

        const employeeSchema = {
            name: {
                type: 'text',
                required: true,
            },
            email: {
                type: 'email',
                required: true,
            },
            identifier: {
                type: 'text',
                required: true,
            },
            manager_id: {
                type: 'reference_select',
                required: true,
            },
            designation_id: {
                type: 'reference_select',
                required: true,
            },
        };

        const departmentDetails = new DepartmentDetails(page);
        await departmentDetails.init();

        await test.step('Check Department Details', async () => {
            Logger.info('Department Details Page Info Checking');
            await departmentDetails.listingHelper.openDetailsPage(
                data.name,
                'NAME'
            );
            await departmentDetails.validateDetailsPage(data);
            Logger.success('Department Details Page Info Checked');
        });

        await test.step('Check Edit Department', async () => {
            Logger.info('Department Details Edit Checking');

            await departmentDetails.openEditForm();
            const newDepartmentData: DepartmentCreationData = {
                name: 'Test' + generateRandomNumber(),
                manager_id: 'Ravi',
                parent_id: 'Sales',
            };

            // fill update form
            await departmentDetails.fillFormInputInformation(
                departmentSchema,
                newDepartmentData
            );
            await departmentDetails.submitButton();
            await page.waitForTimeout(100);
            await page.waitForLoadState('networkidle');
            await departmentDetails.validateDetailsPage(newDepartmentData);
            Logger.success('Department Details Edit Checked');
        });

        await test.step('Check Action ', async () => {
            Logger.info('Action Button Checking');
            await departmentDetails.detailsHelper.checkActionButtonOptions([
                'Employee Add',
                'Add Notes',
                'Add Documents',
            ]);
            Logger.success('Action Button Checked');
        });

        await test.step('Check Employee Addition', async () => {
            Logger.info('Employee Addition Checking');
            await departmentDetails.detailsHelper.openActionButtonItem(
                'Employee Add'
            );
            await departmentDetails.fillFormInputInformation(
                employeeSchema,
                employeeData
            );
            await departmentDetails.submitButton();
            await departmentDetails.verifyEmployeeAddition(employeeColumnData);
            Logger.success('Employee Addition Checked');
        });

        await test.step('Check Documents Addition', async () => {
            Logger.info('Documents Addition Checking');
            const document = {
                imagePath: 'pan-card.jpg',
                comment: 'test' + generateRandomNumber(),
                date: new Date(),
            };
            await departmentDetails.addDocument(document);
            await departmentDetails.verifyDocumentAddition(document);
            Logger.success('Documents Addition Checked');
        });

        await test.step('Check Notes Addition and Errors', async () => {
            Logger.info('Notes Addition and Errors Checking');
            let note = {
                comments: '',
                date: new Date(),
            };

            const notesSchema = {
                comments: {
                    type: 'textarea',
                    required: true,
                },
            };

            await departmentDetails.detailsHelper.openActionButtonItem(
                'Add Notes'
            );

            // check errors
            await departmentDetails.fillFormInputInformation(notesSchema, note);
            await departmentDetails.submitButton();
            await departmentDetails.checkMandatoryFields(notesSchema);

            // add note
            note.comments = 'test' + generateRandomNumber();
            await departmentDetails.fillFormInputInformation(notesSchema, note);
            await departmentDetails.submitButton();

            await departmentDetails.verifyNoteAddition(note);
            Logger.success('Notes Addition and Errors Checked');
        });
    });
});
