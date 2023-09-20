import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import chalk from 'chalk';
import { FormHelper } from '../BaseHelper/form.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';

export class CustofeildHelper extends ListingHelper {
    public tabHelper: TabHelper;
    public notificationHelper: NotificationHelper;

    public formHelper: FormHelper;

    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.tabHelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);

        this.formHelper = new FormHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }
    public async init() {
        await this.navigateTo('CUSTOMEFEILDS');
    }

    public async clickOnTab(TabName: string) {
        await this.tabHelper.checkTabExists(TabName);
        await this.tabHelper.clickTab(TabName);
    }

    public async addWithChoiceType(
        name: string,
        type: string,
        choiceList: string,
        priority: number
    ) {
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            input: type,
            name: 'column_type_id',
        });

        await this.selectOption({
            input: choiceList,
            name: 'choice_type_id',
        });

        await this.fillText(priority, {
            name: 'priority',
        });
        await this.click({ role: 'button', name: 'save' });
    }

    public async addCustomeFeild(name: string, type: string, priority: number) {
        // await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        await this.click({ role: 'button', name: 'save' });
    }
    public async addWithTextType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string | number
    ) {
        // await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.fillText(defaultValue, {
                placeholder: 'Default Value',
            });
        }

        await this.click({ role: 'button', name: 'save' });
    }
    public async addWitBooleanType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: string
    ) {
        // await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        if (defaultValue) {
            await this.click({ role: 'radio', name: defaultValue });
        }
        await this.click({ role: 'button', name: 'save' });
    }
    public async addWithDateType(
        name: string,
        type: string,
        priority: number,
        defaultValue?: Date
    ) {
        // await this.clickButton('Add New');
        await this.fillText(name, {
            name: 'name',
        });
        await this.selectOption({
            option: type,
            name: 'column_type_id',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        // await this._page.locator(`//input[@id='date']`).click();
        // const dateFeild = await this._page.locator(
        //     `//div[@class='rdrInfiniteMonths rdrMonthsVertical']//div[2]//div[2]`
        // );
        // const dateCheck = await dateFeild.getByRole('button', { name: '15' });
        // await dateCheck.click();

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
        await this.searchInList(name);
        const row = await this.findRowInTable(name, 'FIELD NAME');
        await this.clickButtonInTable(row, 'STATUS');

        await this._page.waitForTimeout(1000);

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));
    }

    public async changeMendatory(name: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
        const row = await this.findRowInTable(name, 'FIELD NAME');
        await this.clickButtonInTable(row, 'MANDATORY');

        await this._page.waitForTimeout(1000);

        const status = await this.getCellText(row, 'MANDATORY');

        console.log(chalk.green('Status is changed to ' + status));
    }

    public async checkEdit(name: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
        const row = await this.findRowInTable(name, 'FIELD NAME');
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

        await this._page.waitForTimeout(1000);

        await this.searchInList(newname);
    }
}
