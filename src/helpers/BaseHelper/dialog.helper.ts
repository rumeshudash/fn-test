import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';

export class DialogHelper extends BaseHelper {
    public getDialogContainer() {
        return this.locate('div', { role: 'dialog' });
    }

    public async getDialogTitle() {
        const container = this.getDialogContainer().getLocator();
        const titleTexts = await container
            .locator('> h2')
            .getByRole('heading')
            .allInnerTexts();

        if (titleTexts.length < 1) return null;
        return titleTexts[0];
    }

    public async checkDialogTitle(title: string): Promise<void> {
        const dialogTitle = await this.getDialogTitle();

        expect(dialogTitle, {
            message: `Dialog title check: "${title}"`,
        }).toBe(title);
    }
}
