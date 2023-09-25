import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { ApprovalDelegation } from '@/helpers/SetOrganizationHelper/ApprovalDelegation.helper';
import { SetOrganization } from '@/helpers/SetOrganizationHelper/SetOrg.helper';
import {
    formatDate,
    formatDateNew,
    formatDateProfile,
    generateRandomDate,
    generateRandomNumber,
} from '@/utils/common.utils';
import { test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });
PROCESS_TEST.setTimeout(240000); // 4 minutes (4*60*1000)

describe('FinOps_SetOrg', () => {
    PROCESS_TEST('TOA001 -> Set Account-Organisation', async ({ page }) => {
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

    PROCESS_TEST('TAD001 -> Add Approval Delegation', async ({ page }) => {
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
            DELEGATOR: 'Pavani Reddy',
            'START TIME': '20-09-2023',
            'END TIME': '20-09-2023',
            COMMENTS: 'test duration passed',
            'ADDED AT': '20 Sep, 2023 5:50 PM',
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

        const setOrg = new SetOrganization(page);
        await setOrg.deactivateAll();

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
                errors,
                delegationData
            );

            // validate invalid date error
            fillData.delegated_id = 'Abhishek Gupta';
            fillData.start_time = '24-09-2021';
            errors = [
                {
                    name: 'start_time',
                    message: 'Start Time must be greater than or equal to',
                },
            ];
            await delegation.fillAndValidateForm(
                delegationSchema,
                fillData,
                errors,
                delegationData
            );

            // validate end date error
            fillData.start_time = delegationData['START TIME'];
            fillData.end_time = '24-09-2021';
            errors = [
                {
                    name: 'end_time',
                    message: 'End Time must be greater than or equal to',
                },
            ];
            await delegation.fillAndValidateForm(
                delegationSchema,
                fillData,
                errors,
                delegationData
            );

            fillData.end_time = delegationData['END TIME'];
            errors = [];
            await delegation.fillAndValidateForm(
                delegationSchema,
                fillData,
                errors,
                delegationData
            );
        });

        await test.step('Verify Delegation in Table', async () => {
            await delegation.tabHelper.clickTab('Approval Delegations');
            await delegation.verifyDelegationAddition(delegationData);
        });

        await test.step('Verify Status Change', async () => {
            await delegation.verifyStatusChange(delegationData, 'Inactive');
        });

        await test.step('Verify Delegation in Details Page', async () => {
            await delegation.verifyStatusChange(delegationData, 'Active');

            // verify for user
            await delegation.openDetailsPage(delegationData, delegatorInfo);
            await delegation.verifyInDelegationTab(delegationData);

            // verify for delegator
            await delegation.openDetailsPage(delegationData, userInfo);
            await delegation.verifyInDelegationTab(delegationData);
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
            await delegation.verifyStatusChange(
                expiredDelegation,
                'Active',
                'USER',
                true
            );
            await delegation.createExpense();
            await delegation.verifyDelegatorInApprovalTab(
                expiredDelegation,
                false,
                userInfo
            );
        });

        await test.step('Create Expense and Verify Delegation in Delegator account', async () => {
            await delegation.verifyStatusChange(
                expiredDelegation,
                'Inactive',
                'USER',
                true
            );
            await delegation.verifyStatusChange(delegationData, 'Active');
            await delegation.createExpense();
            const expenseId = await delegation.verifyDelegatorInApprovalTab(
                delegationData,
                true,
                userInfo
            );

            // open delegator account and verify
            await delegation.openDelegatorAccount(delegatorInfo);
            await delegation.verifyDelegatorInProfile(delegationData);
            await delegation.verifyInExpense(
                userInfo,
                delegationData,
                expenseId
            );
        });

        await test.step('Deactivate Delegation', async () => {
            await delegation.verifyStatusChange(
                delegationData,
                'Inactive',
                'EMPLOYEE'
            );
        });
    });
});
