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

    async isInputFieldEmpty(inputName: string): Promise<void> {
        const name_field = await this.locate('input', {
            name: inputName,
        })._locator.inputValue();
        expect(name_field, chalk.red('Name field value')).toBe('');
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
            switch (schema?.type) {
                case 'select':
                    return await this.selectOption({
                        name,
                        option: String(data[name]),
                    });
                case 'textarea':
                    return await this.fillText(data[name], { name });
                default:
                    await this.fillInput(data[name], {
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

    /**
     * it helps to submit the form
     */
    public async submitButton(button_title: string = 'Save') {
        const btnClick = this._page.getByRole('button', { name: button_title });
        expect(await btnClick.isEnabled(), {
            message: 'check save button enabled',
        }).toBe(true);

        await btnClick.click();
        await this._page.waitForLoadState('networkidle');
        return btnClick;
    }

    public async checkDisableSubmit(
        button_title: string = 'Save'
    ): Promise<void> {
        const submitButton = await this.submitButton(button_title);
        expect(await submitButton.isEnabled(), {
            message: 'check save button disabled',
        }).toBe(false);
    }

    public async checkMandatoryFields(schema: ObjectDto): Promise<void> {
        for (const [name, fieldSchema] of Object.entries(schema)) {
            if (!fieldSchema?.required) continue;
            expect(await this.isInputMandatory({ name }), {
                message: `${name} mandatory checking...`,
            }).toBeTruthy();
        }
    }
}
