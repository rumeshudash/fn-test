import { expect } from '@playwright/test';
import { BaseHelper } from './base.helper';

/**
 * Helper class for Tab
 * @author Rumesh
 */
export class TabHelper extends BaseHelper {
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
}
