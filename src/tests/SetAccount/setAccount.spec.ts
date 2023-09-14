import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { SetOrganization } from '@/helpers/SetOrganizationHelper/SetOrganization.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

// test('TOA001', async ({ page }) => {
//     const setOrg = new SetOrganization(page);

//     test.step('Sign in flow', async () => {
//         await setOrg.signIn();

//         // await setOrg.openProfileDropdown();
//     });
// });

describe('TOA001', () => {
    PROCESS_TEST('Set org', async ({ page }) => {
        const setOrg = new SetOrganization(page);

        await PROCESS_TEST.step('Sign in flow', async () => {
            // await setOrg.signIn();

            await setOrg.profile();
        });
    });
});
