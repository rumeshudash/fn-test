import { Page } from '@playwright/test';
import { PageHelper } from './page.helper';
import { TabHelper } from './tab.helper';

export class ListingHelper extends PageHelper {
    public tabHelper: TabHelper;

    public constructor(page: Page) {
        super(page);
        this.tabHelper = new TabHelper(page);
    }

    public async searchInList(query: string | number) {
        await this.fillInput(query, { type: 'search' });
        await this._page.waitForLoadState('networkidle');
    }
}
