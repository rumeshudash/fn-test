import { BaseHelper } from '../BaseHelper/base.helper';
import { expect } from '@playwright/test';

export class GradesHelper extends BaseHelper {
    private static GRADES_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init() {
        await this.navigateTo('GRADES');
    }
    public async AddGrades(name: string, priority: number) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this.click({ role: 'button', name: 'save' });
    }
    public async checkPriority(name: string) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.click({ role: 'button', name: 'save' });
    }

    public async clickPolicy() {
        await this._page.locator("//input[@type='checkbox']").click();
    }

    public async checkWithCheckbox(name: string, priority: number) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        await this.clickPolicy();

        await this.click({ role: 'button', name: 'save' });
    }
    public async ActiveToInactive(name: string) {
        const table = await this._page.locator(
            '//div[contains(@class,"table finnoto__table__container ")]'
        );
        const rows = await table.locator('//div[contains(@class,"table-row")]');

        const cols = await rows.locator('//div[contains(@class,"table-cell")]');

        for (let i = 0; i < (await rows.count()); i++) {
            const cell = await cols.nth(i).innerText();

            if (cell === name) {
                const button = await rows
                    .nth(i)
                    .locator('.//button[contains(text(),"Active")]'); // Add a dot at the beginning to scope to the current row

                await button.click();
                // await this.click({ role: 'button', name: 'Inactive' });
                break;
            }
        }
    }
}
