import chalk from 'chalk';
import { PageHelper } from '../BaseHelper/page.helper';

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
        const locator = await this.locate(
            `//div[contains(@class,'sidebar-items')]`
        );
        const items = await locator.getLocator();

        const itemsText = await items.innerText();
    }
}
