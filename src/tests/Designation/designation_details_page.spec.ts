import { PROCESS_TEST } from '@/fixtures';
import {
    DesignationDetailsPageHelper,
    DesignationHelper,
} from '@/helpers/DesignationHelper/designation.helper';
import {
    designationInfo,
    designation_details_page_Info,
    employeeInfo,
} from '@/utils/required_data';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe('TDD001', () => {
    PROCESS_TEST('Verify Details Page', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        const detailsPage = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );
        await designation.init();
        await designation.searchDesignation();
        await designation.changeTab('All');
        await designation.clickDesignationName();
        await designation.verifyDesignationPage();

        await test.step('Verifying Options', async () => {
            await detailsPage.verifyOptions();
        });
    });

    PROCESS_TEST('Edit Options check', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        const detailsPage = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );
        const detailsPageEdit = new DesignationHelper(
            designation_details_page_Info,
            page
        );

        await test.step('Edit name from details page', async () => {
            await designation.init();
            await designation.searchDesignation();
            await designation.changeTab('All');
            await designation.clickDesignationName();
            await detailsPage.clickEditIcon();

            await detailsPageEdit.fillNameField();
            await designation.clickButton('Save');

            expect(
                await designation.toastMessage(),
                chalk.red('ToastMessage match')
            ).toBe('Successfully saved ');
        });
    });

    PROCESS_TEST('Action Options check', async ({ page }) => {
        const detailsPage = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );
        await test.step('Verifying Action Options', async () => {
            const designation = new DesignationHelper(
                designation_details_page_Info,
                page
            );
            await designation.init();
            await designation.searchDesignation();
            await designation.changeTab('All');
            await designation.clickDesignationName();
            await detailsPage.clickActionButton();
            await detailsPage.verifyActionOptions('Add Employee');
            await detailsPage.verifyActionOptions('Add Notes');
            await detailsPage.verifyActionOptions('Add Documents');
        });
    });

    PROCESS_TEST('Verify then Fill Employee Form', async ({ page }) => {
        const designation = new DesignationHelper(
            designation_details_page_Info,
            page
        );
        const detailsPage = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );
        await designation.init();
        await designation.searchDesignation();
        await designation.changeTab('All');
        await designation.clickDesignationName();
        await detailsPage.clickActionButton();

        await test.step('Verify Employee Form Field', async () => {
            await detailsPage.clickActionOption('Add Employee');
            await detailsPage.verifyAddEmployeeForm('Name');
            await detailsPage.verifyAddEmployeeForm('Email');
            await detailsPage.verifyAddEmployeeForm('Employee Code');
            await detailsPage.verifyAddEmployeeForm('Department');
            await detailsPage.verifyAddEmployeeForm('Designation');
            await detailsPage.verifyAddEmployeeForm('Grade');
            await detailsPage.verifyAddEmployeeForm('Reporting Manager');
            await detailsPage.verifyAddEmployeeForm('Approval Manager');
        });

        await test.step('Fill Employee Form Field', async () => {
            await detailsPage.fillEmployeeForm();
            await detailsPage.clickButton('Save');
        });

        await test.step('Verify Employee Tab Details', async () => {
            await detailsPage.verifyEmployeeTabDetails();
        });
    });

    PROCESS_TEST('Add Notes', async ({ page }) => {
        const detailsPage = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );
        const designation = new DesignationHelper(
            designation_details_page_Info,
            page
        );
        await designation.init();
        await designation.searchDesignation();
        await designation.changeTab('All');
        await designation.clickDesignationName();
        await detailsPage.clickActionButton();

        await test.step('Add Notes', async () => {
            await detailsPage.clickActionOption('Add Notes');
            await detailsPage.addNotes();
            await detailsPage.clickButton('Save');
        });

        await test.step('Verify Notes Tab Details', async () => {
            await detailsPage.verifyNotesTabDetails();
        });
    });

    PROCESS_TEST('Add Documents', async ({ page }) => {
        const detailsPage = new DesignationDetailsPageHelper(
            designation_details_page_Info,
            page
        );
        const designation = new DesignationHelper(
            designation_details_page_Info,
            page
        );
        const detailsPageUploadDocuments = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );
        await designation.init();
        await designation.searchDesignation();
        await designation.changeTab('All');
        await designation.clickDesignationName();
        await detailsPage.clickActionButton();

        await test.step('Upload Documents', async () => {
            await detailsPage.clickActionOption('Add Documents');
            await detailsPageUploadDocuments.uploadDocuments();
            // await detailsPage.clickButton('Save');
        });
        await test.step('Verify Documents Tab Details', async () => {
            await detailsPageUploadDocuments.verifyDocumentsTabDetails();
        });
    });
});
