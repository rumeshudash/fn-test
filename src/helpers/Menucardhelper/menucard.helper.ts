import chalk from 'chalk';
import { PageHelper } from '../BaseHelper/page.helper';
import { expect } from '@playwright/test';
import { menus } from '@/constants/menu.data';

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

export class MenucardHelper extends PageHelper {
    public async init() {
        await this.navigateTo('DASHBOARD');
    }

    public async openAndCloseMenuCard() {
        await this._page
            .locator(`//div[contains(@class,'hamburger_button')]`)
            .click();
    }

    public async getSideBarItems() {
        await this.openAndCloseMenuCard();
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
        expect(filteredAndCleanedItems).toEqual(mainMenuArray);
    }

    public async clickOnSideBarMenu(menuName: string) {
        await this._page.waitForTimeout(1000);
        await this._page
            .locator(`//div[contains(@class,'sidebar-items')]`)
            .getByText(menuName, { exact: true })
            .click();
    }

    public async getSidebarSubMenu(menuName: string) {
        await this.clickOnSideBarMenu(menuName);
        const submenu = await this._page
            .locator(`(//div[contains(@class,'menus hover')]//a)`)
            .innerText();

        console.log('sub menu', submenu);
    }
    public async checkSpaceInMenu(MenuName: string) {
        const locator = await this._page
            .locator(`//div[contains(@class,'sidebar-items')]`)
            .locator(`//div[contains(@class,'submenu mt-3')]`)
            .getByText(MenuName, { exact: true });

        await locator.click();

        await this._page.waitForTimeout(1000);
    }

    public async getSubeMenuItems(menuName: string) {}
}
