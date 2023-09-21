import { BaseHelper } from '@/baseHelper';
import { ObjectDto } from '@/types/common.types';
import { AccessNestedObject } from '@/utils/common.utils';
import { Locator, Page, expect } from '@playwright/test';
import chalk from 'chalk';
import { BreadCrumbHelper } from './breadCrumb.helper';
import { DialogHelper } from './dialog.helper';
import { Logger } from './log.helper';

export class FormHelper extends BaseHelper {
    public breadcrumbHelper: BreadCrumbHelper;
    public dialogHelper: DialogHelper;

    public constructor(page: Page) {
        super(page);
        this.breadcrumbHelper = new BreadCrumbHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }

    /**
     * Check the title of the form dialog.
     *
     * @param {string} title - The title to be checked.
     * @return {Promise<void>} - A promise that resolves when the check is complete.
     */
    public async checkTitle(title: string) {
        await this.dialogHelper.checkDialogTitle(title);
    }

    /**
     * Check the page title of page.
     *
     * @param {string} title - The title to check.
     * @return {Promise<void>} - A promise that resolves when the function completes.
     */
    public async checkPageTitle(title: string) {
        await this.breadcrumbHelper.checkBreadCrumbTitle(title);
    }

    /**
     * Retrieves the input element based on the given options.
     *
     * @param {InputFieldLocatorOptions} options - The options to locate the input element.
     * @return {Locator} The locator of the input element.
     */
    public getInputElement(options: InputFieldLocatorOptions): Locator {
        return this.locate(options.type === 'textarea' ? 'textarea' : 'input', {
            ...options,
            type: undefined,
        }).getLocator();
    }

    /**
     * Returns the error element associated with the input field specified by the given options.
     *
     * @param {InputFieldLocatorOptions} options - The options to locate the input field.
     * @return {Locator} - The error element locator.
     */
    public getInputError(options: InputFieldLocatorOptions): Locator {
        const input = this.getInputElement(options);
        return input
            .locator('//ancestor::div[contains(@class,"form-control")]')
            .locator('span.label.text-error');
    }

    /**
     * Retrieves the error message associated with the input field.
     *
     * @param {InputFieldLocatorOptions} options - The options to locate the input field.
     * @return {Promise<string>} The error message associated with the input field.
     */
    public async getInputErrorMessage(options: InputFieldLocatorOptions) {
        return this.getInputError(options).innerText();
    }

    /**
     * Checks if the input has an error.
     *
     * @param {string} message - The error message to check.
     * @param {InputFieldLocatorOptions} options - Options for locating the input field.
     */
    public async checkIsInputHasErrorMessage(
        message: string,
        options: InputFieldLocatorOptions
    ) {
        const inputError = await this.getInputErrorMessage(options);
        expect(inputError, `Check input has error message: ${message}`).toBe(
            message
        );
    }

    /**
     * Checks if the input field specified by the given options is editable.
     *
     * @param {InputFieldLocatorOptions} options - The options to locate the input field.
     */
    public async checkIsInputEditable(options: InputFieldLocatorOptions) {
        const input = this.getInputElement(options);
        await expect(
            input,
            `Check input is editable: ${this._tempSelector}`
        ).toBeEditable();
    }

    /**
     * Checks if the input field specified by the given options is disabled.
     *
     * @param {InputFieldLocatorOptions} options - The options to locate the input field.
     */
    public async checkIsInputDisabled(options: InputFieldLocatorOptions) {
        const input = this.getInputElement(options);
        await expect(
            input,
            `Check input is disabled: ${this._tempSelector}`
        ).toBeDisabled();
    }

    /**
     * This function checks if the input field with the given name is empty.
     * It uses the `locate` function to find the input element with a specific `name` attribute.
     * The value of the input field is retrieved using the `inputValue` function.
     * It then asserts that the value of the input field is an empty string using the `expect` function.
     *
     * @param inputName - The name of the input field to check.
     * @returns A promise that resolves when the input field is confirmed to be empty.
     */
    async checkIsInputFieldEmpty(
        inputName: string,
        type?: string
    ): Promise<void> {
        await expect(
            this.getInputElement({ name: inputName, type }),
            `Check ${inputName} field is empty`
        ).toBeEmpty();
    }

    /**
     * fill form by passing object data. And key should be name of input.
     */
    public async fillFormInputInformation(
        formSchema: ObjectDto,
        data: ObjectDto,
        targetClick?: string,
        ignoreFields: string[] = []
    ): Promise<void> {
        for (const [key, schema] of Object.entries(formSchema)) {
            const name = schema?.name ?? key;
            const value = AccessNestedObject(data, name) || '';
            if (ignoreFields.includes(name)) continue;
            if (!value) continue;

            switch (schema?.type) {
                case 'select':
                    await this.selectOption({
                        name,
                        option: value ? String(value) : '',
                        exact: true,
                    });
                    break;
                case 'reference_select':
                    await this.selectOption({
                        name,
                        input: value ? String(value) : '',
                    });
                    break;

                case 'textarea':
                    await this.fillText(value, { name });
                    break;
                default:
                    await this.fillInput(value, {
                        name,
                    });
            }
        }
        if (!targetClick) return;
        await this.click({
            selector: 'input',
            name: targetClick,
        });
    }

