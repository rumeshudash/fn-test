import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Configurations-Custom Feilds', () => {
    PROCESS_TEST('TCF001- Vendor -Negative', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        const dialog = await customefeild.dialogHelper;

        await PROCESS_TEST.step('Check page is opening', async () => {
            await expect(page.getByText('Custom')).toHaveCount(1);
        });

        await PROCESS_TEST.step('Check Vendor Tab', async () => {
            await customefeild.clickExpenseTab('Vendor');
        });

        await PROCESS_TEST.step('Check Add New Button', async () => {
            await customefeild.clickButton('Add New');

            expect(await dialog.getDialogTitle()).toBe(
                'Add Vendor Custom Field'
            );
        });

        await PROCESS_TEST.step('Add Vendor With Empty Feilds', async () => {
            await customefeild.clickButton('Save');
        });

        await PROCESS_TEST.step('Without Name feilds', async () => {
            await dialog.closeDialog();

            await customefeild.clickButton('Yes!');

            await customefeild.clickButton('Add New');
            await customefeild.addExpenseCustomeFeild('', 'Text', 1);

            const notification = await customefeild.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Field Name is required'
            );
        });

        await PROCESS_TEST.step('Without Type feilds', async () => {
            await dialog.closeDialog();

            await customefeild.clickButton('Yes!');

            await customefeild.clickButton('Add New');
            await customefeild.addExpenseCustomeFeild('Test1', '', 1);
            const notification = await customefeild.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Field Type is required'
            );
        });
    });

    PROCESS_TEST('TCF002 - Add Vendor - Positive Case', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();

        await PROCESS_TEST.step('Add Vendor With Text Type', async () => {
            await customefeild.clickExpenseTab('Vendor');

            await customefeild.clickButton('Add New');

            await customefeild.addExpenseWithTextType(
                name + 'abc',
                'Text',
                1,
                'Test1'
            );
        });
        await PROCESS_TEST.step('Add Vendor With Boolean', async () => {
            await customefeild.clickButton('Add New');
            await customefeild.addExpenseWitBooleanType(
                name + 'abcd',
                'Boolean',
                1,
                'True'
            );
        });

        await PROCESS_TEST.step('Add Vendor With Number type', async () => {
            await customefeild.clickButton('Add New');
            await customefeild.addExpenseWithTextType(
                name + 'abce',
                'Number',
                1,
                123
            );
        });

        await PROCESS_TEST.step('Add Vendor With Date type', async () => {
            await customefeild.clickButton('Add New');
            await customefeild.addExpenseWithDateType(name + 'abcf', 'Date', 1);
        });
        await PROCESS_TEST.step('Add Vendor With TextArea', async () => {
            await customefeild.clickButton('Add New');
            await customefeild.addExpenseWithTextType(
                name + 'abcg',
                'TextArea',
                1,
                'Test1'
            );
        });

        await PROCESS_TEST.step('Change Status', async () => {
            await customefeild.changeStatus(name + 'abc');
        });

        await PROCESS_TEST.step('Change Mendatory', async () => {
            await customefeild.changeMendatory(name + 'abc');
        });

        await PROCESS_TEST.step('Check Editable', async () => {
            await customefeild.checkEdit(name + 'abc');
        });

        await PROCESS_TEST.step('Name and Priority Change', async () => {
            const newName = await CustofeildHelper.generateRandomGradeName();

            await customefeild.changeNameORPriority(
                name + 'abc',
                'Text',
                1,
                newName,
                2
            );
        });

        await PROCESS_TEST.step(
            'Check with existing name and type ',
            async () => {
                await customefeild.clickButton('Add New');
                await customefeild.addExpenseWithTextType(
                    name + 'abc',
                    'Text',
                    1,
                    'Test1'
                );

                const notification = await customefeild.notificationHelper;

                expect(await notification.getErrorMessage()).toBe(
                    'There is already a column with similar name'
                );
            }
        );
    });
});
