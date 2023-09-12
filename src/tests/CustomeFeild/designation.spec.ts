import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Custom Feilds', () => {
    PROCESS_TEST('Check the page opening', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await expect(page.getByText('Custom')).toHaveCount(1);
    });
    PROCESS_TEST(
        'Check Designation Tab and Click Designation Tab',
        async ({ page }) => {
            const customfeild = new CustofeildHelper(page);
            await customfeild.init();

            await customfeild.clickExpenseTab('Designation');
        }
    );

    PROCESS_TEST(
        'Check Designation Tab and Click Add New',
        async ({ page }) => {
            const customfeild = new CustofeildHelper(page);
            await customfeild.init();

            await customfeild.clickExpenseTab('Designation');
            await customfeild.clickButton('Add New');
            await expect(
                page.getByText('Add Designation Custom Field')
            ).toHaveCount(1);
        }
    );
    PROCESS_TEST('Add Designation With Empty Feilds', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');
        await customfeild.clickButton('Add New');

        await customfeild.clickButton('Save');

        await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(1);
    });

    PROCESS_TEST('Add Designation Without Name Feilds', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');

        await customfeild.addExpenseCustomeFeild('', 'Text', 1);

        const notification = await customfeild.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Field Name is required'
        );
    });
    PROCESS_TEST('Add Designation Without Type Feilds', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();

        await customfeild.clickExpenseTab('Designation');
        await customfeild.addExpenseCustomeFeild('Test1', '', 1);

        const notification = await customfeild.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Field Type is required'
        );
    });
    PROCESS_TEST('Add Advance Cateorgy With Text type', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();
        await customfeild.clickExpenseTab('Designation');

        await customfeild.addExpenseWithTextType(name, 'Text', 1, 'Test1');
        // await customfeild.AddExpenseWithTextType('Test2', 'Text', 1);
        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Adavnce Categories With Boolean', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();
        const name2 = await CustofeildHelper.generateRandomGradeName();
        await customfeild.clickExpenseTab('Designation');

        await customfeild.addExpenseWitBooleanType(name, 'Boolean', 1, 'True');
        await customfeild.addExpenseWitBooleanType(name2, 'Boolean', 1);
    });
    PROCESS_TEST('Add Designation With Number type', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');
        const name = await CustofeildHelper.generateRandomGradeName();
        await customfeild.addExpenseWithTextType(name, 'Number', 1, 123);

        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Designation With TextArea', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');
        const name = await CustofeildHelper.generateRandomGradeName();

        await customfeild.addExpenseWithTextType(
            name,
            'TextArea',
            1,
            'Finops Protol'
        );

        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Designation With Date type', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');
        const name = await CustofeildHelper.generateRandomGradeName();

        await customfeild.addExpenseWithDateType(name, 'Date', 1);
    });
    // PROCESS_TEST('Add Expense with choice type without choice feild', async ({
    //     page,
    // }) => {
    //

    //     const customfeild = new CustofeildHelper(page);
    //     await customfeild.init();
    //     await customfeild.AddExpenseWithNumberCheckchoice(
    //         'Choice1',
    //         'Choice',
    //         1,
    //         ['', '']
    //     );
    //     expect(await customfeild.errorMessage()).toBe(
    //         'Choice List is required'
    //     );
    // });
    PROCESS_TEST('Change Status', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');

        await customfeild.changeStatus('Number2');
    });
    PROCESS_TEST('Change Mendatory', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();

        await customfeild.clickExpenseTab('Designation');

        await customfeild.changeMendatory('Number2');
    });
    PROCESS_TEST('Check Edit Link', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');

        await customfeild.checkEdit('Number2');

        await expect(
            page.getByText('Edit Designation Custom Field')
        ).toHaveCount(1);
    });
    PROCESS_TEST('Change Name and Priority', async ({ page }) => {
        const customfeild = new CustofeildHelper(page);
        await customfeild.init();
        await customfeild.clickExpenseTab('Designation');

        const name = await CustofeildHelper.generateRandomGradeName();

        await customfeild.changeNameORPriority('Number2', 'Number', 1, name, 2);

        await expect(page.getByText(name)).toHaveCount(1);
    });
});
