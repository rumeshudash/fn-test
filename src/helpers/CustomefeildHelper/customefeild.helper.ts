import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class CustofeildHelper extends BaseHelper {
    public async init() {
        await this.navigateTo('CUSTOMEFEILDS');
    }

    public async clickExpenseTab(TabName: string) {
        await this._page
            .getByRole('tab', { name: `${TabName}`, exact: true })
            .click();
    }

    public async AddExpenseCustomeFeild(
        name: string,
        type: string,
        priority: number
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
        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        await this.FindrowAndperformAction(
            'Number2',
            6,
            btnlocator,
            performAction
        );
    }

    public async CheckEdit() {
        await this.FindrowAndperformAction(
            'Number2',
            7,
            '//button',
            async (element: any) => {
                await element.click();
            }
        );
    }

    public async changeNameORPriority(
        name: string,
        type: string,
        priority: number,

        newname?: string,
        newpriority?: number
    ) {
        await this.CheckEdit();

        // await this._page.getByText(`${name}`);
        // await this._page.getByText(`${type}`);
        // await this._page.getByText(`${priority}`);

        if (newname) {
            await this.fillText(newname, {
                name: 'name',
            });
        }
        if (newpriority) {
            await this.fillText(newpriority, {
                name: 'priority',
            });
        }

        await this.click({ role: 'button', name: 'save' });
    }
}
