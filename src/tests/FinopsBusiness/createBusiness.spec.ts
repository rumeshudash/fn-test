import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
const businessGstinInfo: gstinDataType = {
    trade_name: 'Rampura Industries',
    value: '03ETXPS4950M1ZP',
    business_type: 'Proprietorship',
    pan_number: 'ETXPS4950M',
    address:
        'MEHRAJ ROAD, VPO MEHRAJ, RAMPURA ROAD, RAMPURA ROAD, Bathinda, 151103, Punjab, NA, VPO MEHRAJ',
    status: 'Active',
};

const { describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '03ETXPS4950M1ZP',
    mobile: '9845612345',
    email: 'user@gmail.com',
};
const createInit = async (page: any) => {
    const helper = new CreateFinopsBusinessHelper(page);
    const gstin_helper = new GenericGstinCardHelper(businessGstinInfo, page);
    gstin_helper.expand_card = true;
    await helper.init(); // got to business listing page
    await helper.openBusinessForm();
    await helper.checkFormIsOpen();
    await helper.clickNavigationTab('GSTIN Registered');

    return {
        gstin_helper,
        helper,
    };
};
describe(`TBA001`, () => {
    PROCESS_TEST('Fill All Business Information.', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await helper.fillBusinessInputInformation(businessInformation);

        await helper.checkMandatoryFields();
        await gstin_helper.gstinInfoCheck();
    });

    PROCESS_TEST(
        'without Gstin Number-submit button disabled check',
        async ({ page }) => {
            const { helper } = await createInit(page);
            await helper.fillBusinessInputInformation({
                ...businessInformation,
                gstin: '',
            });
            await helper.checkGstinError();
            await helper.checkDisableSubmit();
        }
    );

    PROCESS_TEST(
        'without Mobile Number-submit button check',
        async ({ page }) => {
            const { helper } = await createInit(page);

            await helper.fillBusinessInputInformation({
                ...businessInformation,
                mobile: '',
            });
            await helper.checkMobileError();
            await helper.checkDisableSubmit();
        }
    );

    PROCESS_TEST('without Email-submit button check', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.fillBusinessInputInformation({
            ...businessInformation,
            email: '',
        });

        await helper.checkEmailError();
        await helper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Gstin', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.fillBusinessInputInformation({
            ...businessInformation,
            gstin: '27AAQCS4259Q1Z1',
        });

        await helper.checkGstinError('Invalid Gstin Number');
        await helper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Mobile Number', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.fillBusinessInputInformation({
            ...businessInformation,
            mobile: '984561234',
        });

        await helper.checkMobileError('Please enter a valid 10-digit number.');
        await helper.checkDisableSubmit();
    });

    PROCESS_TEST('Verify Invalid Email address', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.fillBusinessInputInformation({
            ...businessInformation,
            email: 'usergmail',
        });

        await helper.checkEmailError('Email must be a valid email');
        await helper.checkDisableSubmit();
    });

    PROCESS_TEST('Create Business Account.', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await helper.fillBusinessInputInformation(businessInformation);

        await helper.checkMandatoryFields();
        await gstin_helper.gstinInfoCheck();
        await helper.submitButton();
        await helper.checkToastMessage();
    });
});
