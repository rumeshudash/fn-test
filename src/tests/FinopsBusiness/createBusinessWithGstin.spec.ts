import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
const businessGstinInfo: gstinDataType = {
    trade_name: 'Reliance Retail Limited',
    value: '27AABCR1718E1ZP',
    business_type: 'Proprietorship',
    pan_number: 'AABCR1718E',
    address:
        'RCP, 5 TTC Industrial Area, Ghansoli, Thane Belapur Road, Navi Mumbai, Reliance Corporate Park, Thane, 400701, Maharashtra, NA, Gr',
    status: 'Active',
};

const { describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '27AABCR1718E1ZP',
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
    PROCESS_TEST(
        'Fill All Business Information. and verify gstin information',
        async ({ page }) => {
            const { helper, gstin_helper } = await createInit(page);

            await helper.fillBusinessInputInformation(businessInformation);

            await helper.checkMandatoryFields();
            await gstin_helper.gstinInfoCheck();
        }
    );

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
        await helper.fillBusinessInputInformation(
            {
                ...businessInformation,
                email: '',
            },
            'mobile'
        );

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
        await helper.fillBusinessInputInformation(
            {
                ...businessInformation,
                email: 'usergmail',
            },
            'mobile'
        );

        await helper.checkEmailError('Email must be a valid email');
        await helper.checkDisableSubmit();
    });
    PROCESS_TEST('Verify Confirm Dialog Open Or not', async ({ page }) => {
        const { helper } = await createInit(page);
        await helper.fillBusinessInputInformation({
            ...businessInformation,
        });

        await helper.checkConfirmDialogOpenOrNot();
    });

    PROCESS_TEST('Create Business Account.', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await helper.fillBusinessInputInformation(businessInformation);

        await helper.checkMandatoryFields();
        await gstin_helper.gstinInfoCheck();
        await helper.submitButton();
        await helper.checkToastMessage();
        await helper.verifyTableData();
    });
    // PROCESS_TEST(
    //     'Verify table data after creating business',
    //     async ({ page }) => {
    //         const { helper, gstin_helper } = await createInit(page);

    //         await helper.fillBusinessInputInformation(businessInformation);

    //         await helper.checkMandatoryFields();
    //         await gstin_helper.gstinInfoCheck();
    //         await helper.submitButton();
    //         await helper.checkToastMessage();
    //     }
    // );
});
