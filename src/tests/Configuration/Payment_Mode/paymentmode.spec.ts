import { PROCESS_TEST } from '@/fixtures';
import { PaymentModesHelper } from '@/helpers/PaymentModeHelper/PaymentMode.helper';
import {
    paymentModeInfo,
    paymentMode_Save_And_Create,
} from '@/utils/required_data';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { expect, describe } = PROCESS_TEST;

describe('TPM001', () => {
    PROCESS_TEST('Verify Payment Modes Page', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);
        await test.step('Verify page', async () => {
            await paymentMode.init();
            await paymentMode.verifyPaymentPage();
        });
    });

    PROCESS_TEST('Save and Create Checkbox', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(
            paymentMode_Save_And_Create,
            page
        );

        await test.step('Save and Create Another', async () => {
            await paymentMode.init();
            await paymentMode.addNewPaymentMode();
            await paymentMode.fillPaymentModeForm();
            await paymentMode.saveAndCreateCheckbox();
            await paymentMode.clickButton('Save');
            await paymentMode.verifyEmptyField();
        });
    });

    PROCESS_TEST('Add New Payment Mode', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);
        await test.step('Add New Payment Mode', async () => {
            await paymentMode.init();
            await paymentMode.addNewPaymentMode();
            await paymentMode.fillPaymentModeForm();
            await paymentMode.clickButton('Save');

            expect(
                await paymentMode.toastMessage(),
                chalk.red('Toast Message match')
            ).toBe('Successfully saved');
        });
    });

    PROCESS_TEST('Search and Verify Payment Mode', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);

        await test.step('Search Payment Mode', async () => {
            await paymentMode.init();
            await paymentMode.searchPaymentMode();
            await paymentMode.verifyPaymentDetails();
        });
    });

    PROCESS_TEST('Change Bank Status', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);

        await test.step('Change Status', async () => {
            await paymentMode.init();
            await paymentMode.searchPaymentMode();
            //Change Bank Status to Inactive from Active
            await paymentMode.changeBankStatus('Active');
            expect(
                await paymentMode.toastMessage(),
                chalk.red('Toast Message match')
            ).toBe('Status Changed');

            await paymentMode.verifyBankStatus('Inactive');

            //Change Bank Status to Active from Inactive
            await paymentMode.changeBankStatus('Inactive');

            expect(
                await paymentMode.toastMessage(),
                chalk.red('Toast Message match')
            ).toBe('Status Changed');

            await paymentMode.verifyBankStatus('Active');
        });
    });

    PROCESS_TEST('Edit Payment Mode Name', async ({ page }) => {
        const paymentMode = new PaymentModesHelper(paymentModeInfo, page);
        await paymentMode.init();
        await paymentMode.searchPaymentMode();
        await paymentMode.editPaymentModeName();
        await paymentMode.clickButton('Save');

        expect(
            await paymentMode.toastMessage(),
            chalk.red('Toast Message match')
        ).toBe('Successfully saved');
    });
});
