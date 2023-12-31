import { uuidV4 } from '@/utils/common.utils';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { Locator, Page } from 'playwright-core';
import { LISTING_ROUTES, TEST_URL } from '../../constants/api.constants';
import { Logger } from './log.helper';

export class BaseHelper {
    protected _page: Page;
    protected _locator: Locator;
    protected _tempSelector: string = '';

    constructor(page: Page) {
        this._page = page;
        this._locator = page.locator('html ');
    }

    private _getSelector(
        options: LocatorOptions & {
            selector?: string;
            [key: string]: any;
        } = {}
    ) {
        let selector = options.selector || this._tempSelector;
        if (options.role) {
            selector += `[role=${options.role}]${
                options.name ? `[name=${options.name}]` : ''
            }`;
        }
        if (options.text) {
            selector += `[text=${options.text}]`;
        }
        return selector;
    }
    public getLocator() {
        return this._locator;
    }
    public setLocator(locator: Locator) {
        return (this._locator = locator);
    }
    public clearLocator() {
        this._locator = this._page.locator('html ');
    }

    /**
     * Locates an element based on the given selector and options.
     *
     * @param {string} [selector] - The CSS selector to locate the element.
     * @param {LocatorOptions} [options={}] - The options for locating the element.
     * @return {this} - Returns the current instance of the class.
     */
    public locate(
        selector?: string,
        options: LocatorOptions = {},
        exactText: boolean = false
    ) {
        this._tempSelector = selector || 'html ';

        if (options.id) {
            this._tempSelector += `#${options.id}`;
        }
        if (options.class) {
            this._tempSelector += `.${options.class.join('.')}`;
        }

        if (!options.role && options.name) {
            this._tempSelector += `[name='${options.name}']`;
        }

        if (options.type) {
            this._tempSelector += `[type='${options.type}']`;
        }

        this._locator = this._page.locator(this._tempSelector);

        if (options.role) {
            this._locator = this._locator.getByRole(options.role, {
                name: options.name,
                exact: options.exactText,
            });
        }

        if (options.placeholder) {
            this._locator = this._locator.getByPlaceholder(options.placeholder);
        }

        if (options.text) {
            this._locator = this._locator.getByText(options.text, {
                exact: options.exactText,
            });
        }
        if (options.label) {
            this._locator = this._locator.getByLabel(options.label);
        }

        return this;
    }

    /**
     * Locates an element by text.
     *
     * @param {string | RegExp} text - The text to locate.
     * @param {Omit<LocatorOptions, "text"> & {
     *            selector?: string;
     *            exactText?: boolean;
     *        }} [options] - Additional options for locating the element.
     * @return {any} The located element.
     */
    public locateByText(
        text: string | RegExp,
        options?: Omit<LocatorOptions, 'text'> & {
            selector?: string;
        }
    ) {
        const { selector, ...rest } = options || {};
        return this.locate(selector, { ...rest, text }).getLocator();
    }

    /**
     * Locates an element by its label.
     *
     * @param {string} label - The label of the element.
     * @param {Omit<LocatorOptions, "text"> & {selector?: string}} options - The options for locating the element.
     * @return {Locator} The locator for the element.
     */
    public locateByLabel(
        label: string,
        options?: Omit<LocatorOptions, 'text'> & {
            selector?: string;
        }
    ) {
        const { selector, ...rest } = options || {};
        return this.locate(selector, { ...rest, label }).getLocator();
    }

    /**
     * Locate an element by its role.
     *
     * @param {LocatorRoles} role - The role of the element to locate.
     * @param {Omit<LocatorOptions, "role"> & {
     *            selector?: string;
     *            exactText?: boolean;
     *        }} options - Additional options for locating the element.
     * @return {<returnType>} - The located element.
     */
    public locateByRole(
        role: LocatorRoles,
        options?: Omit<LocatorOptions, 'role'> & {
            selector?: string;
        }
    ) {
        const { selector, ...rest } = options || {};
        return this.locate(selector, { ...rest, role }).getLocator();
    }

