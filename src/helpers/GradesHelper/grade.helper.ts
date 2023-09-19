import { ListingHelper } from '../BaseHelper/listing.helper';

import { DialogHelper } from '../BaseHelper/dialog.helper';

import { NotificationHelper } from '../BaseHelper/notification.helper';
import { expect } from '@playwright/test';
import { StatusHelper } from '../BaseHelper/status.helper';
import chalk from 'chalk';

type statusType = 'Active' | 'Inactive';

export class GradesHelper extends ListingHelper {
    public dialogHelper: DialogHelper;

    public notificationHelper: NotificationHelper;

    public statusHelper: StatusHelper;

    constructor(page: any) {
        super(page);
        this.dialogHelper = new DialogHelper(page);

        this.notificationHelper = new NotificationHelper(page);

        this.statusHelper = new StatusHelper(page);
    }
    private static GRADES_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init() {
        await this.navigateTo('GRADES');
    }

    public async addGrades(name: string, priority: number) {
        // await this.clickButton('Add Grade');
        await this.fillText(name, {
            name: 'name',
        });
        if (priority !== null) {
            await this.fillText(priority, {
                name: 'priority',
            });
        }

        await this.click({ role: 'button', name: 'save' });

        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
    }
    public async checkPriority(name: string) {
        // await this.clickButton('Add Grade');
        await this.fillText(name, {
            name: 'name',
        });
        await this.click({ role: 'button', name: 'save' });
    }

    public async checkWithCheckbox(name: string, priority: number) {
        await this._page.waitForTimeout(1000);
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this.saveAndCreateCheckbox();

        await this.click({ role: 'button', name: 'save' });

        await this._page.waitForTimeout(1000);
    }
    public async activeToInactive(name: string) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'STATUS');

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));

        await this._page.waitForTimeout(1000);
    }

    // public async checkTitle() {
    //     await this.dialogHelper.getDialogTitle();

    //     expect(await this.dialogHelper.getDialogTitle()).toBe('Add Grade');
    // }

    public async editGrdaes(
        name: string,
        newname: string,
        priority: number,
        flag?: boolean
    ) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'ACTION');

        if (newname !== undefined) {
            await this.fillText(newname, {
                name: 'name',
            });
        }
        if (priority !== null) {
            await this.fillText(priority, {
                name: 'priority',
            });
        }
        await this.click({ role: 'button', name: 'save' });

        await this._page.waitForTimeout(1000);

        if (flag) {
            await this.searchInList(name);
        } else {
            await this.searchInList(newname);
        }

        await this._page.waitForTimeout(1000);
    }

    public async verifyGrades(name: string, priority: number) {
        await this.searchInList(name);

        await this._page.waitForTimeout(1000);

        const row = await this.ifRowExists(name, 'NAME');

        const tableRow = await this.findRowInTable(name, 'NAME');

        const getText = await this.getCellText(tableRow, 'PRIORITY');

        const status = await this.getCellText(tableRow, 'STATUS');

        expect(status).toBe('Active');

        expect(getText).toBe(priority.toString());

        expect(row).toBe(true);
    }

    public async checkWarning(name: string) {
        await this.fillText(name, {
            name: 'name',
        });

        await this.dialogHelper.checkConfirmDialogOpenOrNot();
    }
}
