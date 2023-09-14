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

    public async checkFormIsOpen() {
        const element = await this.getDialogContainer();
        expect(await element.isVisible(), {
            message: 'checking  form is open or not.',
        }).toBe(true);
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

    //they handle confirm dialog
    public async checkConfirmDialogOpenOrNot() {
        await this.closeDialog();

        const dialog = await this.locateByText(
            'Do you want to exit? The details you have entered will be deleted.'
        );
        await this._page.waitForLoadState('domcontentloaded');

        expect(await dialog.isVisible(), 'check confirm dialog open or not');

        // await this.clickConfirmDialogAction('Yes!');
    }

    public async clickConfirmDialogAction(option: string) {
        const dialogContainer = this.getDialogContainer().getLocator();
        await dialogContainer.locator(`//span[text()='${option}']`).click();
    }
}
