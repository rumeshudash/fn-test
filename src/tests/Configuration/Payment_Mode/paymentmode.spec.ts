import { PROCESS_TEST } from '@/fixtures';
import { PaymentModesHelper } from '@/helpers/PaymentModeHelper/PaymentMode.helper';
import { test } from '@playwright/test';

const { expect, describe } = PROCESS_TEST;

describe('TPM001', () => {
    //For Payment Modes in Configuration
    const paymentMode_Save_And_Create = {
        name: 'Test Payment SnC1',
        type_id: 'Cheque',
        bank_id: '123456',
    };
    const paymentModeInfo = {
        name: 'Test Payment0',
        type_id: 'Cash',
        bank_id: paymentMode_Save_And_Create.bank_id,
        updateName: 'Test Mode Update',
    };

    const paymentInfoSchema = {
        name: {
            type: 'text',
            required: true,
        },
        type_id: {
            type: 'select',
            required: true,
        },
        bank_id: {
            type: 'select',
            required: true,
        },
    };
    PROCESS_TEST('Verify Payment Modes Page', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);
        await test.step('Verify page', async () => {
            await paymentMode.init();
            await paymentMode.verifyPaymentPage();
        });

        await test.step('Save and Create Another', async () => {
            // const paymentMode = new PaymentModesHelper(
            //     paymentMode_Save_And_Create,
            //     page
            // );
            await paymentMode.addNewPaymentMode();
            await paymentMode.form.fillFormInputInformation(
                paymentInfoSchema,
                paymentMode_Save_And_Create
            );
            // await paymentMode.fillPaymentModeForm();
            await paymentMode.saveAndCreateCheckbox();
            await paymentMode.clickButton('Save');
            await paymentMode.form.isInputFieldEmpty('name');
            await paymentMode.dialog.closeDialog();
        });

        await PROCESS_TEST.step('Add New Payment Mode', async () => {
            const paymentMode = new PaymentModesHelper(paymentModeInfo, page);

            // await paymentMode.init();
            // await paymentMode.addNewPaymentMode();
            await paymentMode.fillPaymentModeForm();
            await paymentMode.clickButton('Save');
            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
        });

        await PROCESS_TEST.step('Search and Verify Payment Mode', async () => {
            const paymentMode = new PaymentModesHelper(paymentModeInfo, page);

            // await paymentMode.init();
            await paymentMode.searchPaymentMode();
            await paymentMode.verifyPaymentDetails();
        });

        await PROCESS_TEST.step('Change Bank Status', async () => {
            const paymentMode = new PaymentModesHelper(paymentModeInfo, page);

            // await paymentMode.init();
            await paymentMode.searchPaymentMode();
            //Change Bank Status to Inactive from Active
            await paymentMode.changeBankStatus('Active');

            await paymentMode.notification.checkToastSuccess('Status Changed');
            await paymentMode.verifyBankStatus('Inactive');

            //Change Bank Status to Active from Inactive
            await paymentMode.changeBankStatus('Inactive');

            await paymentMode.notification.checkToastSuccess('Status Changed');
            await paymentMode.verifyBankStatus('Active');
        });

        await PROCESS_TEST.step('Edit Payment Mode Name', async () => {
            const paymentMode = new PaymentModesHelper(paymentModeInfo, page);
            // await paymentMode.init();
            await paymentMode.searchPaymentMode();
            await paymentMode.editPaymentModeName();
            await paymentMode.clickButton('Save');

            await paymentMode.notification.checkToastSuccess(
                'Successfully saved'
            );
        });
    });
});
