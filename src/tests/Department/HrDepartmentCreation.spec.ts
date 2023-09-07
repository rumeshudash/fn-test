import { PROCESS_TEST } from '@/fixtures';
import { DepartmentCreation } from '@/helpers/DepartmentHelper/DepartmentCreation.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;

describe('TDC001', () => {
    PROCESS_TEST('Department Creation', async ({ page }) => {
        let data: DepartmentCreationData = {
            name: 'Department' + generateRandomNumber(),
            parent: 'Sales',
            manager: 'newtestauto@company.com',
            date: new Date(),
        };

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
            data.date = new Date();
        });

        await test.step('Check Department Addition', async () => {
            // get all possible rows with pagination
            await department.toggleAll();

            // check if department is present in all tab
            await department.navigateToTab('All');
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
            await department.navigateToTab('All');
            await department.openDepartmentDetailsPage(data.name);
        });

        // check toggle status functionality
        await test.step('Check Department status change', async () => {
            // toggle status of the department
            await department.toggleStatus(data.name, 'Inactive');

            // verify deparment is not present in active tab
            await department.navigateToTab('Active');
            await department.verifyIfPresent({
                data: data,
                present: false,
                status: 'Inactive',
            });

            // verify deparment is present in inactive tab
            await department.navigateToTab('Inactive');
            await department.verifyIfPresent({
                data: data,
                present: true,
                status: 'Inactive',
            });

            // toggle status of the department
            await department.toggleStatus(data.name, 'Active');

            // verify deparment is present in active tab
            await department.navigateToTab('Active');
            await department.verifyIfPresent({
                data: data,
                present: true,
                status: 'Active',
            });

            // verify deparment is not present in inactive tab
            await department.navigateToTab('Inactive');
            await department.verifyIfPresent({
                data: data,
                present: false,
                status: 'Active',
            });
        });

        // check parent department form field
        await test.step('Check Parent Department in form', async () => {
            await department.openDepartmentAddForm();
            await department.checkParentDepartment();
        });

        // check save and create another
        await test.step('Check Save and Create Another', async () => {
            await page.getByLabel('save and create another').click();
            for (let i = 0; i < 2; i++) {
                await department.fillDepartment({
                    name: data.name + generateRandomNumber(),
                    parent: data.parent,
                    manager: data.manager,
                });
                await department.checkSaveAndCreateAnother();
            }
        });
    });
});
