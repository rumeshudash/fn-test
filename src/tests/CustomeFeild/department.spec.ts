import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Configurations-Custom Feilds', () => {
    PROCESS_TEST('TCF001- Department -Negative', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        const dialog = await customefeild.dialogHelper;

        await PROCESS_TEST.step('Check page is opening', async () => {
            await expect(page.getByText('Custom')).toHaveCount(1);
        });

        await PROCESS_TEST.step('Check Department Tab', async () => {
            await customefeild.clickOnTab('Department');
        });

        await PROCESS_TEST.step('Check Add New Button', async () => {
            await customefeild.clickButton('Add New');

            expect(await dialog.getDialogTitle()).toBe(
                'Add Department Custom Field'
            );
        });

        await PROCESS_TEST.step(
            'Add Department With Empty Feilds',
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
        'TCF002 - Add Department - Positive Case',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            const dialog = await customefeild.dialogHelper;
            await customefeild.init();
            const name = await CustofeildHelper.generateRandomGradeName();
            const newName = await CustofeildHelper.generateRandomGradeName();

            await PROCESS_TEST.step(
                'Add Department With Text Type',
                async () => {
                    await customefeild.clickOnTab('Department');

                    await customefeild.clickButton('Add New');

                    await customefeild.addWithTextType(
                        name,
                        'Text',
                        1,
                        'Test1'
                    );

                    await customefeild.checkNameAndType(name, 'Text');
                }
            );
            await PROCESS_TEST.step('Add Department With Boolean', async () => {
                await customefeild.clickButton('Add New');
                const booleanName =
                    (await CustofeildHelper.generateRandomGradeName()) +
                    'Boolean';
                await customefeild.addWitBooleanType(
                    booleanName,
                    'Boolean',
                    1,
                    'True'
                );

                await customefeild.checkNameAndType(booleanName, 'Boolean');
            });

            await PROCESS_TEST.step(
                'Add Department With Number type',
                async () => {
                    await customefeild.clickButton('Add New');
                    const numberName =
                        (await CustofeildHelper.generateRandomGradeName()) +
                        'Number';
                    await customefeild.addWithTextType(
                        numberName,
                        'Number',
                        1,
                        123
                    );

                    await customefeild.checkNameAndType(numberName, 'Number');
                }
            );
            await PROCESS_TEST.step('Add with choice type', async () => {
                await customefeild.clickButton('Add New');
                const choiceName =
                    (await CustofeildHelper.generateRandomGradeName()) +
                    'Choice';
                await customefeild.addWithChoiceType(
                    choiceName,
                    'Choicelist',
                    'customechoce',
                    2
                );

                await customefeild.checkNameAndType(choiceName, 'Choicelist');
            });

            await PROCESS_TEST.step(
                'Add Department With Date type',
                async () => {
                    await customefeild.clickButton('Add New');
                    const dateName =
                        (await CustofeildHelper.generateRandomGradeName()) +
                        'Date';
                    await customefeild.addWithDateType(dateName, 'Date', 1);

                    await customefeild.checkNameAndType(dateName, 'Date');
                }
            );
            await PROCESS_TEST.step(
                'Add Department With TextArea',
                async () => {
                    await customefeild.clickButton('Add New');
                    const textAreaName =
                        (await CustofeildHelper.generateRandomGradeName()) +
                        'TextArea';
                    await customefeild.addWithTextType(
                        textAreaName,
                        'TextArea',
                        1,
                        'Test1'
                    );

                    await customefeild.checkNameAndType(
                        textAreaName,
                        'TextArea'
                    );
                }
            );

            await PROCESS_TEST.step('Change Status', async () => {
                await customefeild.changeStatus(name);
            });

            await PROCESS_TEST.step('Change Mendatory', async () => {
                await customefeild.changeMendatory(name);
            });

            await PROCESS_TEST.step('Check Editable', async () => {
                await customefeild.checkEdit(name);
            });
            await PROCESS_TEST.step('Edit with Empty Name', async () => {
                await customefeild.changeName(name, 'Text', '');
                const notification = await customefeild.notificationHelper;

                expect(await notification.getErrorMessage()).toBe(
                    'Field Name is required'
                );
            });

            await PROCESS_TEST.step('Change Name', async () => {
                await dialog.closeDialog();
                await customefeild.clickButton('Yes!');
                await customefeild.checkEdit(name);

                await customefeild.changeName(name, 'Text', newName);
            });

            await PROCESS_TEST.step('Change Priority', async () => {
                await customefeild.checkEdit(newName);

                await customefeild.changePriority(newName, 'Text', 2);
            });

            // await PROCESS_TEST.step(
            //     'Check with existing name and type ',
            //     async () => {
            //         await customefeild.clickButton('Add New');
            //         await customefeild.addWithTextType(
            //             name,
            //             'Text',
            //             1,
            //             'Test1'
            //         );

            //         const notification = await customefeild.notificationHelper;

            //         expect(await notification.getErrorMessage()).toBe(
            //             'There is already a column with similar name'
            //         );
            //     }
            // );
        }
    );
});
