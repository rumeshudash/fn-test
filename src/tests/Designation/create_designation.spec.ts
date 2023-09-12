import { TEST_URL } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { FormHelper } from '@/helpers/BaseHelper/form.helper';
import {
    CreateDesignationHelper,
    DesignationHelper,
} from '@/helpers/DesignationHelper/designation.helper';
import {
    designationInfo,
    designationInfo_Save_And_Create,
    designationUpdateInfo,
} from '@/utils/required_data';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe('TDE001', () => {
    PROCESS_TEST('Save and Create Designation', async ({ page }) => {
        const designation = new DesignationHelper(
            designationInfo_Save_And_Create,
            page
        );
        const designationCreate = new CreateDesignationHelper(
            designationInfo,
            page
        );
        const formHelper = new FormHelper(page);
        await designation.init();
        await designationCreate.addDesignation();
        await designation.verifyDialog();
        await designation.fillNameField();
        await designationCreate.saveAndCreateCheckbox();
        await designation.clickButton('Save');
        // expect(
        await designation.notification.checkToastSuccess('Successfully saved');
        //     chalk.red('Toast Message match')
        // ).toBe('Successfully saved ');
        await formHelper.isInputFieldEmpty('name');
    });

    PROCESS_TEST('Create Designation', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        const designationCreate = new CreateDesignationHelper(
            designationInfo,
            page
        );
        await designation.init();
        await designationCreate.addDesignation();
        await designation.verifyDialog();
        await designation.fillNameField();
        await designation.clickButton('Save');
        await designation.notification.checkToastSuccess('Successfully saved');
        // expect(
        //     await designation.toastMessage(),
        //     chalk.red('Toast Message match')
        // ).toBe('Successfully saved ');
        await designation.searchDesignation();
        await designation.verifyItemInList();
        await designation.clickDesignationName();
        await designation.verifyDesignationPage();
    });

    PROCESS_TEST('Change Designation Status', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        const designationCreate = new CreateDesignationHelper(
            designationInfo,
            page
        );
        await designation.init();
        await designation.searchDesignation();
        //Change from Active to Inactive
        await designationCreate.changeStatus('Active');

        await test.step('Verify Inactive Tab', async () => {
            //Change from Inactive to Active
            await designation.changeTab('Inactive');
            await designation.searchDesignation();
            await designationCreate.verifyChangeStatus('Inactive');

            // await designationCreate.changeStatus('Inactive');
            // await designation.changeTab('Active');
            // await designationCreate.verifyChangeStatus('Active');
        });

        await test.step('Verify Active Tab', async () => {
            await designationCreate.changeStatus('Inactive');
            await designation.changeTab('Active');
            await designationCreate.verifyChangeStatus('Active');
        });

        await test.step('Verifying All Tab', async () => {
            await designation.changeTab('All');
            await designation.searchDesignation();

            await expect(
                page.getByRole('link', {
                    name: designationInfo.name,
                    exact: true,
                }),
                chalk.red('Designation Name visibility')
            ).toBeVisible();
        });
    });

    PROCESS_TEST('Test Action Designation', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        const updateDesignation = new DesignationHelper(
            designationUpdateInfo,
            page
        );
        await designation.init();
        await designation.searchDesignation();
        await designation.changeTab('All');
        await designation.clickAction();

        await updateDesignation.fillNameField();
        await designation.clickButton('Save');
        await designation.notification.checkToastSuccess('Successfully saved');
        // expect(
        //     await designation.toastMessage(),
        //     chalk.red('Toast Message match')
        // ).toBe('Successfully saved ');
        await designation.changeTab('All');
        await updateDesignation.searchDesignation();
        await updateDesignation.verifyItemInList();
    });
});
