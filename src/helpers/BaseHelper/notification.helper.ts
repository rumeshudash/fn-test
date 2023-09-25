import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { Logger } from './log.helper';

export class NotificationHelper extends BaseHelper {
    /**
     * Retrieves the toast messages of the specified type.
     *
     * @param {'success' | 'error' | 'warn' | 'load'} type - The type of toast message to retrieve.
     * @return {Promise<string[]>} - An array of toast messages of the specified type, or empty array if no toast messages are found.
     */
    public async getToastMessage(type: 'success' | 'error' | 'warn' | 'load') {
        await this._page.waitForSelector(`div.ct-toast-${type}`);
        const toast = this.locate('div', {
            class: [`ct-toast-${type}`],
        }).getLocator();

        const toastCount = await toast.count();
        if (!toastCount) return [];
        return toast.allInnerTexts();
    }

    /**
     * Retrieves the toast success message.
     *
     * @return {Promise<string[]>} The success message.
     */
    public async getToastSuccess(): Promise<string[]> {
        return this.getToastMessage('success');
    }

    /**
     * Check if a toast success message matches the expected message.
     *
     * @param {string | number} message - The message to check against the toast.
     * @return {Promise<void>} A promise that resolves when the check is complete.
     */
    public async checkToastSuccess(message: string | number): Promise<void> {
        const toastMessage = await this.getToastSuccess();
        this._checkToastMessage(toastMessage, message);
    }

    /**
     * Retrieves the toast error message.
     *
     * @return {Promise<string[]>} The toast error message.
     */
    public async getToastError(): Promise<string[]> {
        return this.getToastMessage('error');
    }

    /**
     * Check if a toast error message matches the expected message.
     *
     * @param {string | number} message - The expected error message.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    public async checkToastError(message: string | number): Promise<void> {
        const toastMessage = await this.getToastError();
        this._checkToastMessage(toastMessage, message);
    }

    /**
     * Retrieves a warning toast message.
     *
     * @return {Promise<string[]>} An array of warning toast messages.
     */
    public async getToastWarning(): Promise<string[]> {
        return this.getToastMessage('warn');
    }

    /**
     * Check if a toast warning message matches the expected message.
     *
     * @param {string | number} message - The expected warning message.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    public async checkToastWarning(message: string | number): Promise<void> {
        const toastMessage = await this.getToastWarning();
        this._checkToastMessage(toastMessage, message);
    }

    /**
     * Retrieves the toast loading message.
     *
     * @return {Promise<string[]>} A promise that resolves to an array of toast messages.
     */
    public async getToastLoading(): Promise<string[]> {
        return this.getToastMessage('load');
    }

    /**
     * Check if a toast loading message matches the expected message.
     *
     * @param {string | number} message - The expected loading message.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    public async checkToastLoading(message: string | number): Promise<void> {
        const toastMessage = await this.getToastLoading();
        this._checkToastMessage(toastMessage, message);
    }

    public async getErrorMessage() {
        const error = this.locate('span', {
            class: ['label.text-error'],
        })._locator;
        const errorCount = await error.count();

        Logger.warning(`Error ocurred: ${errorCount}`);
        if (errorCount > 0) {
            for (let i = 0; i < errorCount; i++) {
                const errorMsg = await error.nth(i).innerText();
                Logger.info('Error: ', chalk.dim(errorMsg));
                return errorMsg;
            }
        }
    }

    public async checkErrorMessage(message: string | number): Promise<void> {
        const toastMessage = await this.getErrorMessage();
        expect(toastMessage, 'Error Message check ').toBe(message);
    }

    /**
     * Checks if a given toast message is present in the list of toast messages.
     *
     * @param {string[]} toastMessages - The list of toast messages to check.
     * @param {string | number} message - The toast message to look for.
     */
    private _checkToastMessage(
        toastMessages: string[],
        message: string | number
    ) {
        expect(
            toastMessages,
            `Checking toast message: ${message}`
        ).toContainEqual(message);
    }
}
