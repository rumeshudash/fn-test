import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

export class DialogHelper extends BaseHelper {
    /**
     * Retrieve the dialog container element.
     *
     * @return {HTMLElement} The dialog container element.
     */
    public getDialogContainer() {
        return this.locate('div', { role: 'dialog' });
    }

    /**
     * Retrieves the title of the dialog.
     *
     * @return {Promise<string|null>} The title of the dialog, or null if it cannot be found.
     */
    public async getDialogTitle() {
        const container = this.getDialogContainer().getLocator();
        const titleTexts = await container.locator('h2').allInnerTexts();

        if (titleTexts.length < 1) return null;
        return titleTexts[0];
    }

    /**
     * Waits for the dialog to open.
     *
     * @return {Promise<void>} A promise that resolves when the dialog is open.
     */
    public async waitForDialogOpen() {
        const element = this.getDialogContainer().getLocator();
        await element.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Checks if the form is open.
     *
     * @return {Promise<void>} Returns a promise that resolves when the form is open.
     */
    public async checkFormIsOpen(isOpen: boolean = true) {
        const element = this.getDialogContainer();
        expect(await element.isVisible(), {
            message: 'checking  form is open or not.',
        }).toBe(isOpen);
    }

    /**
     * Check if the dialog title matches the expected title.
     *
     * @param {string} title - The expected dialog title.
     * @return {Promise<void>} - Resolves when the dialog title matches the expected title.
     */
    public async checkDialogTitle(title: string): Promise<void> {
        const dialogTitle = await this.getDialogTitle();

        expect(dialogTitle, {
            message: `Dialog title check: "${title}"`,
        }).toBe(title);
    }

    /**
     * Closes the dialog.
     *
     * @return {Promise<void>} - A Promise that resolves once the dialog is closed.
     */
    public async closeDialog(): Promise<void> {
        await this.getDialogContainer()
            .getLocator()
            .locator('.dialog-close')
            .click();
    }

    async verifyInputField(fieldName): Promise<void> {
        const dialogContainer = this.getDialogContainer();
        const parentLocator = dialogContainer.locate(
            `//span[text()="${fieldName}"]/parent::label/parent::div`
        )._locator;

        await expect(
            parentLocator,
            chalk.red(`Dialog ${fieldName} visibility`)
        ).toBeVisible();
    }

    /**
     * Checks if the confirm dialog is open.
     *
     * @return {Promise<boolean>} Returns a promise that resolves to a boolean indicating whether the confirm dialog is open or not.
     */
    public async isConfirmDialogOpen() {
        const dialog = this.locateByText(
            'Do you want to exit? The details you have entered will be deleted.'
        );
        await this._page.waitForLoadState('domcontentloaded');
        return dialog.isVisible();
    }

    //they handle confirm dialog
    public async checkConfirmDialogOpenOrNot() {
        await this.closeDialog();

        expect(
            await this.isConfirmDialogOpen(),
            'check confirm dialog open or not'
        ).toBeTruthy();
    }

    /**
     * Clicks the specified option on the confirm dialog.
     *
     * @param {string} option - The option to check text on the confirm dialog.
     * @return {Promise<void>} - A promise that resolves when the option is clicked.
     */
    public async clickConfirmDialogAction(option: string) {
        const dialogContainer = this.getDialogContainer().getLocator();
        await dialogContainer.locator('button', { hasText: option }).click();
    }
}
