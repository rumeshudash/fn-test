import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';

export class CustofeildHelper extends ListingHelper {
    public tabHelper: TabHelper;

    constructor(page: any) {
        super(page);
        this.tabHelper = new TabHelper(page);
    }
    public async init() {
        await this.navigateTo('CUSTOMEFEILDS');
    }

    public async clickExpenseTab(TabName: string) {
        await this.tabHelper.clickTab(TabName);
    }

    public async addExpenseCustomeFeild(
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
    public async addExpenseWithTextType(
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
    public async addExpenseWitBooleanType(
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
    public async addExpenseWithDateType(
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

    public async changeStatus(name: string) {
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'ACTION');
    }

    public async changeMendatory(name: string) {
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'MEANDATORY');
    }

    public async checkEdit(name: string) {
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'ACTION');
    }

    public async changeNameORPriority(
        name: string,
        type: string,
        priority: number,

        newname?: string,
        newpriority?: number
    ) {
        await this.checkEdit(name);

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
