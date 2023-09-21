import chalk from 'chalk';
import { PageHelper } from '../BaseHelper/page.helper';
import { Locator, expect } from '@playwright/test';

const submenuObject = {
    Dashboard: ['AP Dashboard', 'Payment Dashboard'],

    Parties: ['My Bussiness', 'My Vendors', 'Vendor Invitations'],

    HR: ['Employees', 'Departments', 'Designations', 'Grades'],

    'Work Flows': [
        'Expense Approval',
        'Advance Approval',
        'Approval Delegations',
        'Expense Aprroval Limits',
        'Advance Approval Limits',
    ],
    Transactions: [
        'All Payments',
        'Cash Transactions',
        'Online Bank Transfer',
        'Cheque Payments',
        'Bank Accounts',
        'Gstr2b',
    ],
    Settings: ['My Profile', 'User Management'],
};

export class MenucardHelper extends PageHelper {
    /**
     * @description - Navigate to Dashboard Page
     *
     */
    public async init() {
        await this.navigateTo('DASHBOARD');
    }

    /**
     *@description -This Function is used to open and close the menu card
     */
    public async openAndCloseMenuCard() {
        await this._page.waitForLoadState('networkidle');
        await this._page
            .locator(`//div[contains(@class,'hamburger_button')]`)
            .click();
    }
    /**
     * @description - This function will return the locator of the main menu of specific input meanu name
     *
     * @param {string}menuName -The name of main menu like dashboard,expenses etc.
     * @returns {Promise<Locator>} -This function returns the locator of the main menu
     */
    public async getMenuLocator(menuName: string): Promise<Locator> {
        const locator = await this._page
            .locator(
                `//div[contains(@class,'sidebar-items')]//p[contains(@class,'sidebar-item-title')]`
            )
            .filter({
                hasText: menuName,
            });
        return locator;
    }

    /**
     * @description -This function will check the menu items are correctly reflected in the menu card
     *
     * @param {string} menuName - The name of the main menu like dashboard,expenses etc.
     */
    public async checkSideBarItem(menuName: string) {
        const itemsText = await this._page
            .locator(`//div[contains(@class,'sidebar-items')]`)
            .innerText();

        const itemsArray = itemsText.split('\n');

        const filteredItems = itemsArray.filter((item) => item.trim() !== '');

        const excludedItems = [
            'grid_view',
            'arrow_drop_down',
            'NT',
            'New Test Auto',
            'newtestauto@company.com',
            'arrow_right',
        ];

        const filteredAndCleanedItems = filteredItems.filter((item) => {
            return !excludedItems.includes(item);
        });

        console.log('filteredAndCleanedItems:', filteredAndCleanedItems);
        expect(filteredAndCleanedItems.includes(menuName)).toBeTruthy();
    }

    /**
     * @description - This function will click on the main menu of specific input menu name
     *
     * @param menuName - The name of the main menu like dashboard,expenses etc.
     */
    public async clickOnSideBarMenu(menuName: string) {
        await this._page.waitForTimeout(1000);
        await this._page
            .locator(`//div[contains(@class,'sidebar-items')]`)
            .getByText(menuName, { exact: true })
            .click();
    }

    /**
     * @description - This function will check the space between the main menu is present or not
     *
     * @param menuName - The name of the main menu like dashboard,expenses etc. having the space with class name mt-3
     */
    public async checkSpaceInMenu(menuName: string) {
        const locator = await this.getMenuLocator(menuName);
        expect(
            locator.locator(`//ancestor::div[contains(@class,'submenu mt-3')]`)
        ).toBeTruthy();
    }
    /**
     * @description - This function will check the submenu items are correctly reflected in the menu card
     *
     * @param menuName - The name of the main menu like dashboard,expenses etc. which have sub menu like AP Dashboard,Payment Dashboard etc.
     *
     */
    public async checkSubMenuItems(menuName: string) {
        const locator = await this.getMenuLocator(menuName);

        const ancestor = await locator.locator(
            `//ancestor::div[contains(@class,'submenu')]`
        );

        const menus = await ancestor
            .locator(
                `//div[contains(@class,'menus')]//a[contains(@class,'sidebar-item')]`
            )
            .allInnerTexts(); // Use textContent instead of innerText

        const filteredItems = menus.filter((item) => item.trim() !== '');

        expect(filteredItems).toEqual(submenuObject[menuName]);
    }

    /**
     * @description - This function will check the space between menus having class name sidebar-item mt-3
     *
     * @param menuName -The name of the main menu
     */

    public async checkSpaceOnSidebar(menuName: string) {
        const locator = await this.getMenuLocator(menuName);

        expect(
            locator.locator(
                `//ancestor::div[contains(@class,'sidebar-item mt-3')]`
            )
        ).toBeTruthy();
    }

    /**
     * @description - This function will scrolldown the menu card and check the menu card is scrolled or not
     *
     */

    public async scrollDown() {
        const locator = await this._page.locator(
            `//div[contains(@class,'sidebar-items')]`
        );

        await locator.evaluate(() => {
            window.scrollBy(0, 500);
        });

        const isScrolled = await locator.evaluate(() => {
            return window.scrollY > 0;
        });

        expect(isScrolled).toBeTruthy();
    }
}
