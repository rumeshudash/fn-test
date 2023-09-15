import { GradesHelper } from '@/helpers/GradesHelper/grade.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('HR-Grades', () => {
    PROCESS_TEST('TGC001-Grades Creation', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.clickButton('Add Grade');
        const dialog = await grades.dialogHelper;

        const name = await GradesHelper.generateRandomGradeName();

        await PROCESS_TEST.step('Click on Add Grade', async () => {
            // await grades.clickButton('Add Grade');
            const dialog = await grades.dialogHelper;

            await expect(await dialog.getDialogTitle()).toBe('Add Grade');
        });

        await PROCESS_TEST.step('Check empty Name feild', async () => {
            await grades.addGrades('', 1);
            const notification = await grades.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Name is required'
            );
        });

        await PROCESS_TEST.step('Check empty Priority feild', async () => {
            await dialog.closeDialog();

            await grades.clickButton('Yes!');

            await grades.clickButton('Add Grade');
            await grades.checkPriority(name);
            const notification = await grades.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Priority is required'
            );
        });
    });

    PROCESS_TEST('TGC002 - Grades Creation', async ({ page }) => {
        const grades = new GradesHelper(page);
        await grades.init();
        await grades.clickButton('Add Grade');
        const dialog = await grades.dialogHelper;

        const name = await GradesHelper.generateRandomGradeName();

        const newName = await GradesHelper.generateRandomGradeName();

        await PROCESS_TEST.step('With valid Name and Priority', async () => {
            await grades.addGrades(name, 1);

            // const notification = await grades.notificationHelper;

            // expect(await notification.getToastSuccess()).toBe('Successfully saved');
            await grades.verifyGrades(name, 1);
        });

        await PROCESS_TEST.step('Change The status', async () => {
            await grades.activeToInactive(name);

            // expect(await grades.successToast()).toBe('Status Changed');
            await page.waitForTimeout(1000);
        });
        await PROCESS_TEST.step(
            'Check Edit with duplicate Name Feild',
            async () => {
                await grades.editGrdaes(name, 'NEWHAMsss', null);
                const notification = await grades.notificationHelper;

                expect(await notification.getErrorMessage()).toBe(
                    'Duplicate grade name'
                );
            }
        );

        await PROCESS_TEST.step(
            'Check Edit with empty Name Feild',
            async () => {
                await dialog.closeDialog();

                await grades.clickButton('Yes!');

                await grades.editGrdaes(name, '', null);
                const notification = await grades.notificationHelper;

                expect(await notification.getErrorMessage()).toBe(
                    'Name is required'
                );
            }
        );
        await PROCESS_TEST.step('EditIcon click', async () => {
            await dialog.closeDialog();

            await grades.clickButton('Yes!');

            await grades.editGrdaes(name, newName, null);

            const notification = await grades.notificationHelper;
        });
        await PROCESS_TEST.step(
            'EditIcon Click with  Priority feild',
            async () => {
                await grades.editGrdaes(newName, undefined, 19, true);

                const notification = await grades.notificationHelper;

                // expect(await notification.getToastSuccess()).toBe(
                //     'Successfully saved'
                // );
            }
        );

        await PROCESS_TEST.step('Check duplicate Name feild', async () => {
            await grades.clickButton('Add Grade');
            await grades.addGrades(newName, 1);
            const notification = await grades.notificationHelper;

            expect(await notification.getErrorMessage()).toBe(
                'Duplicate grade name'
            );
        });

        await PROCESS_TEST.step(
            'Check save and create another checked',
            async () => {
                // await grades.clickButton('Add Grade');
                await grades.checkWithCheckbox(name, 1);

                const dialog = await grades.dialogHelper;

                await expect(await dialog.getDialogTitle()).toBe('Add Grade');
            }
        );
    });
});