    // Actions

    /**
     * Navigates to a specified URL Identifier.
     *
     * @param {keyof typeof LISTING_ROUTES} identifier - The URL to navigate to.
     * @return {Promise<void>} A promise that resolves when the navigation is complete.
     */
    public async navigateTo(
        identifier: keyof typeof LISTING_ROUTES,
        Phone?: string
    ) {
        let finalUrl = LISTING_ROUTES[identifier];

        // Check if Phone parameter is provided
        if (Phone) {
            // Append Phone to the URL if provided
            finalUrl += `${Phone}`;
        }

        await this._page.goto(finalUrl, {
            waitUntil: 'networkidle',
        });
        await this._page.waitForLoadState('domcontentloaded');
    }

    /**
     * Navigates to a specified URL.
     *
     * @param {keyof typeof LISTING_ROUTES} url - The URL to navigate to.
     * @return {Promise<void>} A promise that resolves when the navigation is complete.
     */
    public async navigateToUrl(url: string) {
        await this._page.goto(TEST_URL + url, {
            waitUntil: 'networkidle',
        });
    }

    /**
     * Fills the specified text in a given element.
     *
     * @param {string | number} text - The text to be filled.
     * @param {LocatorOptions & { selector?: string }} options - The options for locating the element.
     * @return {Promise<void>} - A promise that resolves when the text is successfully filled.
     */
    public async fillText(
        text: string | number,
        options?: LocatorOptions & { selector?: string }
    ) {
        const { selector, ...rest } = options || {};
        if (options && Object.keys(options).length) this.locate(selector, rest);

        await expect(
            this._locator,
            `Checking ${this._tempSelector} does exist!!`
        ).toBeVisible();

        Logger.info(`Fill: ${text} in ${this._getSelector(options)}`);
        await this._locator.fill(text + '');

        Logger.success(`Fill: ${text} in ${this._getSelector(options)}`);
    }

    /**
     * Fill the input with the specified text.
     *
     * @param {string | number} text - The text to fill the input with.
     * @param {string} options.selector - The selector to identify the input element.
     * @param {string} options.placeholder - The placeholder text for the input.
     * @param {string} options.label - The label associated with the input.
     * @param {string} options.name - The name attribute of the input.
     * @return {Promise<void>} A promise that resolves when the input is filled.
     */
    public async fillInput(
        text: string | number,
        options?: InputFieldLocatorOptions
    ) {
        const { selector, placeholder, name, label, type, hasText } =
            options || {};
        if (options && Object.keys(options).length) {
            await this.fillText(text + '', {
                selector: selector || 'input',
                placeholder,
                name,
                label,
                type,
            });
            return;
        }
        await this.fillText(text + '');
    }

    // public async errorMessage(text: string, selector: string) {
    //   await this.fillText(text + "", {
    //     selector: selector || "input",
    //   });
    // }

    /**
     * Retrieves the select box element based on the provided options.
     *
     * @param {SelectBoxLocatorOptions} options - The options for locating the select box element.
     *    - selector: The CSS selector to locate the select box element. (optional)
     *    - placeholder: The placeholder text to locate the select box element. (optional)
     *    - name: The name attribute value of the input element to locate the select box element. (optional)
     *    - hasText: The text value to locate the select box element. (optional)
     * @return {Element} The located select box element.
     */
    public getSelectBoxElement(options?: SelectBoxLocatorOptions) {
        const { selector, placeholder, name, hasText } = options || {};

        let tempSelector = '//div[contains(@class,"selectbox-container")]';

        if (placeholder)
            tempSelector += `//div[contains(@class,"placeholder")][text()="${placeholder}"]/ancestor::div[contains(@class,"selectbox-container")]`;

        if (name)
            tempSelector += `//input[@name='${name}']/ancestor::div[contains(@class,"selectbox-container")]`;

        if (hasText)
            tempSelector += `//div[text()="${hasText}"]/ancestor::div[contains(@class,"selectbox-container")]`;

        return this.locate(selector || tempSelector);
    }

