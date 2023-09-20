import { Locator, Page, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { formatDate, generateRandomNumber } from '@/utils/common.utils';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { LISTING_ROUTES, TEST_URL } from '@/constants/api.constants';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { SetOrganization } from './SetOrg.helper';

export class SetMobile extends BaseHelper {
    private _dialogHelper: DialogHelper;
    private _notificationHelper: NotificationHelper;

    constructor(page: Page) {
        super(page);
        this._dialogHelper = new DialogHelper(page);
        this._notificationHelper = new NotificationHelper(page);
    }

    public async init() {
        await this.navigateTo('MYPROFILE');
    }

    public getMobileContainer() {
        return this._page.locator("//div[@data-title='profile_information']");
    }

    public async openMobileForm(type: string) {
        const text = type === 'add' ? '+Add' : 'Edit';
        const profileContainer = this.getMobileContainer();
        await profileContainer.getByText(text).click();
    }

    public async addMobileNumber(mobile: string, err: boolean) {
        await this.fillInput(mobile, { name: 'mobile' });
        await this.clickButton('Verify');

        if (err) {
            await this._notificationHelper.checkErrorMessage(
                'Please enter a valid 10-digit number.'
            );
        }

        await this.fillOtp('1111', 4);

        if (err) {
        }

        await this.clickButton('Verify Otp');
        await this._page.waitForLoadState('networkidle');
    }

    public async validateMobileAddition(mobile: string) {
        await this._page.reload();
        await this._page.waitForLoadState('networkidle');
        const profileContainer = this.getMobileContainer();
        const mobileCurrent = await profileContainer
            .locator('span#has-Mobile')
            .textContent();
        expect(mobileCurrent).toEqual(mobile);
    }
}
