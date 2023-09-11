import { PROCESS_TEST } from '@/fixtures';
import { TabHelper } from '@/helpers/BaseHelper/tab.helper';
import { WorkflowCreationHelper } from '@/helpers/WorkflowHelper/workflowCreation.helper';
import { WorkflowListingHelper } from '@/helpers/WorkflowHelper/workflowListing.helper';
const { describe } = PROCESS_TEST;

describe('TWE001', () => {
    PROCESS_TEST('Expense Approval Workflow', async ({ page }) => {
        const helper = new WorkflowListingHelper(page);
        const creationHelper = new WorkflowCreationHelper(page);

        await helper.init('expense');

        await PROCESS_TEST.step('Verify Page Navigation', async () => {
            await helper.checkPageTitle('Expense approvals');
        });

        await PROCESS_TEST.step(
            'Verify "Verifications," "FinOps," and "Payments" tabs',
            async () => {
                await helper.tabHelper.checkTabExists([
                    'Verifications',
                    'Finops',
                    'Payments',
                ]);
            }
        );

        await PROCESS_TEST.step(
            'Verify all tabs are visible & clickable',
            async () => {
                await helper.tabHelper.clickTab('Payments');
                await helper.tabHelper.clickTab('Finops');
                await helper.tabHelper.clickTab('Verifications');
            }
        );

        await PROCESS_TEST.step('Open Approval Creation', async () => {
            await creationHelper.openApprovalCreationForm('Verifications');
        });

        await PROCESS_TEST.step('Verify New Approval form Opened', async () => {
            await page.waitForURL('**/verification/c', {
                waitUntil: 'domcontentloaded',
                timeout: 5000,
            });
            await creationHelper.checkPageTitle('New Verification Approval');
        });

        await page.waitForTimeout(1000);
    });
});
