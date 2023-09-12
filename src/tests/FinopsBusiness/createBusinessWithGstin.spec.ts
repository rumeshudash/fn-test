import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
const businessGstinInfo: gstinDataType = {
    trade_name: 'Flipkart India Private Limited',
    value: '03AABCF8078M2ZA',
    business_type: 'Private Limited',
    pan_number: 'AABCF8078M',
    address:
        'Khasra No.306, 348/305, Village Katna,, Teshil Payal, Unit No.1, Ludhiana, 141113, Punjab, NA, Khewat No.79/80,',
    status: 'Active',
};

const { describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '03AABCF8078M2ZA',
    mobile: '9845612345',
    email: 'user@gmail.com',
};
const createInit = async (page: any) => {
    const title = 'Add Business';
    const helper = new CreateFinopsBusinessHelper(page);
    const gstin_helper = new GenericGstinCardHelper(businessGstinInfo, page);
    gstin_helper.expand_card = true;
    await helper.init(); // got to business listing page
    await helper.listHelper.openDialogFormByButtonText(title);
    await helper.formHelper.dialogHelper.checkFormIsOpen();

    await helper.formHelper.checkTitle(title);

    await helper.clickNavigationTab('GSTIN Registered');

    return {
        gstin_helper,
        helper,
    };
};
describe(`TBA001`, () => {
    PROCESS_TEST(
        'Fill All Business Information. and verify gstin information',
        async ({ page }) => {
            const { helper, gstin_helper } = await createInit(page);

            await helper.formHelper.fillFormInputInformation(
                businessInformation
            );

            await helper.checkMandatoryFields(Object.keys(businessInformation));
            await gstin_helper.gstinInfoCheck();
        }
    );

    PROCESS_TEST(
        'without Gstin Number-submit button disabled check',
        async ({ page }) => {
            const { helper } = await createInit(page);
            await helper.formHelper.fillFormInputInformation({
                ...businessInformation,
                gstin: '',
            });
            await helper.checkGstinError();
            await helper.formHelper.checkDisableSubmit();
        }
    );

    PROCESS_TEST(
        'without Mobile Number-submit button check',
        async ({ page }) => {
            const { helper } = await createInit(page);

            await helper.formHelper.fillFormInputInformation({
                ...businessInformation,
                mobile: '',
            });
            await helper.checkMobileError();
            await helper.formHelper.checkDisableSubmit();
        }
    );

    PROCESS_TEST('without Email-submit button check', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(
            {
                ...businessInformation,
                email: '',
            },
            'mobile'
        );

        await helper.checkEmailError();
        await helper.formHelper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Gstin', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation({
            ...businessInformation,
            gstin: '27AAQCS4259Q1Z1',
        });

        await helper.checkGstinError('Invalid Gstin Number');
        await helper.formHelper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Mobile Number', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation({
            ...businessInformation,
            mobile: '984561234',
        });

        await helper.checkMobileError(Invalid_Mobile_Error_Message);
        await helper.formHelper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Email address', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation(
            {
                ...businessInformation,
                email: 'usergmail',
            },
            'mobile'
        );

        await helper.checkEmailError(Invalid_Email_Error_Message);
        await helper.formHelper.checkDisableSubmit();
    });
    PROCESS_TEST('Verify Confirm Dialog Open Or not', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.formHelper.fillFormInputInformation({
            ...businessInformation,
        });

        await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
    });

    PROCESS_TEST('Create Business Account.', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await helper.formHelper.fillFormInputInformation(businessInformation);

        await helper.checkMandatoryFields(Object.keys(businessInformation));
        await gstin_helper.gstinInfoCheck();
        await helper.formHelper.submitButton();
        await helper.checkToastMessage();
        // verifying list information
        await helper.verifyTableData(businessGstinInfo);
    });
});
