import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DepartmentDetails } from '@/helpers/DepartmentHelper/DepartmentDetails.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe('TDD001', () => {
    PROCESS_TEST('Department Details Verification', async ({ page }) => {
        let data: EmployeeCreationData = {
            name: 'Employee' + generateRandomNumber(),
            manager: 'newtestauto@company.com',
            identifier: 'E' + generateRandomNumber(),
            email: 'employee' + generateRandomNumber() + '@company.com',
            designation: 'aa',
        };

        const department: DepartmentCreationData = {
            name: 'Department128639490360',
            identifier: 'department128639490360',
            manager: 'Ravi',
            parent: 'Sales',
        };

        const departmentDetails = new DepartmentDetails(page);
        await departmentDetails.init();
        await page.waitForURL(LISTING_ROUTES.DEPARTMENTS);

        await test.step('Check Department Details', async () => {
            console.log(chalk.blue('Department Details Page Info Checking'));
            await departmentDetails.openDepartmentDetailsPage(department.name);
            await departmentDetails.checkDepartmentDetailsDisplay({
                name: department.name,
                identifier: department.identifier,
                manager: department.manager,
            });
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
            await departmentDetails.checkDepartmentDetailsDisplay({
                name: newDepartmentData.name,
                identifier: department.identifier,
                parent: newDepartmentData.parent,
                manager: newDepartmentData.manager,
            });

            console.log(chalk.green('Department Details Edit Checked'));
        });

        await test.step('Check Action ', async () => {
            console.log(chalk.blue('Action Button Checking'));
            await departmentDetails.openAndVerifyActionButton();
            await page.locator('html').click();
            console.log(chalk.green('Action Button Checked'));
        });

        await test.step('Check Employee Addition', async () => {
            console.log(chalk.blue('Employee Addition Checking'));
            await departmentDetails.addEmployee(data);
            await departmentDetails.verifyEmployeeAddition(data);
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
            await departmentDetails.addNotes(note, false);
            note.title = 'test' + generateRandomNumber();
            await departmentDetails.addNotes(note, true);
            await departmentDetails.verifyNoteAddition(note);
            console.log(chalk.green('Notes Addition and Errors Checked'));
        });
    });
});
