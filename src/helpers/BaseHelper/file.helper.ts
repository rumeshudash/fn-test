import { BaseHelper } from '@/baseHelper';
import { DialogHelper } from './dialog.helper';
import { Locator } from '@playwright/test';

export class FileHelper extends BaseHelper {
    private _dialogHelper: DialogHelper;

    constructor(page) {
        super(page);
        this._dialogHelper = new DialogHelper(page);
    }

    /**
     * Retrieve the file container element.
     *
     * @return {HTMLElement} The file container element.
     */
    public getFileContainer() {
        return this.locate("//div[@role='presentation']").getLocator().first();
    }

    public getDialogFileContainer() {
        return this._dialogHelper
            .getDialogContainer()
            .getLocator()
            .locator("//div[@role='presentation']");
    }

    /**
     * Sets the file input.
     *
     * @param {boolean} isDialog - Whether the file input is in a dialog.
     * @return {Promise<void>} Promise that resolves once the file is uploaded.
     */
    public async setFileInput({ isDialog }: { isDialog: boolean }) {
        let dialogLocator: Locator | null = null;
        if (isDialog) {
            dialogLocator = this.getDialogFileContainer();
        } else {
            dialogLocator = this.getFileContainer();
        }
        await dialogLocator
            .locator("//input[@type='file']")
            .setInputFiles(`images/pan-card.jpg`);

        await this._page
            .locator('div.ct-toast-success')
            .waitFor({ state: 'visible' });
    }
}
