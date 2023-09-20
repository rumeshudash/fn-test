import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { ApprovalDelegation } from '@/helpers/SetOrganizationHelper/ApprovalDelegation.helper';
import { formatDate, generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe('Approval Delegation Flow', () => {
    PROCESS_TEST('TAD001', async ({ page }) => {
        const delegation = new ApprovalDelegation(page);
        await delegation.init();

        const delegationData: ApprovalDelegationData = {
            DELEGATOR: 'Abhishek Gupta',
            // 'START TIME': '20-09-2023',
            'START TIME': '18-09-2023',
            // 'END TIME': '24-09-2023',
            'END TIME': '28-09-2023',
            COMMENTS: 'test',
            // 'ADDED AT': formatDate(new Date(), true),
            'ADDED AT': '18 Sep, 2023 4:49 PM',
        };

        // await test.step('Add New Delegation', async () => {
        //     await delegation.openDelegationForm();
        //     await delegation.fillDelegationForm(delegationData);
        // });

        await test.step('Verify Delegation in Table', async () => {
            await delegation.tabHelper.clickTab('Approval Delegations');
            await delegation.verifyDelegationAddition(delegationData);
        });

        await test.step('Verify Status Change', async () => {
            await delegation.verifyStatusChange(delegationData);
        });
    });
});
