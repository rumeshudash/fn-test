import chalk from 'chalk';
import { PageHelper } from '../BaseHelper/page.helper';
import { expect } from '@playwright/test';

const mainMenuArray = [
    'Dashboard',
    'Expenses',
    'Advances',
    'Parties',
    'HR',
    'Work Flows',
    'Transactions',
    'Configurations',
    'Reports',
    'Switch Mode',
    'Settings',
    'Logout',
];
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
    public async init() {
        await this.navigateTo('DASHBOARD');
    }

    public async openAndCloseMenuCard() {
        await this._page.waitForLoadState('networkidle');
        await this._page
            .locator(`//div[contains(@class,'hamburger_button')]`)
            .click();
    }
    public async getMenuLocator(menuName: string) {
        const locator = await this._page
            .locator(
                `//div[contains(@class,'sidebar-items')]//p[contains(@class,'sidebar-item-title')]`
            )
            .filter({
                hasText: menuName,
            });
        return locator;
    }

    public async checkSideBarItems() {
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
        expect(filteredAndCleanedItems).toEqual(mainMenuArray);
    }

    public async clickOnSideBarMenu(menuName: string) {
        await this._page.waitForTimeout(1000);
        await this._page
            .locator(`//div[contains(@class,'sidebar-items')]`)
            .getByText(menuName, { exact: true })
            .click();
    }

    public async checkSpaceInMenu(menuName: string) {
        const locator = await this.getMenuLocator(menuName);
        expect(
            locator.locator(`//ancestor::div[contains(@class,'submenu mt-3')]`)
        ).toBeTruthy();
    }

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

        console.log('filteredItems:', filteredItems);

        expect(filteredItems).toEqual(submenuObject[menuName]);
    }

    public async checkSpaceOnSidebard(menuName: string) {
        const locator = await this.getMenuLocator(menuName);

        expect(
            locator.locator(
                `//ancestor::div[contains(@class,'sidebar-item mt-3')]`
            )
        ).toBeTruthy();
    }

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
