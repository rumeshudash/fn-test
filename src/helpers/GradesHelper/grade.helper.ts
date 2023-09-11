import { generateRandomNumber } from '@/utils/common.utils';
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
        async function performAction(element: any) {
            await element.click();
        }

        const btnlocator = '//button';

        await this.FindrowAndperformAction(name, 3, btnlocator, performAction);
    }

    public async EditGrdaes(name: string, newname: string, priority: number) {
        const btnlocator = '//button';
        async function performAction(element: any) {
            await element.click();
        }
        await this.FindrowAndperformAction(name, 4, btnlocator, performAction);
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
    }
}
