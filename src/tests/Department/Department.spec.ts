import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DepartmentDetails } from '@/helpers/DepartmentHelper/DepartmentDetails.helper';
import { DepartmentCreation } from '@/helpers/DepartmentHelper/DepartmentCreation.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });

describe('HR -> Department Creation and Details Verification', () => {
    let data: DepartmentCreationData = {
        name: 'Department' + generateRandomNumber(),
        parent: 'Sales',
        manager: 'Ravi',
        date: new Date().toDateString(),
    };
    PROCESS_TEST('TDC001', async ({ page }) => {
        const department = new DepartmentCreation(page);
        await department.init();

        // check name error
        await test.step('Check errors', async () => {
            await department.openDepartmentAddForm();
            await department.fillDepartment({
                name: '',
                parent: data.parent,
                manager: data.manager,
            });
        });

        // add new department
        await test.step('Add Department with valid details', async () => {
            await department.fillDepartment({
                name: data.name,
                parent: data.parent,
                manager: data.manager,
            });
            data.date = new Date().toDateString();
        });

        await test.step('Check Department Addition', async () => {
            // check if department is present in all tab
            await department.tabHelper.clickTab('All');

            await department.verifyIfPresent({
                data: data,
                present: true,
                status: 'Active',
            });

            // check if department is present in active tab
            await department.navigateToTab('Active');
            await department.verifyIfPresent({
                data: data,
                present: true,
                status: 'Active',
            });

            // check if department is not present in inactive tab
            await department.navigateToTab('Inactive');
            await department.verifyIfPresent({
                data: data,
                present: false,
                status: 'Active',
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

            // verify deparment is not present in active tab
            await department.tabHelper.clickTab('Active');
            await department.verifyIfPresent({
                data: data,
                present: false,
                status: 'Inactive',
            });

            // verify deparment is present in inactive tab
            await department.tabHelper.clickTab('Inactive');

            await department.verifyIfPresent({
                data: data,
                present: true,
                status: 'Inactive',
            });

            // toggle status of the department
            await department.setStatus(data.name, 'Active');

            // verify deparment is present in active tab
            await department.tabHelper.clickTab('Active');
            await department.verifyIfPresent({
                data: data,
                present: true,
                status: 'Active',
            });

            // verify deparment is not present in inactive tab
            await department.tabHelper.clickTab('Inactive');
            await department.verifyIfPresent({
                data: data,
                present: false,
                status: 'Active',
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
                await department.fillDepartment({
                    name: data.name + generateRandomNumber(),
                    parent: data.parent,
                    manager: data.manager,
                });
                await department.checkSaveAndCreateAnother();
                await page.waitForTimeout(1000);
            }
        });
    });

    PROCESS_TEST('TDD001', async ({ page }) => {
        let employeeData: EmployeeCreationData = {
            name: 'Employee' + generateRandomNumber(),
            manager: 'newtestauto@company.com',
            identifier: 'E' + generateRandomNumber(),
            email: 'employee' + generateRandomNumber() + '@company.com',
            designation: 'aa',
        };

        // const department: DepartmentCreationData = {
        //     name: 'Testt',
        //     manager: 'Ravi',
        //     parent: 'Sales',
        // };

        const departmentDetails = new DepartmentDetails(page);
        await departmentDetails.init();
        await page.waitForURL(LISTING_ROUTES.DEPARTMENTS);

        await test.step('Check Department Details', async () => {
            console.log(chalk.blue('Department Details Page Info Checking'));
            await departmentDetails.listingHelper.openDetailsPage(
                data.name,
                'NAME'
            );
            await departmentDetails.validateDetailsPage(data);
            console.log(chalk.green('Department Details Page Info Checked'));
        });

        await test.step('Check Edit Department', async () => {
            console.log(chalk.blue('Department Details Edit Checking'));

            await departmentDetails.openEditForm();
            const newDepartmentData: DepartmentCreationData = {
                name: 'Test' + generateRandomNumber(),
                manager: 'Vasant kishore',
                parent: 'Test',
            };

            // fill update form
            await departmentDetails.fillDepartment(
                {
                    name: newDepartmentData.name,
                    parent: newDepartmentData.parent,
                    manager: newDepartmentData.manager,
                },
                true
            );
            await page.waitForTimeout(100);
            await page.waitForLoadState('networkidle');
            await departmentDetails.validateDetailsPage(newDepartmentData);
            console.log(chalk.green('Department Details Edit Checked'));
        });

        await test.step('Check Action ', async () => {
            console.log(chalk.blue('Action Button Checking'));
            await departmentDetails.detailsHelper.checkActionButtonOptions([
                'Employee Add',
                'Add Notes',
                'Add Documents',
            ]);
            console.log(chalk.green('Action Button Checked'));
        });

        await test.step('Check Employee Addition', async () => {
            console.log(chalk.blue('Employee Addition Checking'));
            await departmentDetails.addEmployee(employeeData);
            await departmentDetails.verifyEmployeeAddition(employeeData);
            console.log(chalk.green('Employee Addition Checked'));
        });

        await test.step('Check Documents Addition', async () => {
            console.log(chalk.blue('Documents Addition Checking'));
            const document = {
                imagePath: 'pan-card.jpg',
                comment: 'test' + generateRandomNumber(),
                date: new Date(),
            };
            await departmentDetails.addDocument(document);
            await departmentDetails.verifyDocumentAddition(document);
            console.log(chalk.green('Documents Addition Checked'));
        });

        await test.step('Check Notes Addition and Errors', async () => {
            console.log(chalk.blue('Notes Addition and Errors Checking'));
            let note = {
                title: '',
                date: new Date(),
            };
            await departmentDetails.detailsHelper.openActionButtonItem(
                'Add Notes'
            );
            await departmentDetails.addNotes(note);
            note.title = 'test' + generateRandomNumber();
            await departmentDetails.addNotes(note);
            await departmentDetails.verifyNoteAddition(note);
            console.log(chalk.green('Notes Addition and Errors Checked'));
        });
    });
});
