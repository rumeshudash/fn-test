import { Locator, expect } from '@playwright/test';
import chalk from 'chalk';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { TabHelper } from '../BaseHelper/tab.helper';

export class UserCreation extends FormHelper {
    public listHelper: ListingHelper;
    public detailsHelper: DetailsPageHelper;
    public tabHelper: TabHelper;
    public statusHelper: StatusHelper;
    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.listHelper = new ListingHelper(page);
        this.detailsHelper = new DetailsPageHelper(page);
        this.tabHelper = new TabHelper(page);
        this.statusHelper = new StatusHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }

    public async init() {
        const isExpanded = await this._page
            .locator('.hamburger_button.hamburger_button--active')
            .isVisible();
        if (!isExpanded) {
            await this._page.locator('.hamburger_button').click();
        }
        await this._page
            .locator('a')
            .filter({ hasText: 'Configurations' })
            .click();
        await this._page.waitForTimeout(1000);
        await this._page
            .locator('.sidebar-item-title')
            .filter({ hasText: 'User Groups' })
            .click();
        await this._page.waitForTimeout(1000);
    }

    // open add user group form
    public async openUserGroupForm() {
        await this.click({
            role: 'button',
            name: 'add_circle_outline Add User Group',
        });
        console.log(chalk.green('Add User Group button clicked'));
        await expect(this._page.locator('//button[text()="Save"]'), {
            message: 'Checking save button visibility',
        }).toBeVisible();
        console.log(chalk.green('Add User Group form is visible'));
    }

    // verify popup on form
    public async verifyCancelPopup() {
        await this.fillInput('Test User Group', { name: 'name' });
        await this.dialogHelper.checkConfirmDialogOpenOrNot();
        await this.dialogHelper.clickConfirmDialogAction('Yes!');

        // open form and check if data is cleared on cancel
        await this.openUserGroupForm();
        await this.fillInput('Test User Group', { name: 'name' });
        await this.dialogHelper.checkConfirmDialogOpenOrNot();
        await this.dialogHelper.clickConfirmDialogAction('No');

        await expect(
            this.dialogHelper.getDialogContainer().getLocator()
        ).toBeVisible();
        await expect(this.getInputElement({ name: 'name' })).toHaveValue(
            'Test User Group'
        );
    }

    // check user group addition in the row
    public async verifyUserGroupDetails(
        group: Locator,
        data: UserGroupData,
        status: string
    ) {
        const name = await this.listHelper.getCellText(group, 'NAME');
        expect(name).toBe(data.name);

        // verify manager
        const manager = await this.listHelper.getCellText(group, 'MANAGER');
        expect(manager).toBe(data.manager);

        // verify status
        const statusButton = await this.listHelper.getCellText(group, 'STATUS');
        expect(statusButton).toBe(status);

        // verify description
        const description = await this.listHelper.getCellText(
            group,
            'DESCRIPTION'
        );
        expect(description).toBe(data.description);
    }

    // fill user group form
    public async fillUserGroupForm(data: UserGroupData) {
        console.log('data is here');
        console.log(data);

        await this.dialogHelper.waitForDialogOpen();

        if (data.name) {
            await this.fillInput(data.name, {
                name: 'name',
            });
        }
        if (data.manager) {
            await this.selectOption({
                input: data.manager,
                name: 'manager_id',
            });
        }
        if (data.description) {
            await this.fillText(data.description, {
                name: 'description',
            });
        }

        await this.submitButton('Save', { clickSubmit: true });
        console.log(chalk.green('Save button clicked'));

        // check err message if name empty
        if (!data.name || !data.manager || !data.description) {
            console.log('check empty data');

            if (!data.name) {
                await this.checkIsInputHasErrorMessage('Name is required', {
                    name: 'name',
                });
            }
            if (!data.manager) {
                await this.checkIsInputHasErrorMessage('Manager is required', {
                    name: 'manager_id',
                });
            }
            if (!data.description) {
                await this.checkIsInputHasErrorMessage(
                    'Description is required',
                    {
                        name: 'description',
                        type: 'textarea',
                    }
                );
            }
            await expect(
                await this.submitButton('Save', { clickSubmit: false }),
                {
                    message: 'Checking save button visibility',
                }
            ).toBeDisabled();
            return;
        }

        const toast = this._page.locator('div.ct-toast-success').first();
        expect(await toast.textContent(), {
            message: 'Checking toast message',
        }).toBe('Successfully saved');
        console.log(chalk.green('User Group toast message verified'));
    }

    public async openDetailsPage(name: string) {
        await this.listHelper.openDetailsPage(name, 'NAME', true);
    }

    // verify user group details page
    public async validateDetailsPage(data: UserGroupData) {
        await this._page.waitForSelector(`//h1[text()="User Group Detail"]`);
        await this.detailsHelper.validateDetailsPageInfo('User Group Detail', [
            {
                selector: '//h3[@role="heading"]',
                text: data.name,
            },
            {
                selector: '#has-Manager',
                text: data.manager,
            },
            {
                selector: '#has-Description',
                text: data.description,
            },
        ]);
    }

    // navigate to tabs based on status
    public async navigateToTab(status: string) {
        console.log(chalk.blue('Navigating to tab:' + status));
        await this._page
            .locator('//button[@role="tab"]')
            .getByText(status, { exact: true })
            .click();
        await this._page.waitForTimeout(1000);
    }

    // toggle user group status from the row
    public async setStatus(name: string, status: string) {
        console.log(chalk.blue('Toggling group status'));
        await this.navigateTo('USERGROUPS');
        await this.tabHelper.clickTab('All');
        await this.statusHelper.setStatus(name, status);
        console.log(chalk.green('Group status toggled'));
    }

    // verify if the user group is present in the table
    public async verifyIfPresent({
        data,
        present,
        status,
    }: {
        data: UserGroupData;
        present: boolean;
        status: string;
    }) {
        console.log(chalk.blue('user group listing page opened'));

        await this.listHelper.searchInList(data.name);
        const addedGroup = await this.listHelper.findRowInTable(
            data.name,
            'NAME'
        );

        // if added user group is not present
        if (!present) {
            await expect(addedGroup).not.toBeVisible();
            return;
        }

        await this.verifyUserGroupDetails(addedGroup, data, status);
    }
}
