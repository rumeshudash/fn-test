import { ListingHelper } from '../BaseHelper/listing.helper';

import { DialogHelper } from '../BaseHelper/dialog.helper';

import { NotificationHelper } from '../BaseHelper/notification.helper';
import { expect } from '@playwright/test';
import { StatusHelper } from '../BaseHelper/status.helper';
import chalk from 'chalk';

export class GradesHelper extends ListingHelper {
    /**
     * @description - Creating instnce of DialogHelper, NotificationHelper, StatusHelper
     *
     */
    public dialogHelper: DialogHelper;

    public notificationHelper: NotificationHelper;

    public statusHelper: StatusHelper;

    constructor(page: any) {
        super(page);
        this.dialogHelper = new DialogHelper(page);

        this.notificationHelper = new NotificationHelper(page);

        this.statusHelper = new StatusHelper(page);
    }

    /**
     * @description - Navigate to Grades Page
     *
     */
    public async init() {
        await this.navigateTo('GRADES');
    }

    /**
     * @description - Add Grades with Name and Priority
     *
     * @param name - Name of the Grade
     * @param priority - Priority of the Grade
     */
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
    }

    /**
     * @description - Try to add grades with empty  priority
     *
     * @param name - Name of the Grade
     */
    public async checkEmptyPriority(name: string) {
        await this.fillText(name, {
            name: 'name',
        });
        await this.click({ role: 'button', name: 'save' });
    }

    /**
     * @description - Add Grdaes with Name and priority and click on save and create another checkbox
     *
     * @param name - Name of the Grade
     * @param priority - Priority of the Grade
     */
    public async checkWithCheckbox(name: string, priority: number) {
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

    /**
     * @description - Change the status of the Grade
     *
     * @param name - Name of the Grade
     */
    public async changeStatus(name: string) {
        await this.searchInList(name);

        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'STATUS');

        const status = await this.getCellText(row, 'STATUS');

        console.log(chalk.green('Status is changed to ' + status));
    }

    /**
     * @description - Edit the Grade with name and priority
     *
     * @param name - Name of the Grade
     * @param newname - New Name of the Grade
     * @param priority - Priority of the Grade to be changed
     *
     * @param flag - Flag to check whether to search with old name or new name
     */

    public async editGrdaes(
        name: string,
        newname: string,
        priority: number,
        flag?: boolean
    ) {
        await this.searchInList(name);

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
    }

    /**
     * @description - Verify the Added Grades and  Priority Reflected in the table and status is active
     * @param name
     * @param priority
     */

    public async verifyGrades(name: string, priority: number) {
        await this.searchInList(name);

        const row = await this.ifRowExists(name, 'NAME');

        const tableRow = await this.findRowInTable(name, 'NAME');

        const getText = await this.getCellText(tableRow, 'PRIORITY');

        const status = await this.getCellText(tableRow, 'STATUS');

        expect(status).toBe('Active');

        expect(getText).toBe(priority.toString());

        expect(row).toBe(true);
    }

    /**
     * @description -Check Warning Dialog is open or not
     * @param name - Name of the Grade to be Added
     */

    public async checkWarning(name: string) {
        await this.fillText(name, {
            name: 'name',
        });

        await this.dialogHelper.checkConfirmDialogOpenOrNot();
    }
}
