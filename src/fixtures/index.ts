import { Page, test } from '@playwright/test';
import fs from 'fs';
import { TEST_URL } from '../constants/api.constants';
import { BaseHelper } from '../helpers/BaseHelper/base.helper';

if (fs.existsSync('./state.json')) {
    test.use({ storageState: 'state.json' });
}

export const PROCESS_TEST = test.extend<{ login: void }>({
    login: [
        async ({ page }: { page: Page }, use: () => any) => {
            const orgName = 'New Test Auto';
            const helper = new BaseHelper(page);

            await page.goto(TEST_URL + '/login', { waitUntil: 'networkidle' });
            await page.waitForLoadState('networkidle');

            if (await helper.isVisible({ id: 'username' })) {
                await helper.fillInput('newtestauto@company.com', {
                    name: 'username',
                });
                await helper.click({ role: 'button', name: 'Next →' });

                await helper.fillInput('123456', { name: 'password' });
                await helper.click({ role: 'button', name: 'Submit' });

                await page.getByRole('dialog').waitFor({
                    state: 'attached',
                    timeout: 1000,
                });

                if (await helper.isVisible({ text: 'Select Organization' })) {
                    await helper.click({ text: orgName });
                }

                await helper.click({ text: 'FinOps Portal' });
                await page.waitForTimeout(1000);

                // await expect(
                //     helper.locateByText(orgName)
                // ).toBeVisible();

                await page.context().storageState({ path: 'state.json' });
            }
            await use();
        },
        {
            auto: true,
        },
    ],
});