    /**
     * Selects an option from a dropdown menu based on the provided options.
     *
     * @param {string | number} options.option - The value of the option to select.
     * @param {string | number} options.input - The value to fill in the input field.
     * @param {string} options.selector - The selector to locate the dropdown menu.
     * @param {string} options.placeholder - The placeholder text of the dropdown menu.
     * @param {string} options.label - The label text of the dropdown menu.
     * @param {string} options.name - The name attribute of the input field.
     * @return {Promise<void>} A promise that resolves when the option is selected.
     */
    public async selectOption(options?: SelectBoxLocatorOptions) {
        const { input, option } = options || {};

        const selectBox = this.getSelectBoxElement(options);

        if (input) {
            await selectBox
                .getLocator()
                .locator('input[type="text"]')
                .fill(input + '');
            await this._page.waitForTimeout(1000);
            await this._page.waitForLoadState('networkidle');
        } else {
            await selectBox.click();
        }
        Logger.info(`${input || option} is selected`);

        const elements = await selectBox
            .getLocator()
            .locator(
                `//div[contains(@class,"MenuList")]//div[contains(@class,"option")]//div[contains(text(),"${
                    input || option
                }")]`
            )
            .elementHandles();

        expect(elements.length, {
            message: `check ${input || option}  dropdown`,
        }).toBeGreaterThanOrEqual(1);

        if (elements.length === 1) {
            await elements[0].click();
        } else if (elements.length > 1) {
            for (const element of elements) {
                const textContent = await element.textContent();
                if (textContent === input || textContent === option) {
                    await element.click();
                    break;
                }
            }
        } else {
            throw new Error(chalk.red(`check ${input || option} in dropdown`));
        }
    }

    /**
     * Opens the select box and returns the select box element.
     *
     * @param {SelectBoxLocatorOptions} [options] - The options for locating the select box element.
     * @return {Promise<ElementHandle>} The select box element.
     */
    public async openSelectBox(options?: SelectBoxLocatorOptions) {
        const selectBox = this.getSelectBoxElement(options);
        await selectBox.click();
        return selectBox;
    }

    /**
     * Clicks on the select box's footer action.
     *
     * @param {SelectBoxLocatorOptions} options - The options for locating the select box.
     * @param {string} actionName - The name of the action to perform on the select box footer. (optional)
     * @return {Promise<void>} A promise that resolves when the action is clicked.
     */
    public async clickSelectBoxFooterAction(
        options?: SelectBoxLocatorOptions,
        actionName?: string
    ) {
        const selectBox = this.getSelectBoxElement(options);
        const menuFooter = selectBox
            .getLocator()
            .locator(
                `//div[contains(@class,"Menu")]/div[contains(@class, "menu-footer")]`
            );

        let button = menuFooter.locator('button');
        if (actionName) {
            button = menuFooter.locator('button', { hasText: actionName });
        }

        await expect(button, 'Checking footer button is visible').toBeVisible();

        this.setLocator(button);
        await this.click();
    }

    /**
     * Clicks the specified element or coordinates with the specified button.
     *
     * @param {LocatorOptions & { selector?: string; button?: "left" | "right" | "middle" | undefined; }} options - The options for the click action.
     * @return {Promise<void>} A promise that resolves when the click action is complete.
     */
    public async click(
        options?: LocatorOptions & {
            selector?: string;
            button?: 'left' | 'right' | 'middle';
        }
    ): Promise<void> {
        const { selector, button = 'left', ...rest } = options || {};
        if (options) this.locate(selector, rest);

        Logger.info(`Click: ${button} click in ${this._getSelector(options)}`);
        await this._locator.click({ button });
        await this._page.waitForTimeout(500);
        await this._page.waitForLoadState('networkidle');
        Logger.success(
            `Click: ${button} click in ${this._getSelector(options)}`
        );
    }

