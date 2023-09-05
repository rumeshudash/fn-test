import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { test } from '@playwright/test';
const businessGstinInfo: gstinDataType = {
    trade_name: 'Cloudtail India Private Limited',
    value: '27AAQCS4259Q1ZA',
    pan_number: 'AAQCS4259Q',
    business_type: 'Private Limited',
    address:
        'Sagar Tech Plaza, Andheri Kurla Road, Sakinaka, Unit No-117, Mumbai Suburban, 400072, Maharashtra, NA, 1st Floor',
    status: 'Active',
};

const { expect, describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '27AAQCS4259Q1ZA',
    mobile: '9816390320',
    email: 'user@gmail.com',
};
describe(`TBA001`, () => {
    PROCESS_TEST('Create Business Account.', async ({ page }) => {
        const helper = new CreateFinopsBusinessHelper(page);
        const gstin_helper = new GenericGstinCardHelper(
            businessGstinInfo,
            page
        );
        gstin_helper.expand_card = true;
        await helper.init(); // got to business listing page
        await helper.openBusinessForm();

        await helper.checkFormIsOpen();

        await helper.fillBusinessInputInformation(businessInformation);
        await helper.checkMandatoryFields();

        await gstin_helper.gstinInfoCheck();
        // test('with all value filled', async () => {

        //     // await helper.checkMandatoryFields();
        // });
    });

    PROCESS_TEST(
        'without Gstin Number-submit button check',
        async ({ page }) => {}
    );
});
