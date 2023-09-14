import { Locator, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { StatusHelper } from '../BaseHelper/status.helper';

export class UserCreation extends BaseHelper {
    public listHelper: ListingHelper;
    public detailsHelper: DetailsPageHelper;
    public tabHelper: TabHelper;
    public statusHelper: StatusHelper;

    constructor(page: any) {
        super(page);
        this.listHelper = new ListingHelper(page);
        this.detailsHelper = new DetailsPageHelper(page);
        this.tabHelper = new TabHelper(page);
        this.statusHelper = new StatusHelper(page);
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
        await this._page
            .getByRole('dialog')
            .locator('button')
            .filter({ hasText: 'Close' })
            .click();

        // check form popup options
        await this._page.waitForSelector("(//div[@role='dialog'])[2]");
        const dialog = this._page.locator("(//div[@role='dialog'])[2]");
        const yesButton = dialog.locator('button').getByText('Yes!');
        const noButton = dialog.locator('button').getByText('No');
        await expect(yesButton).toBeVisible();
        await expect(noButton).toBeVisible();

        // check if form is closed
        await yesButton.click();
        await expect(this._page.getByRole('dialog')).not.toBeVisible();

        // open form and check if data is cleared on cancel
        await this.openUserGroupForm();
        await this.fillInput('Test User Group', { name: 'name' });
        await this._page
            .getByRole('dialog')
            .locator('button')
            .filter({ hasText: 'Close' })
            .click();
        await noButton.click();
        await expect(this._page.getByRole('dialog').first()).toBeVisible();
        await expect(this._page.locator('input[name="name"]')).toHaveValue(
            'Test User Group'
        );
        await this.fillInput('', { name: 'name' });
    }

    // check error
    public async checkError(message: string, index: number) {
        console.log(chalk.blue('Checking error message and button disabled'));
        const error = this._page.locator('span.label.text-error').nth(index);
        expect(await error.textContent(), {
            message: `Checking: (${message}) error message`,
        }).toBe(message);
        console.log(chalk.green('Error message verified and button disabled'));
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

        await this._page.waitForSelector(
            '//div[@role="dialog"]/descendant::form'
        );
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
        await this.click({ role: 'button', name: 'Save' });
        console.log(chalk.green('Save button clicked'));

        // check err message if name empty
        if (!data.name || !data.manager || !data.description) {
            console.log('check empty data');

            if (!data.name) {
                await this.checkError('Name is required', 0);
            }
            if (!data.manager) {
                await this.checkError('Manager is required', 1);
            }
            if (!data.description) {
                await this.checkError('Description is required', 2);
            }
            await expect(this._page.locator('//button[text()="Save"]'), {
                message: 'Checking save button visibility',
            }).toBeDisabled();
            return;
        }

        const toast = this._page.locator('div.ct-toast-success').first();
        expect(await toast.textContent(), {
            message: 'Checking toast message',
        }).toBe('Successfully saved');
        console.log(chalk.green('User Group toast message verified'));
    }

    public async openDetailsPage(name: string) {
        console.log(chalk.blue('Opening user group details'));
        await this._page.waitForSelector('div.table-row.body-row');
        const row = await this.listHelper.findRowInTable(name, 'NAME');
        const cell = await this.listHelper.getCell(row, 'NAME');
        await cell.locator('a').click();
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
