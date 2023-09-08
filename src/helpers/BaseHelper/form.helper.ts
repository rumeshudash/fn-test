import { BaseHelper } from '@/baseHelper';
import { BreadCrumbHelper } from './breadCrumb.helper';
import { Page } from '@playwright/test';
import { DialogHelper } from './dialog.helper';

export class FormHelper extends BaseHelper {
    public breadcrumbHelper: BreadCrumbHelper;
    public dialogHelper: DialogHelper;

    public constructor(page: Page) {
        super(page);
        this.breadcrumbHelper = new BreadCrumbHelper(page);
        this.dialogHelper = new DialogHelper(page);
    }

    public async checkTitle(title: string) {
        await this.dialogHelper.checkDialogTitle(title);
    }

    public async checkPageTitle(title: string) {
        await this.breadcrumbHelper.checkBreadCrumbTitle(title);
    }
}
