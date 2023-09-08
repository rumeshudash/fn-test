import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class CustofeildHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('CUSTOMEFEILDS');
    }

    public async clickExpenseTab() {
        await this._page
            .getByRole('tab', { name: 'Expense', exact: true })
            .click();
    }

    public async AddExpenseCustomeFeild(
        name: string,
        type: string,
        priority: number
    ) {
        await this.clickExpenseTab();
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        await this.click({ role: 'button', name: 'save' });
    }
    public async AddExpenseWithTextType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string | number
    ) {
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.fillText(defaultValue, {
                text: 'Default Value',
            });
        }

        await this.click({ role: 'button', name: 'save' });
    }
    public async AddExpenseWitBooleanType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string
    ) {
        await this.clickExpenseTab();
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.click({ role: 'radio', name: defaultValue });
        }
        await this.click({ role: 'button', name: 'save' });
    }
    public async AddExpenseWithDateType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: Date
    ) {
        await this.clickExpenseTab();
        await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            hasText: 'Select Field Type',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this._page.locator(`//input[@id='date']`).click();
        const dateFeild = await this._page.locator(
            `//div[@class='rdrInfiniteMonths rdrMonthsVertical']//div[2]//div[2]`
        );
        const dateCheck = await dateFeild.getByRole('button', { name: '15' });
        await dateCheck.click();

        await this.click({ role: 'button', name: 'save' });
    }

    // public async AddExpenseWithNumberCheckchoice(
    //     name: string,
    //     type: string,
    //     priority: number,
    //     choicelist: string[]
    // ) {
    //     await this.clickExpenseTab();

    //     await this.clickButton('Add New');
    //     await this.fillText(name, {
    //         name: 'name',
    //     });
    //     await this.selectOption({
    //         option: type,
    //         hasText: 'Select Field Type',
    //     });
    //     await this.fillText(priority, {
    //         name: 'priority',
    //     });

    //     await this.selectOption({
    //         option: choicelist,
    //         hasText: 'Search...',
    //     });

    //     await this.click({ role: 'button', name: 'save' });
    // }

    public async ChangeStatus() {
        await this.clickExpenseTab();
        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        await this.FindrowAndperformAction(
            'Number1',
            5,
            btnlocator,
            performAction
        );
    }

    public async ChangeMendatory() {
        await this.clickExpenseTab();
        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        await this.FindrowAndperformAction(
            'Number1',
            6,
            btnlocator,
            performAction
        );
    }
}
