import { PROCESS_TEST } from '@/fixtures';
import { SetOrganization } from '@/helpers/SetOrganizationHelper/SetOrg.helper';
import {
    formatDate,
    formatDateNew,
    formatDateProfile,
    generateRandomDate,
} from '@/utils/common.utils';
import { test } from '@playwright/test';
const { describe } = PROCESS_TEST;

describe('Set Organization Account', () => {
    PROCESS_TEST('TOA001', async ({ page }) => {
        const setOrg = new SetOrganization(page);

        await test.step('Product selector button', async () => {
            await setOrg.validateProductSelector();
        });

        await test.step('Profile image flow', async () => {
            await setOrg.validateProfileDropdown();
            await setOrg.validateProfileUpload();
            await setOrg.validateProfileDelete();
        });

        await test.step('Details Validation', async () => {
            await setOrg.validateDetailsInSidebar();
            await setOrg.validateOrganization();
            await setOrg.validateInvitations();
        });

        await test.step('Validate Bank Account', async () => {
            const bankInfo2: BankDetails = {
                'ACCOUNT NUMBER': '137017073379',
                'IFSC CODE': 'ICIC0004444',
                NAME: 'ICICI Bank',
            };

            await setOrg.validateBankAccount();
            await setOrg.verifyBankAccountUsage(bankInfo2);
        });

        await test.step('Validate Approval Delegation', async () => {
            let delegationData = {
                DELEGATOR: 'Abhishek Gupta',
                'START TIME': formatDateNew(new Date()),
                'END TIME': generateRandomDate(),
                STATUS: 'Active',
                'ADDED AT': formatDate(new Date()),
                COMMENTS: 'testt',
            };

            await setOrg.navigateTo('MYPROFILE');
            await setOrg.deactivateAll();
            await setOrg.addApprovalDelegation(delegationData);
            delegationData['START TIME'] =
                formatDateProfile(delegationData['START TIME']) + ' ';
            delegationData['END TIME'] =
                formatDateProfile(delegationData['END TIME']) + ' ';
            await setOrg.validateApprovalDelegation(delegationData);
            await setOrg.deactivateAll();
        });

        await test.step('Validate Role', async () => {
            await setOrg.validateRole();
        });

        await test.step('Validate Action Buttons', async () => {
            await setOrg.validateActionButtons();
        });
    });
});
