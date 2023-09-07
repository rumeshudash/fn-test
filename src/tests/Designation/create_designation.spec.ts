import { TEST_URL } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DesignationHelper } from '@/helpers/DesignationHelper/designation.helper';
import { designationInfo } from '@/utils/required_data';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;

describe('TDE001', () => {
    PROCESS_TEST('Save and Create Designation', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        await designation.init();
        await designation.addDesignation();
        await designation.verifyDialog();
        await designation.fillNameField();
        await designation.saveAndCreateCheckbox();
        await designation.clickButton('Save');
        expect(
            await designation.toastMessage(),
            'Toast Message not shown'
        ).toBe('Successfully saved ');
        await designation.verifyEmptyField();
    });

    PROCESS_TEST('Create Designation', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        await designation.init();
        await designation.addDesignation();
        await designation.verifyDialog();
        await designation.fillNameField();
        await designation.clickButton('Save');
        expect(
            await designation.toastMessage(),
            'Toast Message not shown'
        ).toBe('Successfully saved ');
        await designation.searchDesignation();
        await designation.verifyItemInList();
        await designation.clickDesignationList();
        await designation.verifyDesignationPage();
    });

    PROCESS_TEST('Change Designation Status', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        await designation.init();
        // await designation.changeTab('Inactive');
        await designation.searchDesignation();
        await designation.changeStatus();
        await designation.verifyChangeStatus();
        await designation.changeTab('Active');
        await designation.searchDesignation();
        await designation.verifyChangeStatus();

        await test.step('Verifying All Tab', async () => {
            await designation.changeTab('All');
            await designation.searchDesignation();

            expect(
                page.getByRole('link', {
                    name: designationInfo.name,
                    exact: true,
                }),
                'Designation Name does not found'
            ).toBeVisible();
        });
    });

    PROCESS_TEST('Test Action Designation', async ({ page }) => {
        const designation = new DesignationHelper(designationInfo, page);
        await designation.init();
        await designation.searchDesignation();
        await designation.clickAction();
        await designation.designationInfo(designationInfo.updateName);
        await designation.fillNameField();
        await designation.clickButton('Save');
        expect(
            await designation.toastMessage(),
            'Toast Message not shown'
        ).toBe('Successfully saved ');
        await designation.changeTab('All');
        await designation.searchDesignation();
        await designation.verifyItemInList();
    });
});
