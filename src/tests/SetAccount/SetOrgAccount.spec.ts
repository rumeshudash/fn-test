import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { SetOrganization } from '@/helpers/SetOrganizationHelper/SetOrg.helper';
import { formatDate, generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

describe('TOA001', () => {
    PROCESS_TEST('Set org', async ({ page }) => {
        const setOrg = new SetOrganization(page);

        await test.step('Product selector button', async () => {
            await setOrg.validateProductSelector();
        });

        await test.step('Profile image flow', async () => {
            await setOrg.validateProfileDropdown();
            await setOrg.validateProfileUpload();
            await setOrg.validateProfileDelete();
        });

        // await test.step('Details Validation', async () => {
        //     // await setOrg.validateDetailsInSidebar();
        //     await setOrg.validateOrganization();
        //     await setOrg.validateInvitations();
        // });

        await test.step('Validate Bank Account', async () => {
            const bankInfo2: BankDetails = {
                'ACCOUNT NUMBER': '137017073379',
                'IFSC CODE': 'ICIC0004444',
                NAME: 'ICICI Bank',
            };

            // await setOrg.validateBankAccount();
            await setOrg.verifyBankAccountUsage(bankInfo2);
        });

        // await test.step('Validate Approval Delegation', async () => {
        //     const delegationData = {
        //         DELEGATOR: 'Abhishek Gupta',
        //         'START TIME': '15 Sep, 2023',
        //         'END TIME': '30 Sep, 2023',
        //         'ADDED AT': '15 Sep, 2023 11:44 AM',
        //         STATUS: 'Active',
        //         // 'ADDED AT': formatDate(new Date()),
        //         COMMENTS: 'test',
        //     };

        //     // await setOrg.addApprovalDelegation(delegationData);
        //     await setOrg.validateApprovalDelegation(delegationData);
        // });

        // await test.step('Validate Role', async () => {
        //     await setOrg.validateRole();
        // });

        // await test.step('Validate Action Buttons', async () => {
        //     await setOrg.validateActionButtons();
        // });

        // await test.step('Change Password', async () => {
        //     await setOrg.changePassword();
        // });
    });
});
