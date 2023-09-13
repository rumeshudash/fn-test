import { PROCESS_TEST } from '@/fixtures';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';

const businessInformation = {
    name: 'Finops Non Gstin Business',
    mobile: '9845612345',
    email: 'user@gmail.com',
    pincode: 560056,
    address: 'Uttar pradesh chhattis gund',
    type_id: 1005, // Individual
};

const formSchema = {
    name: {
        type: 'text',
        required: true,
    },
    mobile: {
        type: 'tel',
        required: true,
    },
    email: {
        type: 'email',
        required: true,
    },
    address: {
        type: 'textarea',
        required: true,
    },
    pincode: {
        type: 'number',
        required: true,
    },
    type_id: {
        // business type
        type: 'select',
        required: true,
    },
};

const createInit = async (page: any) => {
    const title = 'Add Business';
    const helper = new CreateFinopsBusinessHelper(page);

    await helper.init(); // got to business listing page
    await helper.listHelper.openDialogFormByButtonText(title);
    await helper.formHelper.dialogHelper.checkFormIsOpen();

    await helper.formHelper.checkTitle(title);

    await helper.clickNavigationTab('Non GSTIN Registered');

    return {
        helper,
    };
};
const { describe } = PROCESS_TEST;
describe(`TBA002`, () => {
    PROCESS_TEST(
        'Fill All Business Information. and verify pan information information',
        async ({ page }) => {
            const { helper } = await createInit(page);

            await helper.formHelper.fillFormInputInformation(
                formSchema,
                businessInformation
            );

            await helper.formHelper.checkMandatoryFields(formSchema);
        }
    );

    // PROCESS_TEST(
    //     'without Gstin Number-submit button disabled check',
    //     async ({ page }) => {
    //         const { helper } = await createInit(page);
    //         await helper.formHelper.fillFormInputInformation({
    //             ...businessInformation,
    //             gstin: '',
    //         });
    //         await helper.checkGstinError();
    //         await helper.formHelper.checkDisableSubmit();
    //     }
    // );

    // PROCESS_TEST(
    //     'without Mobile Number-submit button check',
    //     async ({ page }) => {
    //         const { helper } = await createInit(page);

    //         await helper.formHelper.fillFormInputInformation({
    //             ...businessInformation,
    //             mobile: '',
    //         });
    //         await helper.checkMobileError();
    //         await helper.formHelper.checkDisableSubmit();
    //     }
    // );

    // PROCESS_TEST('without Email-submit button check', async ({ page }) => {
    //     const { helper } = await createInit(page);
    //     await helper.formHelper.fillFormInputInformation(
    //         {
    //             ...businessInformation,
    //             email: '',
    //         },
    //         'mobile'
    //     );

    //     await helper.checkEmailError();
    //     await helper.formHelper.checkDisableSubmit();
    // });

    // PROCESS_TEST('Verify Invalid Gstin', async ({ page }) => {
    //     const { helper } = await createInit(page);
    //     await helper.formHelper.fillFormInputInformation({
    //         ...businessInformation,
    //         gstin: '27AAQCS4259Q1Z1',
    //     });

    //     await helper.checkGstinError('Invalid Gstin Number');
    //     await helper.formHelper.checkDisableSubmit();
    // });

    // PROCESS_TEST('Verify Invalid Mobile Number', async ({ page }) => {
    //     const { helper } = await createInit(page);
    //     await helper.formHelper.fillFormInputInformation({
    //         ...businessInformation,
    //         mobile: '984561234',
    //     });

    //     await helper.checkMobileError(Invalid_Mobile_Error_Message);
    //     await helper.formHelper.checkDisableSubmit();
    // });

    // PROCESS_TEST('Verify Invalid Email address', async ({ page }) => {
    //     const { helper } = await createInit(page);
    //     await helper.formHelper.fillFormInputInformation(
    //         {
    //             ...businessInformation,
    //             email: 'usergmail',
    //         },
    //         'mobile'
    //     );

    //     await helper.checkEmailError(Invalid_Email_Error_Message);
    //     await helper.formHelper.checkDisableSubmit();
    // });
    // PROCESS_TEST('Verify Confirm Dialog Open Or not', async ({ page }) => {
    //     const { helper } = await createInit(page);
    //     await helper.formHelper.fillFormInputInformation({
    //         ...businessInformation,
    //     });

    //     await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
    // });

    // PROCESS_TEST('Create Business Account.', async ({ page }) => {
    //     const { helper, gstin_helper } = await createInit(page);

    //     await helper.formHelper.fillFormInputInformation(businessInformation);

    //     await helper.checkMandatoryFields(Object.keys(businessInformation));
    //     await gstin_helper.gstinInfoCheck();
    //     await helper.formHelper.submitButton();
    //     await helper.checkToastSuccess('Saved Successfully !!');
    //     // verifying list information
    //     await helper.verifyTableData(businessGstinInfo);
    // });
});
