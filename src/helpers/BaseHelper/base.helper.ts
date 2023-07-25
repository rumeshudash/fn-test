import { Locator, Page } from "playwright-core";
import chalk from "chalk";
import { LISTING_ROUTES } from "../../constants/api.constants";

const error = (...text: unknown[]) => console.log(chalk.bold.red("⨯", text));
const info = (...text: unknown[]) => console.log(chalk.blue("-", text));
const success = (...text: unknown[]) => console.log(chalk.green("✔", text));
const warning = (...text: unknown[]) =>
    console.log(chalk.hex("#FFA500")("!", text));

export class BaseHelper {
    private _page: Page;
    private _locator: Locator;
    private _tempSelector: string = "";

    constructor(page: Page) {
        this._page = page;
        this._locator = page.locator("html ");
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
                options.name ? `[name=${options.name}]` : ""
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
        this._locator = this._page.locator("html ");
    }

    public locate(selector?: string, options: LocatorOptions = {}) {
        this._tempSelector = selector || "html ";

        if (options.id) {
            this._tempSelector += `#${options.id}`;
        }
        if (options.class) {
            this._tempSelector += `.${options.class.join(".")}`;
        }

        this._locator = this._page.locator(this._tempSelector);

        if (options.role) {
            this._locator = this._locator.getByRole(options.role, {
                name: options.name,
            });
        }

        if (options.placeholder) {
            this._locator = this._locator.getByPlaceholder(options.placeholder);
        }

        if (options.text) {
            this._locator = this._locator.getByText(options.text);
        }

        return this;
    }

    public locateByText(
        text: string | RegExp,
        options?: Omit<LocatorOptions, "text"> & {
            selector?: string;
            exactText?: boolean;
        }
    ) {
        const { selector, exactText, ...rest } = options || {};
        return this.locate(selector, { ...rest, text }).getLocator();
    }

    public locateByRole(
        role: LocatorRoles,
        options?: Omit<LocatorOptions, "role"> & {
            selector?: string;
            exactText?: boolean;
        }
    ) {
        const { selector, exactText, ...rest } = options || {};
        return this.locate(selector, { ...rest, role }).getLocator();
    }

    // Actions

    public async navigateTo(url: keyof typeof LISTING_ROUTES) {
        await this._page.goto(LISTING_ROUTES[url]);
    }

    public async fillText(
        text: string,
        options?: LocatorOptions & { selector?: string }
    ) {
        const { selector, ...rest } = options || {};
        if (options) this.locate(selector, rest);

        info(`Fill: ${text} in ${this._getSelector(options)}`);
        await this._locator.fill(text);
        success(`Fill: ${text} in ${this._getSelector(options)}`);
    }

    public async click(
        options?: LocatorOptions & {
            selector?: string;
            button?: "left" | "right" | "middle" | undefined;
        }
    ) {
        const { selector, button = "left", ...rest } = options || {};
        if (options) this.locate(selector, rest);

        info(`Click: ${button} click in ${this._getSelector(options)}`);
        await this._locator.click({ button });
        success(`Click: ${button} click in ${this._getSelector(options)}`);
    }

    public async isVisible(
        options?: LocatorOptions & { selector?: string },
        timeout?: number
    ) {
        const { selector, ...rest } = options || {};
        if (options) this.locate(selector, rest);

        return this._locator.isVisible({ timeout });
    }
}