    /**
     * @deprecated Use `FormHelper.getInputErrorMessage() instead;
     */
    public async getInputErrorMessageElement(
        options?: InputFieldLocatorOptions,
        selector?: 'input' | 'textarea'
    ) {
        if (options && Object.keys(options).length)
            this.locate(selector || 'input', options);

        const errorElement = this._locator
            .locator('//ancestor::div[contains(@class,"form-control")]')
            .locator(
                '//span[contains(@class," label label-text-alt text-error")]'
            );
        const textError = await errorElement?.textContent();

        console.log(
            chalk.blue(
                'Input Error Message:-->',
                chalk.red(chalk.red(textError))
            )
        );
        return errorElement;
    }

    public async checkDisplayName() {
        const display_input = await this._page
            .locator('#display_name')
            .textContent();
        return display_input;
    }
    public async checkDisplayNameVisibility() {
        const display_input = await this._page
            .locator('#display_name')
            .isVisible();
        return display_input;
    }
    public async checkWizardNavigationClickDocument(navLink: string) {
        const document_navigation = this._page.getByText(navLink, {
            exact: true,
        });
        await document_navigation.click();

        const vendorBankDetails = this._page.locator(
            "(//div[contains(@class,'flex items-center')])[2]"
        );
        await this._page.waitForTimeout(300);
        await this._page.waitForLoadState('networkidle');
        expect(
            await vendorBankDetails.isVisible(),
            'Check vendor bank details check'
        ).toBe(true);
    }
    // we can't display display name field before gstin data fetched
    public async beforeGstinNameNotVisibleDisplayName() {
        const display_input = await this._page
            .locator('#display_name')
            .isVisible();
        expect(display_input, {
            message:
                'Display name could not be displayed before gstin fetched !!',
        }).toBe(false);
    }
    /**
     * Determines if the element is visible.
     *
     * @param {LocatorOptions & { selector?: string }} options - The options for locating the element. Can include a selector.
     * @param {number} timeout - The maximum time to wait for the element to become visible.
     * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the element is visible.
     */
    public async isVisible(
        options?: LocatorOptions & { selector?: string },
        timeout?: number
    ) {
        const { selector, ...rest } = options || {};
        if (options) this.locate(selector, rest);

        return this._locator.isVisible({ timeout });
    }

    public async clickButton(buttonName: string, exact?: boolean) {
        const btnClick = this._page
            .getByRole('button', {
                name: buttonName,
                exact,
            })
            .first();
        const isButtonEnabled = await btnClick.isEnabled();

        expect(isButtonEnabled, {
            message: 'Check Button enabled',
        }).toBe(true);
        const btnEnabled = await btnClick.isEnabled();
        if (btnEnabled) {
            await btnClick.click();
            await this._page.waitForTimeout(300);
            await this._page.waitForLoadState('networkidle');
        } else {
            return Logger.error(buttonName, 'is not enabled');
        }
    }

    public async setCheckbox(choice: string) {
        const checkBox = this.locate(
            `//div[contains(text(),"${choice}")]`
        )._locator;

        expect(await checkBox.isVisible(), 'Checkbox is not visible').toBe(
            true
        );
        Logger.info('CheckBox: ', checkBox);

        await checkBox.click();
    }
    public async clickLinkInviteVendor(linkName: string) {
        const partyHover = this._page.getByText('Partiesarrow_drop_down');
        const partyClick = this._page
            .locator('a')
            .filter({ hasText: linkName })
            .nth(1);
        await partyHover.hover();
        await partyClick.click();
        await this._page.waitForTimeout(2000);
    }
    async validateCheckbox(checked?: boolean) {
        const checkbox = this.locate('label', {
            text: 'save and create another',
        })._locator;
        expect(!(await checkbox.isChecked()), 'Checkbox default state').toBe(
            checked
        );
    }

    async saveAndCreateCheckbox(checked: boolean = true) {
        await this.validateCheckbox(checked);
        const checkbox = this.locate('label', {
            text: 'save and create another',
        })._locator;
        await checkbox.click();
    }

