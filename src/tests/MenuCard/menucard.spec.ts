import { MenucardHelper } from '@/helpers/Menucardhelper/menucard.helper';
import { test, expect } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('TFM001', () => {
    PROCESS_TEST('Check vendor login', async ({ page }) => {
        const menucard = new MenucardHelper(page);
        await menucard.init();
        await menucard.checkPageTitle('AP Dashboard');
    });
    PROCESS_TEST('Check Menucard', async ({ page }) => {
        const menucard = new MenucardHelper(page);
        await menucard.init();
        await menucard.openAndCloseMenuCard();
    });

    PROCESS_TEST('Close Menucard', async ({ page }) => {
        const menucard = new MenucardHelper(page);
        await menucard.init();
        await menucard.openAndCloseMenuCard();
        await page.waitForTimeout(1000);

        await menucard.openAndCloseMenuCard();
    });
    PROCESS_TEST('Check Side Bar Main Menu', async ({ page }) => {
        const menucard = new MenucardHelper(page);
        await menucard.init();

        await menucard.getSideBarItems();
    });

    PROCESS_TEST('Check Side Bar Sub Menu is Opening', async ({ page }) => {
        const menucard = new MenucardHelper(page);
        await menucard.init();

        await menucard.openAndCloseMenuCard();

        await menucard.clickOnSideBarMenu('Dashboard');
    });
});
