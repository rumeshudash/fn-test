import { PROCESS_TEST } from '@/fixtures';
import { SwitchOrg } from '@/helpers/SetOrganizationHelper/SwitchOrg.helper';
import { test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe('FinOps_SetOrg', () => {
    PROCESS_TEST('TSO001 -> Switch Organization', async ({ page }) => {
        const switchOrg = new SwitchOrg(page);

        await test.step('Validate Switch Organization', async () => {
            await switchOrg.openSwitchOrg();
            await switchOrg.openOrganization('New Test Auto');
        });
    });
});
