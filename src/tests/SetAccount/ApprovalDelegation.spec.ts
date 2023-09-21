import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { ApprovalDelegation } from '@/helpers/SetOrganizationHelper/ApprovalDelegation.helper';
import {
    formatDate,
    formatDateNew,
    generateRandomDate,
    generateRandomNumber,
} from '@/utils/common.utils';
import { test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe('Approval Delegation Flow', () => {
    PROCESS_TEST('TAD001', async ({ page }) => {
        const delegation = new ApprovalDelegation(page);
        await delegation.init();

        const delegationData: ApprovalDelegationData = {
            DELEGATOR: 'Abhishek Gupta',
            'START TIME': formatDateNew(new Date()),
            'END TIME': generateRandomDate(),
            COMMENTS: 'test',
            'ADDED AT': '',
        };

        const expiredDelegation: ApprovalDelegationData = {
            DELEGATOR: 'Abhishek Gupta',
            'START TIME': '20-09-2021',
            'END TIME': '21-09-2021',
            COMMENTS: 'test',
            'ADDED AT': '20 Sep, 2023 6:14 PM',
        };

        const fillData: DelegationFillData = {
            delegated_id: '',
            start_time: delegationData['START TIME'],
            end_time: delegationData['END TIME'],
            comments: 'test',
        };

        const delegatorInfo = {
            name: 'Abhishek Gupta',
            email: 'abhishek02@harbourfront.com',
            password: '1234567',
        };

        const userInfo = {
            name: 'New Test Auto',
            email: 'newtestauto@company.com',
        };

        const delegationSchema = {
            delegated_id: {
                type: 'reference_select',
                required: true,
            },
            start_time: {
                type: 'text',
                required: true,
            },
            end_time: {
                type: 'text',
                required: true,
            },
            comments: {
                type: 'textarea',
                required: true,
            },
        };

        await test.step('Verify errors and add new delegation', async () => {
            let errors: ErrorType[] = [
                {
                    name: 'delegated_id',
                    message: 'Delegated to is required',
                },
            ];

            // validate empty delegation error
            await delegation.openDelegationForm();
            await delegation.fillAndValidateForm(
                delegationSchema,
                fillData,
                errors
            );

            // validate invalid date error
            fillData.delegated_id = 'Abhishek Gupta';
            fillData.end_time = '24-09-2021';

            errors = [
                {
                    name: 'end_time',
                    message: 'End Time must be a valid date',
                },
            ];

            await delegation.fillAndValidateForm(
                delegationSchema,
                fillData,
                errors
            );

            fillData.end_time = delegationData['END TIME'];
            delegationData['ADDED AT'] = formatDate(new Date(), true);
            errors = [];

            await delegation.fillAndValidateForm(
                delegationSchema,
                fillData,
                errors
            );
        });

        await test.step('Verify Delegation in Table', async () => {
            await delegation.tabHelper.clickTab('Approval Delegations');
            await delegation.verifyDelegationAddition(delegationData);
        });

        await test.step('Verify Status Change', async () => {
            await delegation.verifyStatusChange(delegationData, 'Inactive');
        });

        await test.step('Verify Delegation in Workflows Tab', async () => {
            await delegation.verifyDelegationInWorkflows(delegationData);
        });

        await test.step('Verify Status Change of Delegation', async () => {
            await delegation.verifyStatusChange(delegationData, 'Inactive');
            await delegation.createExpense();
            await delegation.verifyDelegatorInApprovalTab(
                delegationData,
                false,
                userInfo
            );
        });

        await test.step('Verify Expiration of Delegation', async () => {
            await delegation.navigateTo('APPROVAL_DELEGATIONS');
            await delegation.verifyStatusChange(delegationData, 'Inactive');
            await delegation.verifyStatusChange(expiredDelegation, 'Active');
            await delegation.createExpense();
            await delegation.verifyDelegatorInApprovalTab(
                expiredDelegation,
                false,
                userInfo
            );
        });

        await test.step('Create Expense and Verify Delegation', async () => {
            await delegation.verifyStatusChange(expiredDelegation, 'Inactive');
            await delegation.verifyStatusChange(delegationData, 'Active');
            await delegation.createExpense();
            const expenseId = await delegation.verifyDelegatorInApprovalTab(
                delegationData,
                true,
                userInfo
            );
            await delegation.openDelegatorAccount(delegatorInfo, expenseId);
            await delegation.verifyDelegatorInProfile(delegationData);
            await delegation.verifyInExpense(
                userInfo,
                delegationData,
                expenseId
            );
        });
    });
});
