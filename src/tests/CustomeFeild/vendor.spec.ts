import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Custom Feilds', () => {
    PROCESS_TEST('Check the page opening', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await expect(page.getByText('Custom')).toHaveCount(1);
    });
    PROCESS_TEST('Check Vendor Tab and Click on Tab', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab('Vendor');
    });

    PROCESS_TEST('Check Vendor Tab and Click Add New', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab('Vendor');
        await customefeild.clickButton('Add New');
        await expect(page.getByText('Add Vendor Custom Field')).toHaveCount(1);
    });
    PROCESS_TEST('Add Vendor With Empty Feilds', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');
        await customefeild.clickButton('Add New');

        await customefeild.clickButton('Save');

        await expect(page.getByRole('button', { name: 'Save' })).toHaveCount(1);
    });

    PROCESS_TEST('Add Vendor Without Name Feilds', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');

        await customefeild.addExpenseCustomeFeild('', 'Text', 1);

        const notification = await customefeild.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Field Name is required'
        );
    });
    PROCESS_TEST('Add Vendor Without Type Feilds', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab('Vendor');
        await customefeild.addExpenseCustomeFeild('Test1', '', 1);

        const notification = await customefeild.notificationHelper;

        expect(await notification.getErrorMessage()).toBe(
            'Field Type is required'
        );
    });
    PROCESS_TEST('Add Advance Cateorgy With Text type', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();
        await customefeild.clickExpenseTab('Vendor');

        await customefeild.addExpenseWithTextType(name, 'Text', 1, 'Test1');
        // await customefeild.AddExpenseWithTextType('Test2', 'Text', 1);
        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Adavnce Categories With Boolean', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();
        const name2 = await CustofeildHelper.generateRandomGradeName();
        await customefeild.clickExpenseTab('Vendor');

        await customefeild.addExpenseWitBooleanType(name, 'Boolean', 1, 'True');
        await customefeild.addExpenseWitBooleanType(name2, 'Boolean', 1);
    });
    PROCESS_TEST('Add Vendor With Number type', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');
        const name = await CustofeildHelper.generateRandomGradeName();
        await customefeild.addExpenseWithTextType(name, 'Number', 1, 123);

        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Vendor With TextArea', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');
        const name = await CustofeildHelper.generateRandomGradeName();

        await customefeild.addExpenseWithTextType(
            name,
            'TextArea',
            1,
            'Finops Protol'
        );

        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Vendor With Date type', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');
        const name = await CustofeildHelper.generateRandomGradeName();

        await customefeild.addExpenseWithDateType(name, 'Date', 1);
    });
    // PROCESS_TEST('Add Expense with choice type without choice feild', async ({
    //     page,
    // }) => {
    //

    //     const customefeild = new CustofeildHelper(page);
    //     await customefeild.init();
    //     await customefeild.AddExpenseWithNumberCheckchoice(
    //         'Choice1',
    //         'Choice',
    //         1,
    //         ['', '']
    //     );
    //     expect(await customefeild.errorMessage()).toBe(
    //         'Choice List is required'
    //     );
    // });
    PROCESS_TEST('Change Status', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');

        await customefeild.changeStatus('Number2');
    });
    PROCESS_TEST('Change Mendatory', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab('Vendor');

        await customefeild.changeMendatory('Number2');
    });
    PROCESS_TEST('Check Edit Link', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');

        await customefeild.checkEdit('Number2');

        await expect(page.getByText('Edit Vendor Custom Field')).toHaveCount(1);
    });
    PROCESS_TEST('Change Name and Priority', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Vendor');

        const name = await CustofeildHelper.generateRandomGradeName();

        await customefeild.changeNameORPriority(
            'Number2',
            'Number',
            1,
            name,
            2
        );

        await expect(page.getByText(name)).toHaveCount(1);
    });
});
