import { ListingHelper } from '../BaseHelper/listing.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { NotesHelper } from '../BaseHelper/notes.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';

export class ExpenseHeadHelper extends ListingHelper {
    public noteHelper: NotesHelper;

    public tabhelper: TabHelper;

    public notificationHelper: NotificationHelper;

    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.noteHelper = new NotesHelper(page);
        this.tabhelper = new TabHelper(page);
        this.notificationHelper = new NotificationHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }
    public async init() {
        await this.navigateTo('EXPENSE_HEADS');
    }
    // public async clickPolicy() {
    //     await this._page.locator("//input[@type='checkbox']").click();
    // }

    public async addExpenseHead(
        name: string,
        parent?: string,
        manager?: string,
        abc?: string
    ) {
        await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });
        if (parent) {
            await this.selectOption({
                option: parent,
                hasText: 'Select a Parent',
            });
        }
        if (manager) {
            await this.selectOption({
                option: manager,
                hasText: 'Select a manager',
            });
        }
        if (abc) {
            await this.fillText(abc, {
                name: 'date',
            });
        }
        await this._page.waitForTimeout(1000);
        await this.click({ role: 'button', name: 'save' });
    }

    public async changeActiveStatus(name: string) {
        await this.tabHelper.checkTabExists('Active');
        await this.tabHelper.clickTab('Active');
        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'STATUS');

        this._page.waitForTimeout(1000);
    }
    public async changeInactiveStatus(name: string) {
        await this.tabHelper.checkTabExists('Inactive');
        await this.tabHelper.clickTab('Inactive');

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'STATUS');

        this._page.waitForTimeout(1000);

        await this._page.getByText(name);

        this._page.waitForTimeout(1000);
    }

    public async editExpenseHead(name: string, newname: string) {
        await this.tabHelper.checkTabExists('All');
        await this.tabHelper.clickTab('All');

        const row = await this.findRowInTable(name, 'NAME');

        await this.clickButtonInTable(row, 'ACTION');

        this.fillText(newname, {
            name: 'name',
        });

        await this.click({ role: 'button', name: 'save' });

        this._page.waitForTimeout(1000);
    }

    public async addAndClickCheckbox(name: string) {
        await this.clickButton('Add Expense Head');
        await this.fillText(name, {
            name: 'name',
        });

        await this.saveAndCreateCheckbox();

        await this.click({ role: 'button', name: 'save' });
    }
}
