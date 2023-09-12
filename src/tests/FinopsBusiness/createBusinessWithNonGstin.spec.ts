import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';

const createInit = async (page: any) => {
    const helper = new CreateFinopsBusinessHelper(page);

    await helper.init(); // got to business listing page
    await helper.openBusinessForm();
    await helper.formHelper.dialogHelper.checkFormIsOpen();
    await helper.clickNavigationTab('GSTIN Registered');

    return {
        helper,
    };
};
