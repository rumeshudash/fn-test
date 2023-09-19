import { MenucardHelper } from '@/helpers/Menucardhelper/menucard.helper';
import { test } from '@playwright/test';
import { PROCESS_TEST } from '@/fixtures';

test.describe('Menu Crad', () => {
    PROCESS_TEST('TFM001 - Checking Menu Card', async ({ page }) => {
        const menucard = new MenucardHelper(page);
        await menucard.init();

        PROCESS_TEST.step('Check Page Title', async () => {
            await menucard.checkPageTitle('AP Dashboard');

            await page.waitForTimeout(1000);
        });

        PROCESS_TEST.step('Check SideBar Items', async () => {
            await menucard.checkSideBarItems();
        });
        PROCESS_TEST.step('Check Space in submeny', async () => {
            await menucard.checkSpaceInMenu('Parties');
        });

        PROCESS_TEST.step('Check Space on sidebar-item', async () => {
            await menucard.checkSpaceInMenu('Work Flows');
        });

        PROCESS_TEST.step('Check SubMenu Items', async () => {
            await menucard.checkSubMenuItems('Dashboard');
        });

        PROCESS_TEST.step('Click on Sidebar menu', async () => {
            await menucard.clickOnSideBarMenu('Dashboard');
        });
        PROCESS_TEST.step('Scroll the menu', async () => {
            await menucard.scrollDown();
        });
    });
});
