import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { SetMobile } from '@/helpers/SetOrganizationHelper/Mobile.helper';
import { formatDate, generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

describe('Mobile Number Addition', () => {
    PROCESS_TEST('TMO001', async ({ page }) => {
        const mobileSet = new SetMobile(page);

        await mobileSet.init();

        await test.step('Add New Number', async () => {
            // let mobile = '99' + generateRandomNumber().substring(0, 8);
            let mobile = '0011001100';
            await mobileSet.openMobileForm('edit');
            await mobileSet.addMobileNumber(mobile, false);
            await mobileSet.validateMobileAddition(mobile);
        });
    });
});
