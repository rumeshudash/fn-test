import { BaseHelper } from '@/baseHelper';
import { TabHelper } from './tab.helper';
import { Page } from '@playwright/test';
import { BreadCrumbHelper } from './breadCrumb.helper';

export class ListingHelper extends BaseHelper {
    public tabHelper: TabHelper;
    public breadcrumbHelper: BreadCrumbHelper;

    public constructor(page: Page) {
        super(page);
        this.tabHelper = new TabHelper(page);
        this.breadcrumbHelper = new BreadCrumbHelper(page);
    }

    public async checkPageTitle(title: string) {
        await this.breadcrumbHelper.checkBreadCrumbTitle(title);
    }
}
