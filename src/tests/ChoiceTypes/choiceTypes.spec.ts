import { PROCESS_TEST } from '@/fixtures';
import { ChoiceTypeHelper } from '@/helpers/ChoiceTypeHelper/choiceType.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { expect } from '@playwright/test';
const { describe } = PROCESS_TEST;

describe('Configuration -> Choice Types', () => {
    const choiceTypeInfo = {
        name: 'choice-type-' + generateRandomNumber(),
        description: 'description' + generateRandomNumber(),
    };
    const choiceTypeInfoTemp = {
        name: 'choice-type-' + generateRandomNumber(),
        description: 'description' + generateRandomNumber(),
    };

    PROCESS_TEST('TCT001 - Choice Types', async ({ page }) => {
        const choiceTypeHelper = new ChoiceTypeHelper(page);
        const formHelper = choiceTypeHelper.formHelper;
        const notificationHelper = choiceTypeHelper.notificationHelper;
        const statusHelper = choiceTypeHelper.statusHelper;
        const tabHelper = choiceTypeHelper.tabHelper;

        // Open Choice Type Page
        await choiceTypeHelper.init();

        await PROCESS_TEST.step('Add Choice Type form', async () => {
            // Click Add Choice type
            await choiceTypeHelper.openChoiceTypeForm();

            // Check Choice Type form is opened
            await formHelper.checkTitle('Add Choice Type');
        });

        // Fill Description and leave name field empty and verify error message is displaying
        await PROCESS_TEST.step('Verify Filling Description only', async () => {
            await choiceTypeHelper.fillChoiceTypeForm({
                description: 'description-' + generateRandomNumber(),
            });
            await formHelper.submitButton();

            await formHelper.checkIsInputHasErrorMessage('Name is required', {
                name: 'name',
            });
            await formHelper.closeForm();
            await formHelper.dialogHelper.clickConfirmDialogAction('Yes!');
        });

        // Fill name and leave description field empty and verify error message is displaying
        await PROCESS_TEST.step('Verify Filling Name only', async () => {
            await choiceTypeHelper.openChoiceTypeForm();
            await choiceTypeHelper.fillChoiceTypeForm({
                name: 'choice-type-' + generateRandomNumber(),
            });
            await formHelper.submitButton();

            await formHelper.checkIsInputHasErrorMessage(
                'Description is required',
                {
                    name: 'description',
                    type: 'textarea',
                }
            );

            await formHelper.closeForm();
            await formHelper.dialogHelper.clickConfirmDialogAction('Yes!');
        });

        // Leave both field empty and verify error message is displaying
        await PROCESS_TEST.step('Leaving both field empty', async () => {
            await choiceTypeHelper.openChoiceTypeForm();
            await formHelper.submitButton();

            await formHelper.checkIsInputHasErrorMessage('Name is required', {
                name: 'name',
            });
            await formHelper.checkIsInputHasErrorMessage(
                'Description is required',
                {
                    name: 'description',
                    type: 'textarea',
                }
            );

            await formHelper.closeForm();
            await formHelper.dialogHelper.clickConfirmDialogAction('Yes!');
        });

        // Fill both field
        // Check "save and create another" checkbox
        // Click Save
        await PROCESS_TEST.step(
            'Fill Mandatory fields with Save and Create another',
            async () => {
                await choiceTypeHelper.openChoiceTypeForm();
                await choiceTypeHelper.fillChoiceTypeForm(choiceTypeInfoTemp);
                await formHelper.saveAndCreateCheckbox();
                await formHelper.submitButton();
                await notificationHelper.checkToastSuccess(
                    'Successfully saved'
                );
            }
        );

        // Check if all fields are empty and form open.
        await PROCESS_TEST.step(
            'Check if all fields are empty and form open',
            async () => {
                await formHelper.checkTitle('Add Choice Type');
                await formHelper.checkIsInputFieldEmpty('name');
                await formHelper.checkIsInputFieldEmpty(
                    'description',
                    'textarea'
                );
                await formHelper.closeForm();
            }
        );

        // Now without checking "save and create another" fill all fields and click save
        // Verify 'Choice Type created successfully' toast message.
        await PROCESS_TEST.step(
            'Fill Mandatory fields without Save and Create another',
            async () => {
                await choiceTypeHelper.openChoiceTypeForm();
                await choiceTypeHelper.fillChoiceTypeForm(choiceTypeInfo);
                await formHelper.submitButton();
                await notificationHelper.checkToastSuccess(
                    'Successfully saved'
                );
            }
        );

        // Verify current information is displaying in table.
        await PROCESS_TEST.step(
            'Verify Current information is displaying in table',
            async () => {
                await choiceTypeHelper.verifyChoiceTypeList(choiceTypeInfo);
            }
        );

        // Verify Tabs: All, active, inactive
        await PROCESS_TEST.step(
            'Verify Tabs "All", "active", "inactive" are available',
            async () => {
                tabHelper.checkTabExists(['All', 'Active', 'Inactive']);
            }
        );

        // Verify Columns: Name, Description, Status, Added At and action
        await PROCESS_TEST.step(
            'Verify Columns "Name", "Description", "Status", "Added At" and "Action" are visible',
            async () => {
                await choiceTypeHelper.checkTableColumnsExist([
                    'NAME',
                    'DESCRIPTION',
                    'STATUS',
                    'ADDED AT',
                    'ACTION',
                ]);
            }
        );

        // Verify that the choice type in table is clickable and redirects to choice type details page
        await PROCESS_TEST.step(
            'Verify that the choice type in table is clickable and redirects to choice type details page',
            async () => {
                await choiceTypeHelper.openDetailsPage(
                    choiceTypeInfo.name,
                    'NAME'
                );
            }
        );

        // Locate choice type and change status to inactive and check its showing in inactive tab.
        await PROCESS_TEST.step(
            'Locate choice type and change status to inactive and check its showing in inactive tab',
            async () => {
                await choiceTypeHelper.init();
                await statusHelper.setStatus(choiceTypeInfo.name, 'Inactive');
                await tabHelper.clickTab('Inactive');
                const row = await choiceTypeHelper.findRowInTable(
                    choiceTypeInfo.name,
                    'NAME'
                );
                await expect(row).toBeVisible();
            }
        );

        // Similarly Locate choice type and change status to active and check its showing in active tab.
        await PROCESS_TEST.step(
            'Similarly Locate choice type and change status to active and check its showing in active tab',
            async () => {
                await statusHelper.setStatus(choiceTypeInfo.name, 'Active');
                await tabHelper.clickTab('Active');
                const row = await choiceTypeHelper.findRowInTable(
                    choiceTypeInfo.name,
                    'NAME'
                );
                await expect(row).toBeVisible();
                await tabHelper.clickTab('All');
            }
        );

        // Verify edit icon is located in Action column and click on it
        await PROCESS_TEST.step(
            'Similarly Locate choice type and change status to active and check its showing in active tab',
            async () => {
                const row = await choiceTypeHelper.findRowInTable(
                    choiceTypeInfo.name,
                    'NAME'
                );
                const editButton = await choiceTypeHelper.getCellButton(
                    row,
                    'ACTION'
                );
                await expect(editButton).toBeEnabled();
                await editButton.click();
                await page.waitForTimeout(1000);
                await page.waitForLoadState('networkidle');
            }
        );

        // Check if all information is editable
    });
    PROCESS_TEST.afterEach(async ({ page }) => {
        const choiceTypeHelper = new ChoiceTypeHelper(page);

        await choiceTypeHelper.init();
        await choiceTypeHelper.searchInList(choiceTypeInfo.name);
        await choiceTypeHelper.statusHelper.setStatus(
            choiceTypeInfo.name,
            'Inactive'
        );

        // Deactivate temp choice type
        await choiceTypeHelper.searchInList(choiceTypeInfoTemp.name);
        await choiceTypeHelper.statusHelper.setStatus(
            choiceTypeInfoTemp.name,
            'Inactive'
        );
    });
});
