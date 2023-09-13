import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DepartmentDetails } from '@/helpers/DepartmentHelper/DepartmentDetails.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe('TDD001', () => {
    PROCESS_TEST('Department Details Verification', async ({ page }) => {
        let employeeData: EmployeeCreationData = {
            name: 'Employee' + generateRandomNumber(),
            manager: 'newtestauto@company.com',
            identifier: 'E' + generateRandomNumber(),
            email: 'employee' + generateRandomNumber() + '@company.com',
            designation: 'aa',
        };

        const department: DepartmentCreationData = {
            name: 'Testt',
            manager: 'Ravi',
            parent: 'Sales',
        };

        const departmentDetails = new DepartmentDetails(page);
        await departmentDetails.init();
        await page.waitForURL(LISTING_ROUTES.DEPARTMENTS);

        await test.step('Check Department Details', async () => {
            console.log(chalk.blue('Department Details Page Info Checking'));
            await departmentDetails.listingHelper.openDetailsPage(
                department.name,
                'NAME'
            );
            await departmentDetails.validateDetailsPage(department);
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
