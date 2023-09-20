import { PROCESS_TEST } from '@/fixtures';
import { PaymentModesHelper } from '@/helpers/PaymentModeHelper/PaymentMode.helper';
import { generateRandomName, generateRandomNumber } from '@/utils/common.utils';
import { expect, test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe('Configuration>Payment Mode', () => {
    //For Payment Modes in Configuration
    const paymentMode_Save_And_Create = {
        name: `sc${generateRandomNumber()}`,
        type_id: 'Cash',
        bank_id: 'ICIC0000004',
    };
    const paymentModeInfo = {
        name: `pay${generateRandomNumber()}`,
        type_id: 'Cash',
        bank_id: 'ICIC0000003',
    };
    const Update_PaymentInfo = {
        name: `updated${paymentModeInfo.name}`,
    };
    const paymentInfoSchema = {
        name: {
            type: 'text',
            required: true,
        },
        type_id: {
            type: 'reference_select',
            required: true,
        },
        bank_id: {
            type: 'reference_select',
            required: true,
        },
    };
    PROCESS_TEST('TPM001', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(page);
        await PROCESS_TEST.step('Verify page', async () => {
            await paymentMode.init();
            await paymentMode.breadCrumb.checkBreadCrumbTitle('Payment Modes');
        });

        await PROCESS_TEST.step('Check Mandatory Fields', async () => {
            await paymentMode.addNewPaymentMode();
            await paymentMode.form.fillFormInputInformation(
                paymentInfoSchema,
                {},
                undefined,
                ['bank_id', 'type_id']
            );
            await paymentMode.form.submitButton();
            await paymentMode.form.checkMandatoryFields(paymentInfoSchema, [
                'bank_id',
            ]);
            await paymentMode.form.checkAllMandatoryInputErrors(
                paymentInfoSchema,
                ['bank_id']
            );
            await paymentMode.form.checkDisableSubmit();
        });

        await PROCESS_TEST.step('Save And Create', async () => {
            await paymentMode.fillPaymentMode(
                paymentInfoSchema,
                paymentMode_Save_And_Create
            );
            await paymentMode.verifyBankVisibility(
                paymentMode_Save_And_Create.type_id
            );

            await paymentMode.form.submitButton();
            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Without bank', async () => {
            await PROCESS_TEST.step('Cash', async () => {
                await paymentMode.fillPaymentModeWithoutBank(
                    paymentInfoSchema,
                    paymentModeInfo
                );
            });
            await PROCESS_TEST.step('Ledger', async () => {
                await paymentMode.fillPaymentModeWithoutBank(
                    paymentInfoSchema,
                    paymentModeInfo
                );
            });
        });

        await PROCESS_TEST.step('with bank', async () => {
            await paymentMode.addNewPaymentMode();

            await paymentMode.fillPaymentMode(
                paymentInfoSchema,
                paymentModeInfo
            );
            await paymentMode.form.submitButton();
            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Search and Verify Payment Mode', async () => {
            await paymentMode.listing.searchInList(paymentModeInfo.name);
            await paymentMode.verifyPaymentDetails(
                paymentModeInfo.name,
                'TYPE'
            );
            await paymentMode.verifyPaymentDetails(
                paymentModeInfo.name,
                'BANK'
            );
            await paymentMode.verifyPaymentDetails(
                paymentModeInfo.name,
                'STATUS'
            );
            await paymentMode.verifyPaymentDetails(
                paymentModeInfo.name,
                'ADDED AT'
            );
            await paymentMode.verifyPaymentDetails(
                paymentModeInfo.name,
                'ACTION'
            );
        });

        await PROCESS_TEST.step('Change Status', async () => {
            await paymentMode.status.setStatus(
                paymentModeInfo.name,
                'Inactive'
            );

            await paymentMode.notification.checkToastSuccess('Status Changed');
            await paymentMode.checkStatus(paymentModeInfo.name, 'Inactive');

            await paymentMode.status.setStatus(paymentModeInfo.name, 'Active');
            await paymentMode.notification.checkToastSuccess('Status Changed');

            await paymentMode.checkStatus(paymentModeInfo.name, 'Active');
        });

        await PROCESS_TEST.step('Edit Payment Mode Name', async () => {
            await paymentMode.clickPaymentAction(paymentModeInfo.name);
            await paymentMode.form.fillFormInputInformation(
                paymentInfoSchema,
                Update_PaymentInfo,
                undefined,
                ['type_id', 'bank_id']
            );
            await paymentMode.form.submitButton();

            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Verify Updated Payment Mode', async () => {
            await paymentMode.listing.searchInList(Update_PaymentInfo.name);
            await paymentMode.verifyPaymentDetails(
                Update_PaymentInfo.name,
                'TYPE'
            );
            await paymentMode.verifyPaymentDetails(
                Update_PaymentInfo.name,
                'BANK'
            );
            await paymentMode.verifyPaymentDetails(
                Update_PaymentInfo.name,
                'STATUS'
            );
            await paymentMode.verifyPaymentDetails(
                Update_PaymentInfo.name,
                'ADDED AT'
            );
            await paymentMode.verifyPaymentDetails(
                Update_PaymentInfo.name,
                'ACTION'
            );
        });
    });
});
