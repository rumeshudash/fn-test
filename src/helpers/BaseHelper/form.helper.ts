import { BaseHelper } from '@/baseHelper';
import { Locator, Page, expect } from '@playwright/test';
import { BreadCrumbHelper } from './breadCrumb.helper';
import { DialogHelper } from './dialog.helper';
import chalk from 'chalk';
import { ObjectDto } from '@/types/common.types';

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
        return this.locate('input', options).getLocator();
    }

    /**
     * Checks if the input field specified by the given options is editable.
     *
     * @param {InputFieldLocatorOptions} options - The options to locate the input field.
     */
    public checkIsInputEditable(options: InputFieldLocatorOptions) {
        const input = this.getInputElement(options);
        expect(
            input,
            `Check input is editable: ${this._tempSelector}`
        ).toBeEditable();
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
     * Checks if the input has an error.
     *
     * @param {string} message - The error message to check.
     * @param {InputFieldLocatorOptions} options - Options for locating the input field.
     */
    public async checkIsInputHasError(
        message: string,
        options: InputFieldLocatorOptions
    ) {
        const inputError = await this.getInputError(options).innerText();
        expect(inputError, `Check input has error message: ${message}`).toBe(
            message
        );
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
    async isInputFieldEmpty(inputName: string): Promise<void> {
        const nameField: string = await this.locate('input', {
            name: inputName,
        })._locator.inputValue();
        expect(nameField, chalk.red(`${inputName} field check`)).toBe('');
    }

    /**
     * fill form by passing object data. And key should be name of input.
     */
    public async fillFormInputInformation(
        formSchema: ObjectDto,
        data: ObjectDto,
        targetClick?: string
    ): Promise<void> {
        for (const [name, schema] of Object.entries(formSchema)) {
            const value = data[name] || '';
            switch (schema?.type) {
                case 'select':
                    await this.selectOption({
                        name,

                        option: value ? String(value) : '',
                    });

                    break;

                case 'textarea':
                    await this.fillText(value, { name });
                    break;
                default:
                    await this.fillInput(value, {
                        name: name,
                    });
            }
        }
        if (!targetClick) return;
        await this.click({
            selector: 'input',
            name: targetClick,
        });
    }

    public async fillTextAreaForm(
        data: ObjectDto,
        targetClick?: string
    ): Promise<void> {
        console.log(chalk.blue('Filling form input information ....'));
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

    private async _clickSubmitButton(button: any) {
        expect(await button.isEnabled(), {
            message: 'check save button enabled',
        }).toBe(true);
        await button.click();
        const button_title = await button.textContent();
        console.log(chalk.yellow(`${button_title} is clicked`));
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
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

    public async checkDisableSubmit(
        button_title: string = 'Save'
    ): Promise<void> {
        const submitButton = await this.submitButton(button_title, {
            clickSubmit: false,
        });
        await this._page.waitForLoadState('networkidle');
        await expect(await submitButton.isEnabled(), {
            message: 'check save button disabled',
        }).toBeFalsy();
    }

    public async checkMandatoryFields(formSchema: ObjectDto): Promise<void> {
        for (const [name, fieldSchema] of Object.entries(formSchema)) {
            if (!fieldSchema?.required) continue;
            expect(
                await this.isInputMandatory(
                    { name },
                    fieldSchema?.type === 'textarea' ? 'textarea' : 'input'
                ),
                {
                    message: `${name} mandatory checking...`,
                }
            ).toBeTruthy();
        }
    }

    public async checkAllMandatoryInputErrors(
        formSchema: ObjectDto
    ): Promise<void> {
        for (const [name, fieldSchema] of Object.entries(formSchema)) {
            if (!fieldSchema?.required) continue;
            await this.checkInputError(name, fieldSchema);
        }
    }

    public async checkInputError(
        name: string,
        schema: ObjectDto,
        message?: string
    ) {
        const errorMessage = await this.checkInputErrorMessage(
            {
                name,
            },
            schema?.type === 'textarea' ? 'textarea' : 'input'
        );

        expect(await errorMessage.isVisible()).toBe(true);
        if (message) await this.matchedInputErrorMessage(message, errorMessage);
    }

    public async matchedInputErrorMessage(
        message: string,
        element: any
    ): Promise<void> {
        await this._page.waitForLoadState('networkidle');

        // for comparing two error message
        if (!message || !element) return;

        let textContent = await element.textContent();
        textContent = textContent.trim();

        if (textContent === message) return console.log(chalk.red(textContent));
        throw console.log(
            chalk.red(
                `"${textContent}" is not a valid error !! valid valid error should be "${message}"`
            )
        );
    }
}
