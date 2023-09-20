import { PROCESS_TEST } from '@/fixtures';
import { PaymentModesHelper } from '@/helpers/PaymentModeHelper/PaymentMode.helper';
import { generateRandomName, generateRandomNumber } from '@/utils/common.utils';
import { expect, test } from '@playwright/test';

const { describe } = PROCESS_TEST;

describe('Configuration>Payment Mode', () => {
    const commonPaymentInfo = {
        name: `pay${generateRandomNumber()}`,
        bank_id: 'HDFC0000001',
    };
    //For Payment Modes in Configuration
    // const paymentMode_Save_And_Create = {
    //     ...commonPaymentInfo,
    //     type_id: 'Cheque',
    // };
    const withoutBankInfo = {
        ...commonPaymentInfo,
        type_id: 'Cash',
    };
    const withBankInfo = {
        ...commonPaymentInfo,
        type_id: 'Cheque',
    };
    const Update_PaymentInfo = {
        name: `updated${commonPaymentInfo.name}`,
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

        //Issue in Bank payment

        // await PROCESS_TEST.step('Save And Create', async () => {
        //     console.log(withBankInfo);
        //     await paymentMode.form.fillFormInputInformation(
        //         paymentInfoSchema,
        //         withBankInfo
        //     );
        //     await paymentMode.verifyBankVisibility(withBankInfo.type_id);

        //     await paymentMode.form.submitButton();
        //     await paymentMode.form.checkInputError(
        //         'bank_id',
        //         paymentInfoSchema
        //     );
        //     await paymentMode.notification.checkToastSuccess(
        //         'Successfully saved'
        //     );
        // });

        await PROCESS_TEST.step('Without bank', async () => {
            await PROCESS_TEST.step(
                `${withoutBankInfo.type_id} check`,
                async () => {
                    await paymentMode.fillPaymentModeWithoutBank(
                        paymentInfoSchema,
                        withoutBankInfo
                    );
                    await paymentMode.verifyBankVisibility(
                        withoutBankInfo.type_id
                    );
                    await paymentMode.form.submitButton();
                    await paymentMode.notification.checkToastSuccess(
                        'Successfully saved'
                    );
                }
            );
        });

        await PROCESS_TEST.step('Without Bank Search and Verify', async () => {
            await paymentMode.listing.searchInList(withoutBankInfo.name);
            await paymentMode.checkPaymentRowText(
                withoutBankInfo.name,
                'TYPE',
                withoutBankInfo.type_id
            );

            await paymentMode.checkPaymentRowText(
                withoutBankInfo.name,
                'BANK',
                '-'
            );
            await paymentMode.checkPaymentRowText(
                withoutBankInfo.name,
                'STATUS',
                'Active'
            );
            await paymentMode.verifyPaymentDetails(
                withoutBankInfo.name,
                'ADDED AT'
            );
            await paymentMode.verifyPaymentDetails(
                withoutBankInfo.name,
                'ACTION'
            );
        });

        //Issue in Bank payment
        // await PROCESS_TEST.step('with bank', async () => {
        //     await paymentMode.addNewPaymentMode();
        //     await PROCESS_TEST.step(
        //         `${withBankInfo.type_id} check`,
        //         async () => {
        //             await paymentMode.form.fillFormInputInformation(
        //                 paymentInfoSchema,
        //                 withBankInfo
        //             );
        //             await paymentMode.verifyBankVisibility(
        //                 withBankInfo.type_id
        //             );
        //             await paymentMode.form.submitButton();
        //             await paymentMode.notification.checkToastSuccess(
        //                 'Successfully saved'
        //             );
        //         }
        //     );
        // });

        //After Payment mode fixed
        // await PROCESS_TEST.step('With Bank Search and Verify', async () => {
        //     await paymentMode.listing.searchInList(withBankInfo.name);
        //     await paymentMode.checkPaymentRowText(
        //         withoutBankInfo.name,
        //         'TYPE',
        //         withBankInfo.type_id
        //     );

        //     await paymentMode.checkPaymentRowText(
        //         withBankInfo.name,
        //         'BANK',
        //         withBankInfo.bank_id
        //     );
        //     await paymentMode.checkPaymentRowText(
        //         withBankInfo.name,
        //         'STATUS',
        //         'Active'
        //     );
        //     await paymentMode.verifyPaymentDetails(
        //         withBankInfo.name,
        //         'ADDED AT'
        //     );
        //     await paymentMode.verifyPaymentDetails(withBankInfo.name, 'ACTION');
        // });

        //For without Bank Only
        await PROCESS_TEST.step('Change Status', async () => {
            await paymentMode.status.setStatus(
                withoutBankInfo.name,
                'Inactive'
            );

            await paymentMode.notification.checkToastSuccess('Status Changed');
            await paymentMode.checkStatus(withoutBankInfo.name, 'Inactive');

            await paymentMode.status.setStatus(withoutBankInfo.name, 'Active');
            await paymentMode.notification.checkToastSuccess('Status Changed');

            await paymentMode.checkStatus(withoutBankInfo.name, 'Active');
        });

        await PROCESS_TEST.step('Edit Payment Mode Name', async () => {
            await paymentMode.clickPaymentAction(withoutBankInfo.name);
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

        await PROCESS_TEST.step('Verify Dialog Open and Close', async () => {
            await paymentMode.addNewPaymentMode();
            await paymentMode.fillInput(' ', { name: 'name' });
            await paymentMode.dialog.checkConfirmDialogOpenOrNot();
        });
    });
});
