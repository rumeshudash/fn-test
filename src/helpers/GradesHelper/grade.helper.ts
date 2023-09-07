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
        const rows = await table.locator('//div[contains(@class,"table-row")]'); //select the row

        for (let i = 0; i < (await rows.count()); i++) {
            const row = await rows.nth(i);
            const tds = await row.locator(
                '//div[contains(@class,"table-cell")]'
            );
            for (let j = 0; j < (await tds.count()); j++) {
                const cell = await tds.nth(j).innerText();
                if (cell === name) {
                    const Button = await tds
                        .nth(3)
                        .locator('//button[contains(@class,"btn")]');
                    await Button.click();
                }
            }
        }
    }

    public async EditGrdaes(name: string, newname: string, priority: number) {
        const table = await this._page.locator(
            '//div[contains(@class,"table finnoto__table__container ")]'
        );
        const rows = await table.locator('//div[contains(@class,"table-row")]');
        for (let i = 0; i < (await rows.count()); i++) {
            const row = await rows.nth(i);
            const tds = await row.locator(
                '//div[contains(@class,"table-cell")]'
            );
            for (let j = 0; j < (await tds.count()); j++) {
                const cell = await tds.nth(j).innerText();
                if (cell === name) {
                    const Button = await tds
                        .nth(4)
                        .locator('//div[contains(@class,"flex items-center")]')
                        .locator('//button');
                    await Button.click();
                    if (newname !== undefined) {
                        await this.fillText(newname, {
                            name: 'name',
                        });
                    }
                    if (priority !== null) {
                        await this.fillText(priority, {
                            name: 'priority',
                        });
                    }

                    await this.click({ role: 'button', name: 'save' });

                    break;
                }
            }
        }
    }
    static async generateRandomGradeName() {
        return `Grade${Math.floor(Math.random() * 1000000)}`;
    }
}
