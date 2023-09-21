import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Configurations-Custom Feilds', () => {
    PROCESS_TEST('TCF001- Employee Advance -Negative', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        const dialog = await customefeild.dialogHelper;

        await PROCESS_TEST.step('Check page is opening', async () => {
            await expect(page.getByText('Custom')).toHaveCount(1);
        });

        await PROCESS_TEST.step('Check Employee Advance Tab', async () => {
            await customefeild.clickOnTab('Employee Advance');
        });

        await PROCESS_TEST.step('Check Add New Button', async () => {
            await customefeild.clickButton('Add New');

            expect(await dialog.getDialogTitle()).toBe(
                'Add Employee Advance Custom Field'
            );
        });

        await PROCESS_TEST.step(
            'Add Employee Advance  With Empty Feilds',
            async () => {
                await customefeild.clickButton('Save');
            }
        );

        await PROCESS_TEST.step('Without Name feilds', async () => {
            await dialog.closeDialog();

            await customefeild.clickButton('Yes!');

            await customefeild.clickButton('Add New');
            await customefeild.addCustomeFeild('', 'Text', 1);

            const notification = await customefeild.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Field Name is required'
            );
        });

        await PROCESS_TEST.step('Without Type feilds', async () => {
            await dialog.closeDialog();

            await customefeild.clickButton('Yes!');

            await customefeild.clickButton('Add New');
            await customefeild.addCustomeFeild('Test1', '', 1);
            const notification = await customefeild.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Field Type is required'
            );
        });
    });

    PROCESS_TEST(
        'TCF002 - Add Employee Advance - Positive Case',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            await customefeild.init();
            const name = await CustofeildHelper.generateRandomGradeName();

            await PROCESS_TEST.step(
                'Add Employee Advance With Text Type',
                async () => {
                    await customefeild.clickOnTab('Employee Advance');

                    await customefeild.clickButton('Add New');

                    await customefeild.addWithTextType(
                        name + 'abc',
                        'Text',
                        1,
                        'Test1'
                    );
                    await customefeild.checkNameAndType(name + 'abc', 'Text');
                }
            );
            await PROCESS_TEST.step(
                'Add Employee Advance With Boolean',
                async () => {
                    await customefeild.clickButton('Add New');
                    await customefeild.addWitBooleanType(
                        name + 'abcd',
                        'Boolean',
                        1,
                        'True'
                    );

                    await customefeild.checkNameAndType(
                        name + 'abcd',
                        'Boolean'
                    );
                }
            );
            await PROCESS_TEST.step('Add with choice type', async () => {
                await customefeild.clickButton('Add New');
                await customefeild.addWithChoiceType(
                    name + 'abcge',
                    'Choicelist',
                    'customechoce',
                    2
                );

                await customefeild.checkNameAndType(
                    name + 'abcge',
                    'Choicelist'
                );
            });

            await PROCESS_TEST.step(
                'Add Employee Advance With Number type',
                async () => {
                    await customefeild.clickButton('Add New');
                    await customefeild.addWithTextType(
                        name + 'abce',
                        'Number',
                        1,
                        123
                    );

                    await customefeild.checkNameAndType(
                        name + 'abce',
                        'Number'
                    );
                }
            );

            await PROCESS_TEST.step(
                'Add Employee Advance With Date type',
                async () => {
                    await customefeild.clickButton('Add New');
                    await customefeild.addWithDateType(
                        name + 'abcf',
                        'Date',
                        1
                    );

                    await customefeild.checkNameAndType(name + 'abcf', 'Date');
                }
            );
            await PROCESS_TEST.step(
                'Add Employee Advance With TextArea',
                async () => {
                    await customefeild.clickButton('Add New');
                    await customefeild.addWithTextType(
                        name + 'abcg',
                        'TextArea',
                        1,
                        'Test1'
                    );

                    await customefeild.checkNameAndType(
                        name + 'abcg',
                        'TextArea'
                    );
                }
            );

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
                const newName =
                    await CustofeildHelper.generateRandomGradeName();

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
                    await customefeild.addWithTextType(
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
        }
    );
});