    /**
     * Fills a textarea form field with the provided data.
     *
     * @param {ObjectDto} data - The data to fill the form with.
     * @param {string} targetClick - (optional) The target to click after filling the form.
     * @return {Promise<void>} A promise that resolves when the form is filled.
     */
    public async fillTextAreaForm(
        data: ObjectDto,
        targetClick?: string
    ): Promise<void> {
        console.log(chalk.blue('Filling form TextArea information ....'));
        for (const [key, value] of Object.entries(data)) {
            await this.fillText(value, {
                name: key,
            });
        }
        if (!targetClick) return;
        await this.click({
            selector: 'textarea',
            name: targetClick,
        });
    }

    /**
     * it helps to submit the form
     */
    public async submitButton(
        button_title: string = 'Save',
        options?: {
            waitForNetwork?: boolean;
            clickSubmit?: boolean;
        }
    ) {
        const { waitForNetwork, clickSubmit = true } = options || {};

        if (waitForNetwork) await this._page.waitForTimeout(300);

        const btnClick = this._page.getByRole('button', { name: button_title });

        if (clickSubmit) await this._clickSubmitButton(btnClick);

        return btnClick;
    }

    /**
     * Checks if the submit button is disabled.
     *
     * @param {string} button_title - The title of the submit button. Defaults to 'Save'.
     * @return {Promise<void>} A promise that resolves once the check is complete.
     */
    public async checkSubmitIsDisabled(
        button_title: string = 'Save'
    ): Promise<void> {
        const submitButton = await this.submitButton(button_title, {
            clickSubmit: false,
        });
        await this._page.waitForLoadState('networkidle');

        expect(await submitButton.isEnabled(), {
            message: 'check save button disabled',
        }).toBeFalsy();
    }

    /**
     * Checks if the input field is mandatory.
     *
     * @param {InputFieldLocatorOptions} options - The options for locating the input field.
     * @return {Promise<boolean>} - Returns a promise that resolves to a boolean value indicating if the input field is mandatory.
     */
    public async isInputMandatory(
        options?: InputFieldLocatorOptions
    ): Promise<boolean> {
        const input = this.getInputElement(options);

        return input
            .locator('//ancestor::div[contains(@class,"form-control")]/label')
            .locator('//span/span[contains(@class,"text-error")]', {
                hasText: '*',
            })
            .isVisible();
    }

    /**
     * Checks the mandatory fields in the given form schema.
     *
     * @param {ObjectDto} formSchema - The form schema to check.
     * @return {Promise<void>} - A promise that resolves when the mandatory fields have been checked.
     */
    public async checkIsMandatoryFields(
        formSchema: ObjectDto,
        ignoreFields: string[] = []
    ): Promise<void> {
        for (const [name, fieldSchema] of Object.entries(formSchema)) {
            if (!fieldSchema?.required) continue;
            if (ignoreFields.includes(name)) continue;
            expect(
                await this.isInputMandatory({ name, type: fieldSchema?.type }),
                {
                    message: `${name} mandatory checking...`,
                }
            ).toBeTruthy();
        }
    }

    public async checkAllMandatoryInputHasErrors(
        formSchema: ObjectDto,
        ignoreFields: string[] = []
    ): Promise<void> {
        for (const [key, fieldSchema] of Object.entries(formSchema)) {
            const name = fieldSchema?.name ?? key;
            if (ignoreFields.includes(name)) continue;
            if (!fieldSchema?.required) continue;
            await this.checkInputError(name, fieldSchema);
        }
    }

    public async checkInputError(
        name: string,
        schema: ObjectDto,
        message?: string
    ) {
        const errorMessage = this.getInputError({
            name,
            type: schema.type,
        });

        await expect(errorMessage).toBeVisible();
        if (message) {
            await this.checkIsInputHasErrorMessage(message, {
                name,
                type: schema.type,
            });
        }
    }

    /**
     * Closes the form.
     *
     * @return {Promise<void>} - A promise that resolves when the form is closed.
     */
    public async closeForm() {
        await this.dialogHelper.closeDialog();
    }

    /**
     * Check and Click Submit Button if enabled.
     *
     * @param {any} button - The submit button element.
     * @return {Promise<void>} - A promise that resolves when the actions are completed.
     */
    private async _clickSubmitButton(button: any) {
        expect(await button.isEnabled(), {
            message: 'check save button enabled',
        }).toBe(true);
        await button.click();
        const button_title = await button.textContent();

        Logger.info(`${button_title} is clicked`);

        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
    }
}
