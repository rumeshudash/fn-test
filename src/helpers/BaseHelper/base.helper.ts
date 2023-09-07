import { uuidV4 } from '@/utils/common.utils';
import { expect } from '@playwright/test';
import chalk from 'chalk';
import { Locator, Page } from 'playwright-core';
import { LISTING_ROUTES } from '../../constants/api.constants';

const error = (...text: unknown[]) => console.log(chalk.bold.red('⨯', text));
const info = (...text: unknown[]) => console.log(chalk.dim('-', text));
const success = (...text: unknown[]) => console.log(chalk.green('✔', text));
const warning = (...text: unknown[]) =>
    console.log(chalk.hex('#FFA500')('!', text));

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
    public locate(selector?: string, options: LocatorOptions = {}) {
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
     * Navigates to a specified URL.
     *
     * @param {keyof typeof LISTING_ROUTES} url - The URL to navigate to.
     * @return {Promise<void>} A promise that resolves when the navigation is complete.
     */
    public async navigateTo(url: keyof typeof LISTING_ROUTES, Phone?: string) {
        let finalUrl = LISTING_ROUTES[url];

        // Check if Phone parameter is provided
        if (Phone) {
            // Append Phone to the URL if provided
            finalUrl += `${Phone}`;
        }

        await this._page.goto(finalUrl, {
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
        if (options) this.locate(selector, rest);

        const isVisibleElement = await this.isVisible();
        expect(isVisibleElement, {
            message: `${this._tempSelector} does not exist !!`,
        }).toBeTruthy();

        info(`Fill: ${text} in ${this._getSelector(options)}`);
        await this._locator.fill(text + '');

        success(`Fill: ${text} in ${this._getSelector(options)}`);
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
        options?: {
            selector?: string;
            placeholder?: string;
            label?: string;
            name?: string;
            hasText?: string;
        }
    ) {
        const { selector, placeholder, name, label, hasText } = options || {};
        await this.fillText(text + '', {
            selector: selector || 'input',
            placeholder,
            name,
            label,
        });
    }

    // public async errorMessage(text: string, selector: string) {
    //   await this.fillText(text + "", {
    //     selector: selector || "input",
    //   });
    // }

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
    public async selectOption(options?: {
        option?: string | number;
        input?: string | number;
        selector?: string;
        placeholder?: string;
        label?: string;
        name?: string;
        hasText?: string;
        exact?: boolean;
    }) {
        const { selector, placeholder, name, label, input, option, hasText } =
            options || {};

        let tempSelector = '//div[contains(@class,"selectbox-container")]';

        if (placeholder)
            tempSelector += `//div[contains(@class,"placeholder")][text()="${placeholder}"]/ancestor::div[contains(@class,"selectbox-container")]`;

        if (name)
            tempSelector += `//input[@name='${name}']/ancestor::div[contains(@class,"selectbox-container")]`;

        if (hasText)
            tempSelector += `//div[text()="${hasText}"]/ancestor::div[contains(@class,"selectbox-container")]`;

        const selectBox = this.locate(selector || tempSelector);

        if (input) {
            await selectBox
                .getLocator()
                .locator('input[type="text"]')
                .fill(input + '');
            await this._page.waitForTimeout(1000);
        } else {
            await selectBox.click();
        }
        console.log(`${input || option} is selected`);
        // await this.click({
        //     selector: `//div[contains(@class,"MenuList")]//div[contains(@class,"option")]//div[contains(text(),"${
        //         input || option
        //     }")]`,
        // });

        const elements = await this._page
            .locator(
                `//div[contains(@class,"MenuList")]//div[contains(@class,"option")]//div[contains(text(),"${
                    input || option
                }")]`
            )
            .elementHandles();

        expect(elements.length, {
            message: `${input || option} does not found in dropdown`,
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
            throw new Error(
                chalk.red(`${input || option} does not found in dropdown`)
            );
        }
    }

    /**
     * Retrieves the tab list element.
     *
     * @return {this} The tab list element.
     */
    public getTabListContainer(): this {
        return this.locate('div', { role: 'tablist' });
    }

    /**
     * Retrieves a list of tab items from the tab list container.
     *
     * @return {Promise<string[]>} An array of strings representing the text of each tab item.
     */
    public async getTabListItems(): Promise<string[]> {
        return this.locateByRole('tab').allInnerTexts();
    }

    /**
     * Checks if the given tab or tabs exist in the tab list.
     *
     * @param {string | string[]} tabName - The name or names of the tab(s) to check.
     * @return {Promise<void>} No return value.
     */
    public async checkTabExists(tabName: string | string[]): Promise<void> {
        let tabNames = tabName;
        if (typeof tabNames === 'string') tabNames = [tabNames];

        const tabList = await this.getTabListItems();

        for (const tab of tabNames) {
            expect(tabList, {
                message: `Tab existence check: ${tab}`,
            }).toContainEqual(tab);
        }
    }

    /**
     * Clicks on the specified tab. Also check if the tab is selected
     *
     * @param {string} tabName - The name of the tab to be clicked.
     * @return {Promise<void>} - A Promise that resolves when the tab is clicked.
     */
    public async clickTab(tabName: string): Promise<void> {
        await this.click({
            role: 'tab',
            text: tabName,
            exactText: true,
        });

        await this.checkTabSelected(tabName);
    }

    /**
     * Gives the value of the 'aria-selected' attribute of the specified tab.
     *
     * @param {string} tabName - The name of the tab to check.
     * @return {Promise<string>} The value of the 'aria-selected' attribute of the tab.
     */
    public async isTabSelected(tabName: string): Promise<string> {
        const container = this.getTabListContainer();
        return await container
            .locateByRole('tab', {
                text: tabName,
                exactText: true,
            })
            .getAttribute('aria-selected');
    }

    /**
     * Checks if the specified tab is currently selected.
     *
     * @param {string} tabName - The name of the tab to check.
     * @return {Promise<void>} - A Promise that resolves when the check is complete.
     */
    public async checkTabSelected(tabName: string): Promise<void> {
        expect(await this.isTabSelected(tabName), {
            message: `Tab selection check: ${tabName}`,
        }).toBe('true');
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
            button?: 'left' | 'right' | 'middle' | undefined;
        }
    ): Promise<void> {
        const { selector, button = 'left', ...rest } = options || {};
        if (options) this.locate(selector, rest);

        info(`Click: ${button} click in ${this._getSelector(options)}`);
        await this._locator.click({ button });
        await this._page.waitForLoadState('networkidle');
        success(`Click: ${button} click in ${this._getSelector(options)}`);

        // const error = this._page.locator('span.label.text-error');
        // const errorCount = await error.count();
        // if (errorCount > 0) {
        //     console.log(chalk.red(`Error ocurred: ${errorCount}`));
        //     for (let i = 0; i < errorCount; i++) {
        //         const errorMsg = await error.nth(i).textContent();
        //         console.log(`Error (error ${i}): `, chalk.red(errorMsg));
        //     }
        // }
        // const toast = this._page.locator('div.ct-toast-success');
        // const toastError = this._page.locator('div.ct-toast.ct-toast-error');
        // const toastWarn = this._page.locator('div.ct-toast.ct-toast-warn');

        // const toastErrorCount = await toastError.count();
        // const toastWarnCount = await toastWarn.count();
        // const toastCount = await toast.count();
        // if (toastCount > 0) {
        //     console.log(chalk.green(`toastMessage (success): ${toastCount}:`));
        //     for (let i = 0; i < toastCount; i++) {
        //         const successMsg = await toast.nth(i).textContent();
        //         console.log(
        //             `toastMessage (success ${i}): `,
        //             chalk.green(successMsg)
        //         );
        //     }
        // }
        // if (toastWarnCount > 0) {
        //     console.log(
        //         chalk.red(
        //             `Multiple toastMessage ocurred \n ${toastWarn}:`,
        //             toastWarnCount
        //         )
        //     );
        //     for (let i = 0; i < toastWarnCount; i++) {
        //         const errorMsg = await toastWarn.nth(i).textContent();
        //         console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
        //     }
        // }
        // if (toastErrorCount > 0) {
        //     console.log(
        //         chalk.red(
        //             `Multiple toastMessage ocurred \n ${toastError}:`,
        //             toastErrorCount
        //         )
        //     );
        //     for (let i = 0; i < toastErrorCount; i++) {
        //         const errorMsg = await toastError.nth(i).textContent();
        //         console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
        //     }
        // }
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
        await this._page.waitForTimeout(1000);

        const vendorBankDetails = this._page.locator(
            "(//div[contains(@class,'flex items-center')])[2]"
        );
        expect(
            await vendorBankDetails.isVisible(),
            'Vendor Bank Details is not visible'
        ).toBe(true);

        const error = this._page.locator('span.label.text-error');
        const errorCount = await error.count();
        if (errorCount > 0) {
            console.log(chalk.red(`Error ocurred: ${errorCount}`));
            for (let i = 0; i < errorCount; i++) {
                const errorMsg = await error.nth(i).textContent();
                console.log(`Error (error ${i}): `, chalk.red(errorMsg));
            }
        }
        const toast = this._page.locator('div.ct-toast-success');
        const toastError = this._page.locator('div.ct-toast.ct-toast-error');
        const toastWarn = this._page.locator('div.ct-toast.ct-toast-warn');

        const toastErrorCount = await toastError.count();
        const toastWarnCount = await toastWarn.count();
        const toastCount = await toast.count();
        if (toastCount > 0) {
            console.log(chalk.green(`toastMessage (success): ${toastCount}:`));
            for (let i = 0; i < toastCount; i++) {
                const successMsg = await toast.nth(i).textContent();
                console.log(
                    `toastMessage (success ${i}): `,
                    chalk.green(successMsg)
                );
            }
        }
        if (toastWarnCount > 0) {
            console.log(
                chalk.red(
                    `Multiple toastMessage ocurred \n ${toastWarn}:`,
                    toastWarnCount
                )
            );
            for (let i = 0; i < toastWarnCount; i++) {
                const errorMsg = await toastWarn.nth(i).textContent();
                console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
            }
        }
        if (toastErrorCount > 0) {
            console.log(
                chalk.red(
                    `Multiple toastMessage ocurred \n ${toastError}:`,
                    toastErrorCount
                )
            );
            for (let i = 0; i < toastErrorCount; i++) {
                const errorMsg = await toastError.nth(i).textContent();
                console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
            }
        }
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

    public async checkButtonVisibility(buttonName: string) {
        const btnCheck = this._page.locator(`//button[text()='${buttonName}']`);
        return await btnCheck.isEnabled();
    }

    public async clickButton(buttonName: string) {
        const btnClick = this._page.getByRole('button', { name: buttonName });
        expect(await btnClick.isEnabled(), {
            message: 'Button is not enabled to click',
        }).toBe(true);
        if (await btnClick.isEnabled()) {
            await btnClick.click();
            await this._page.waitForTimeout(1000);
        } else {
            return console.log(
                chalk.red(buttonName, ' button is not clickable or disabled')
            );
        }
        // await this._page.waitForTimeout(1500);

        const error = this.locate('span.label.text-error')._locator;
        const errorCount = await error.count();
        if (errorCount > 0) {
            console.log(chalk.red(`Error ocurred: ${errorCount}`));
            for (let i = 0; i < errorCount; i++) {
                const errorMsg = await error.nth(i).textContent();
                console.log(`Error (error ${i}): `, chalk.red(errorMsg));
            }
        }
        const toast = this._page.locator('div.ct-toast-success');
        const toastError = this._page.locator('div.ct-toast.ct-toast-error');
        const toastWarn = this._page.locator('div.ct-toast.ct-toast-warn');

        const toastErrorCount = await toastError.count();
        const toastWarnCount = await toastWarn.count();
        const toastCount = await toast.count();
        if (toastCount > 0) {
            console.log(chalk.green(`toastMessage (success): ${toastCount}:`));
            for (let i = 0; i < toastCount; i++) {
                const successMsg = toast.nth(i);
                if (await successMsg.isVisible()) successMsg.textContent();
                console.log(
                    `toastMessage (success ${i}): `,
                    chalk.green(successMsg)
                );
            }
        }
        if (toastWarnCount > 0) {
            console.log(
                chalk.red(
                    `Multiple toastMessage ocurred \n ${toastWarn}:`,
                    toastWarnCount
                )
            );
            for (let i = 0; i < toastWarnCount; i++) {
                const errorMsg = await toastWarn.nth(i).textContent();
                console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
            }
        }
        if (toastErrorCount > 0) {
            console.log(
                chalk.red(
                    `Multiple toastMessage ocurred \n ${toastError}:`,
                    toastErrorCount
                )
            );
            for (let i = 0; i < toastErrorCount; i++) {
                const errorMsg = await toastError.nth(i).textContent();
                console.log(`toastMessage (error ${i}): `, chalk.red(errorMsg));
            }
        }
        await this._page.waitForTimeout(1000);
    }

    public async toastMessage() {
        const error = this._page.locator('span.label.text-error');
        const errorCount = await error.count();
        if (errorCount > 0) {
            console.log(chalk.red(`Error ocurred: ${errorCount}`));
            for (let i = 0; i < errorCount; i++) {
                const errorMsg = await error.nth(i).textContent();
                return errorMsg;
            }
        }
        const toast = this._page.locator('div.ct-toast-success');
        const toastError = this._page.locator('div.ct-toast.ct-toast-error');
        const toastWarn = this._page.locator('div.ct-toast.ct-toast-warn');

        const toastErrorCount = await toastError.count();
        const toastWarnCount = await toastWarn.count();
        const toastCount = await toast.count();
        if (toastCount > 0) {
            for (let i = 0; i < toastCount; i++) {
                const successMsg = await toast.last().textContent();
                return successMsg;
            }
        }
        if (toastWarnCount > 0) {
            for (let i = 0; i < toastWarnCount; i++) {
                const errorMsg = await toastWarn.nth(i).textContent();
                return errorMsg;
            }
        }
        if (toastErrorCount > 0) {
            for (let i = 0; i < toastErrorCount; i++) {
                const errorMsg = await toastError.nth(i).textContent();
                return errorMsg;
            }
        }
    }
    public async setCheckbox(choice: string) {
        const checkBox = this.locate(
            `//div[contains(text(),"${choice}")]`
        )._locator;

        expect(await checkBox.isVisible(), 'Checkbox is not visible').toBe(
            true
        );
        console.log('CheckBox: ', checkBox);

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
    async validateCheckbox() {
        const checkbox = await this.locate("//input[@type='checkbox']")
            ._locator;
        expect(
            !(await checkbox.isChecked()),
            'By default checkbox should be unchecked'
        ).toBe(true);
    }
    async saveAndCreateCheckbox() {
        await this.validateCheckbox();
        const checkbox = this.locate("//input[@type='checkbox']")._locator;
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

        for (let i = 0; i < data.length; i++) {
            // Locate the OTP input fields and fill them with the corresponding digit
            await this._page.locator('.otpInput').nth(i).fill(data[i]);
        }
    }
    /**
     * Return Error Message Conatains in the span tag
     *
     * @return {string} - returns the error message in the feild if error text-error exist .
     */
    public async errorMessage() {
        const errorMessage = await this._page
            .locator('//span[contains(@class, "label-text-alt text-error")]')
            .textContent();
        return errorMessage;
    }
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
     */
    public async errorToast() {
        return await this._page
            .locator('//div[contains(@class, "error-toast")]')
            .textContent();
    }
}
