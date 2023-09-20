import { PROCESS_TEST } from '@/fixtures';
import { PaymentModesHelper } from '@/helpers/PaymentModeHelper/PaymentMode.helper';
import { test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe('Configuration>Payment Mode', () => {
    //For Payment Modes in Configuration
    const paymentMode_Save_And_Create = {
        name: 'Test Payment SnC2',
        type_id: 'Cheque',
        bank_id: 'ICIC0000004',
    };
    const paymentModeInfo = {
        name: 'Test Payment1',
        type_id: 'Demand Draft',
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
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);
        await PROCESS_TEST.step('Verify page', async () => {
            await paymentMode.init();
            await paymentMode.breadCrumb.checkBreadCrumbTitle('Payment Modes');
        });

        await test.step('Save and Create Another', async () => {
            await paymentMode.addNewPaymentMode();
            await paymentMode.form.fillFormInputInformation(
                paymentInfoSchema,
                paymentMode_Save_And_Create
            );
            await paymentMode.saveAndCreateCheckbox();
            await paymentMode.form.submitButton();
            await paymentMode.notification.getErrorMessage();
            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
            await paymentMode.form.checkMandatoryFields(paymentInfoSchema);
            await paymentMode.dialog.closeDialog();
        });

        await PROCESS_TEST.step('Add New Payment Mode', async () => {
            await paymentMode.addNewPaymentMode();
            await paymentMode.form.fillFormInputInformation(
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

        await PROCESS_TEST.step('Change Bank Status', async () => {
            await paymentMode.status.setStatus(
                paymentModeInfo.name,
                'Inactive'
            );

            await paymentMode.notification.checkToastSuccess('Status Changed');
            await paymentMode.verifyBankStatus('Inactive');

            await paymentMode.status.setStatus(paymentModeInfo.name, 'Active');

            await paymentMode.notification.checkToastSuccess('Status Changed');
            await paymentMode.verifyBankStatus('Active');
        });

        await PROCESS_TEST.step('Edit Payment Mode Name', async () => {
            await paymentMode.form.fillFormInputInformation(
                paymentInfoSchema,
                Update_PaymentInfo
            );
            await paymentMode.form.submitButton();

            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Verify Updated Payment Mode', async () => {
            await paymentMode.listing.searchInList(Update_PaymentInfo.name);
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
    });
});
