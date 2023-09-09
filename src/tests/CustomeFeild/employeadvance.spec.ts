import { CustofeildHelper } from '@/helpers/CustomefeildHelper/customefeild.helper';
import { test, expect } from '@playwright/test';
import { SignInHelper } from '@/helpers/SigninHelper/signIn.helper';
import { PROCESS_TEST } from '@/fixtures';

test.describe('CustomeFeild', () => {
    PROCESS_TEST('Check the page opening', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await expect(page.getByText('Custom')).toHaveCount(1);
    });
    PROCESS_TEST(
        'Check Advance Tab and Click Advance Tab',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            await customefeild.init();

            await customefeild.clickExpenseTab('Employee Advance');
            await expect(
                page.getByRole('tab', {
                    name: 'Employee Advance ',
                    exact: true,
                })
            ).toHaveCount(1);
        }
    );

    PROCESS_TEST(
        'Check Employee Advance  Tab and Click Add New',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            await customefeild.init();

            await customefeild.clickExpenseTab('Employee Advance');
            await customefeild.clickButton('Add New');
            await expect(
                page.getByText('Add Employee Advance  Custom Field')
            ).toHaveCount(1);
        }
    );
    PROCESS_TEST(
        'Add Employee Advance  With Empty Feilds',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            await customefeild.init();
            await customefeild.clickExpenseTab('Employee Advance');
            await customefeild.clickButton('Add New');

            await customefeild.clickButton('Save');

            await expect(
                page.getByRole('button', { name: 'Save' })
            ).toHaveCount(1);
        }
    );

    PROCESS_TEST(
        'Add Employee Advance  Without Name Feilds',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            await customefeild.init();
            await customefeild.clickExpenseTab('Employee Advance');

            await customefeild.AddExpenseCustomeFeild('', 'Text', 1);

            expect(await customefeild.errorMessage()).toBe(
                'Field Name is required'
            );
        }
    );
    PROCESS_TEST(
        'Add Employee Advance  Without Type Feilds',
        async ({ page }) => {
            const customefeild = new CustofeildHelper(page);
            await customefeild.init();

            await customefeild.clickExpenseTab('Employee Advance');
            await customefeild.AddExpenseCustomeFeild('Test1', '', 1);

            expect(await customefeild.errorMessage()).toBe(
                'Field Type is required'
            );
        }
    );
    PROCESS_TEST('Add Advance Cateorgy With Text type', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();
        await customefeild.clickExpenseTab('Employee Advance');

        await customefeild.AddExpenseWithTextType(name, 'Text', 1, 'Test1');
        // await customefeild.AddExpenseWithTextType('Test2', 'Text', 1);
        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Adavnce Categories With Boolean', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        const name = await CustofeildHelper.generateRandomGradeName();
        const name2 = await CustofeildHelper.generateRandomGradeName();
        await customefeild.clickExpenseTab('Employee Advance');

        await customefeild.AddExpenseWitBooleanType(name, 'Boolean', 1, 'True');
        await customefeild.AddExpenseWitBooleanType(name2, 'Boolean', 1);
    });
    PROCESS_TEST('Add Employee Advance  With Number type', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Employee Advance ');
        const name = await CustofeildHelper.generateRandomGradeName();
        await customefeild.AddExpenseWithTextType(name, 'Number', 1, 123);

        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Employee Advance  With TextArea', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Employee Advance');
        const name = await CustofeildHelper.generateRandomGradeName();

        await customefeild.AddExpenseWithTextType(
            name,
            'TextArea',
            1,
            'Finops Protol'
        );

        await expect(page.getByText(name)).toHaveCount(1);
    });
    PROCESS_TEST('Add Employee Advance  With Date type', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Employee Advance ');
        const name = await CustofeildHelper.generateRandomGradeName();

        await customefeild.AddExpenseWithDateType(name, 'Date', 1);
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
        await customefeild.clickExpenseTab('Employee Advance');

        await customefeild.ChangeStatus();
    });
    PROCESS_TEST('Change Mendatory', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();

        await customefeild.clickExpenseTab('Employee Advance');

        await customefeild.ChangeMendatory();
    });
    PROCESS_TEST('Check Edit Link', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Employee Advance');

        await customefeild.CheckEdit();

        await expect(
            page.getByText('Edit Employee Advance  Custom Field')
        ).toHaveCount(1);
    });
    PROCESS_TEST('Change Name and Priority', async ({ page }) => {
        const customefeild = new CustofeildHelper(page);
        await customefeild.init();
        await customefeild.clickExpenseTab('Employee Advance');

        const name = await CustofeildHelper.generateRandomGradeName();

        await customefeild.changeNameORPriority(
            'Number1',
            'Number',
            1,
            name,
            2
        );

        await expect(page.getByText(name)).toHaveCount(1);
    });
});
