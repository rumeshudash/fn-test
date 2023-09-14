import { ListingHelper } from '../BaseHelper/listing.helper';

import { DialogHelper } from '../BaseHelper/dialog.helper';

import { NotificationHelper } from '../BaseHelper/notification.helper';
import { expect } from '@playwright/test';

export class GradesHelper extends ListingHelper {
    public dialogHelper: DialogHelper;

    public notificationHelper: NotificationHelper;

    constructor(page: any) {
        super(page);
        this.dialogHelper = new DialogHelper(page);

        this.notificationHelper = new NotificationHelper(page);
    }
    private static GRADES_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init() {
        await this.navigateTo('GRADES');
    }

    public async addGrades(name: string, priority: number) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this.click({ role: 'button', name: 'save' });
    }
    public async checkPriority(name: string) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.click({ role: 'button', name: 'save' });
    }

    public async checkWithCheckbox(name: string, priority: number) {
        await this.click({ role: 'button', name: 'Add Grade' });

        await this._page.waitForTimeout(1000);
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this.clickCheckbox();

        await this.click({ role: 'button', name: 'save' });

        await this._page.waitForTimeout(1000);
    }
    public async activeToInactive(name: string) {
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'STATUS');
    }

    // public async checkTitle() {
    //     await this.dialogHelper.getDialogTitle();

    //     expect(await this.dialogHelper.getDialogTitle()).toBe('Add Grade');
    // }

    public async editGrdaes(name: string, newname: string, priority: number) {
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
    }
}
