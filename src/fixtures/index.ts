import { Page, expect, test } from '@playwright/test';
import fs from 'fs';
import { TEST_URL } from '../constants/api.constants';
import { BaseHelper } from '../helpers/BaseHelper/base.helper';

if (fs.existsSync('./state.json')) {
    test.use({ storageState: 'state.json' });
}

export const PROCESS_TEST = test.extend<{ login: void }>({
    login: [
        async ({ page }: { page: Page }, use: () => any) => {
            const helper = new BaseHelper(page);

            await page.goto(TEST_URL + '/login', { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);

            if (await helper.isVisible({ id: 'username' })) {
                await helper.fillText('testauto@company.com', {
                    id: 'username',
                });
                await helper.click({ role: 'button', name: 'Next →' });
                await helper.fillText('123456', { id: 'password' });
                await helper.click({ role: 'button', name: 'Submit' });

                await expect(
                    helper.locateByText('Select Organization')
                ).toBeVisible();

                await helper.click({ text: 'Test Automation Account Org.' });
                await helper.click({
                    selector: 'p.text-lg',
                    text: 'FinOps Portal',
                });

                await page.waitForTimeout(2000);

                await expect(
                    helper.locateByText('Test Automation Account Org')
                ).toBeVisible();

                await page.context().storageState({ path: 'state.json' });
            }
            await use();
        },
        {
            auto: true,
        },
    ],
});