    /**
     * Fill the otpInput feild with otp.
     *
     * @param {string} data - The OTP data to be filled in the otpInput selector.
     * @param {number} expectedLength - The expected length of the OTP 4|6.
     
     */
    public async fillOtp(data: string, expectedLength: number) {
        expect(data.length).toBe(expectedLength);

        for (let i = 0; i < expectedLength; i++) {
            // Locate the OTP input fields and fill them with the corresponding digit
            await this._page.locator('.otpInput').nth(i).fill(data[i]);
        }
    }
    /**
     * Return Error Message Conatains in the span tag
     *
     * @return {string} - returns the error message in the feild if error text-error exist .
    //  */
    // public async errorMessage() {
    //     const errorMessage = await this._page
    //         .locator('//span[contains(@class, "label-text-alt text-error")]')
    //         .textContent();
    //     return errorMessage;
    // }
    /**
     * Function to return the random email after generating random emails
     
     *  @return {string} -returns the Random email for testing purpose.
     */
    public static genRandomEmail() {
        return `test-${uuidV4()}@gmail.com`;
    }

    /**
     * This function is used to generate random password for testing purpose.
     *
     *  @return {string} -returns the Random password for testing purpose.
     */
    public static generateRandomPassword() {
        return `test-${uuidV4()}`;
    }

    /**
     * This function error the error message contains in toast.
     *
     *  @return {string} -returns error message contains on toast.
    //  */
    // public async errorToast() {
    //     return await this._page
    //         .locator('//div[contains(@class, "error-toast")]')
    //         .textContent();
    // }
    /**
     * This function returns the success message in data adding.
     *
     *  @return {string} -returns success message contains on toast.
     */
    // public async successToast() {
    //     return await this._page
    //         .locator('//div[contains(@class, "success-toast")]')
    //         .textContent();
    // }

    /**
     * This function error will find the row and clos in the table   from  and perfrom actions.
     *
     * @param {string} name - The unique text from which we need to find corresponding cell for that row ,i.e row identifier.
     * @param {string} locator - The action to be performed on the row.When elementis found
     * @param {cellno} number - The cell number of the row to be find.
     * @param {function} actionCallback - The action to be performed on the row.When elementis found
     */
    public async findrowAndperformAction(
        name: string,
        cellno: number,
        locator: string,
        actionCallback: (element: any) => Promise<void>
    ) {
        const table = this._page.locator(
            '//div[contains(@class,"table finnoto__table__container ")]'
        );
        const rows = table.locator('//div[contains(@class,"table-row")]'); //select the row

        for (let i = 0; i < (await rows.count()); i++) {
            const row = rows.nth(i);
            const tds = row.locator('//div[contains(@class,"table-cell")]');
            for (let j = 0; j < (await tds.count()); j++) {
                const cell = await tds.nth(j).innerText();
                if (cell === name) {
                    const Button = tds.nth(cellno).locator(`${locator}`);
                    await actionCallback(Button);

                    break;
                }
            }
        }
    }
    /**
     * This Function will returns Random Name for testing purpose.
     * @return {string} -returns the Random Name for testing purpose.
     *
     */
    static async generateRandomGradeName() {
        return `Test${Math.floor(Math.random() * 1000000)}`;
    }

    async clickActionButton() {
        const parentLocator = this._page.locator(
            '//div[contains(@class,"breadcrumbs")]/parent::div'
        );
        const actionButton = parentLocator.locator(
            '//button[text()="Actions"]'
        );
        await actionButton.click();
    }

    async verifyActionOptions(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;

        const verifyOption = optionContainer.getByRole('menuitem', {
            name: options,
        });
        await expect(verifyOption, `${options} visibility`).toBeVisible();
    }

    async clickActionOption(options: string) {
        const optionContainer = this.locate('div', { role: 'menu' })._locator;
        await optionContainer.getByRole('menuitem', { name: options }).click();
    }

    public async logOut() {
        await this._page.locator('a').filter({ hasText: 'Logout' }).click();
    }
}
