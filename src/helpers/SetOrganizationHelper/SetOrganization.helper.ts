import { Locator, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { formatDate } from '@/utils/common.utils';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { LISTING_ROUTES, TEST_URL } from '@/constants/api.constants';

export class SetOrganization extends BaseHelper {
    public async signIn() {
        // await this._page.goto(LISTING_ROUTES.SIGNIN);
        await this.navigateTo('SIGNIN');
        await this._page.waitForTimeout(2000);
        await this.fillInput('newtestauto@test.com', {
            name: 'username',
        });
        await this.clickButton('Next →');
    }

    public async openProfileDropdown() {
        await this._page.waitForSelector('#user-popover');

        const dropDownContainer = this._page
            .locator("//div[@id='user-popover']//div")
            .first();

        await dropDownContainer.click();
        await this._page.waitForLoadState('networkidle');
        const test = this._page.locator('//p[text()="My Profile"]/parent::div');
        // const menu = this._page.locator('//div[@role="dialog"]');

        // expect(menu).toContainText([
        //     'My Profile',
        //     'Rename Organisation',
        //     'Logout',
        // ]);
        // await expect(menu).toContainText('My Profile');
        // await expect(menu).toContainText('Rename Organisation');
        // await expect(menu).toContainText('Logout');

        await test.click();
    }

    public async profile() {
        // await this._page.waitForSelector('#user-popover');
        const profileLocator = this.locate(
            "(//div[@id='user-popover']//div)"
        )._locator.first();
        const myProfile = this.locate(
            '//p[text()="My Profile"]/parent::div'
        )._locator;
        await profileLocator.click();
        await myProfile.click();
    }
}
