import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

export class NotificationHelper extends BaseHelper {
    /**
     * Retrieves the success message from the toast element.
     *
     * @return {Promise<string>} The success message from the toast element.
     */
    async getToastSuccess(): Promise<string> {
        await this._page.waitForSelector('div.ct-toast-success');
        const toast = this.locate('div', {
            class: ['ct-toast-success'],
        })._locator;
        const toastCount = await toast.count();
        if (toastCount > 0) {
            for (let i = 0; i < toastCount; i++) {
                const successMsg = await toast.last().innerText();
                return successMsg;
            }
        }
    }

    /**
     * Checks if the toast message is a success message.
     *
     * @param {string | number} message - The message to be checked.
     * @return {Promise<void>} A promise that resolves once the check is complete.
     */
    async checkToastSuccess(message: string | number): Promise<void> {
        const toastMessage = await this.getToastSuccess();
        expect(toastMessage, chalk.red('Toast Message check ')).toBe(message);
    }

    /**
     * Retrieves the error message from the toast element.
     *
     * @return {Promise<string>} The error message from the toast element.
     */
    async getToastError(): Promise<string> {
        const toast = this.locate('div', {
            class: ['ct-toast-error'],
        })._locator;

        const toastCount = await toast.count();
        if (toastCount > 0) {
            for (let i = 0; i < toastCount; i++) {
                const errorMsg = await toast.last().innerText();
                return errorMsg;
            }
        }
    }
    /**
     * Checks if the toast error message matches the expected message.
     *
     * @param {string | number} message - The expected error message.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    async checkToastError(message: string | number): Promise<void> {
        const toastMessage = await this.getToastError();
        expect(toastMessage, chalk.red('Toast Message check ')).toBe(message);
    }

    /**
     * Retrieves the warning message from the toast element.
     *
     * @return {Promise<string>} The warning message.
     */
    async getToastWarning(): Promise<string> {
        const toast = this.locate('div', { class: ['ct-toast-warn'] })._locator;
        const toastCount = await toast.count();
        if (toastCount > 0) {
            for (let i = 0; i < toastCount; i++) {
                const warningMsg = await toast.last().innerText();
                return warningMsg;
            }
        }
    }
    /**
     * Checks the toast warning message against the expected message.
     *
     * @param {string | number} message - The expected message to check against.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    async checkToastWarning(message: string | number): Promise<void> {
        const toastMessage = await this.getToastWarning();
        expect(toastMessage, chalk.red('Toast Message check ')).toBe(message);
    }

    /**
     * Retrieves the loading message from the toast.
     *
     * @return {Promise<string>} The loading message.
     */
    async getToastLoading(): Promise<string> {
        const toast = this.locate('div', { class: ['ct-toast-load'] })._locator;
        const toastCount = await toast.count();
        if (toastCount > 0) {
            for (let i = 0; i < toastCount; i++) {
                const loadingMsg = await toast.last().innerText();
                return loadingMsg;
            }
        }
    }

    /**
     * Checks if the toast message is loading.
     *
     * @param {string | number} message - The message to check.
     * @return {Promise<void>} Returns a promise that resolves when the check is complete.
     */
    async checkToastLoading(message: string | number): Promise<void> {
        const toastMessage = await this.getToastLoading();
        expect(toastMessage, chalk.red('Toast Message check ')).toBe(message);
    }
    /**
     * Retrieves the error message from the DOM.
     *
     * @return {Promise<string>} The error message, if any.
     */

    async getErrorMessage() {
        const error = this.locate('span', {
            class: ['label.text-error'],
        })._locator;
        const errorCount = await error.count();
        console.log(chalk.red(`Error ocurred: ${errorCount}`));
        if (errorCount > 0) {
            for (let i = 0; i < errorCount; i++) {
                const errorMsg = await error.nth(i).innerText();
                console.log('Error: ', chalk.red(errorMsg));
                return errorMsg;
            }
        }
    }

    /**
     * Checks the error message against the provided message.
     *
     * @param {string | number} message - The message to check against the error message.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    async checkErrorMessage(message: string | number): Promise<void> {
        const toastMessage = await this.getErrorMessage();
        expect(toastMessage, chalk.red('Error Message check ')).toBe(message);
    }
}
