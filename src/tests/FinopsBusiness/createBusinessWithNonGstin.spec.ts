import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
    Invalid_Pin_code_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { generateRandomNumber } from '@/utils/common.utils';

const businessInformation = {
    name: 'Finops Non Gstin Business',
    mobile: '9845612345',
    email: 'user@gmail.com',
    pincode: 560056,
    address: 'Uttar pradesh chhattis gund',
    // type_id: 1005, // Individual
    type_id: 'Individual',
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

    await helper.clickNavigationTab('Non GST Registered');

    return helper;
};
const { describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });
describe(`Non Gst Business Creation`, () => {
    PROCESS_TEST('TBA002 ', async ({ page }) => {
        const helper = await createInit(page);
        const nonGstBusiness = {
            ...businessInformation,
            name: `non gstin business--${generateRandomNumber()}`,
        };

        await PROCESS_TEST.step('Check Confirm Pop Up Modal', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction('No');
        });

        await PROCESS_TEST.step('Check Mandatory Fields', async () => {
            await helper.formHelper.checkMandatoryFields(formSchema);
        });

        await PROCESS_TEST.step('Fill Form Without  Data', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.submitButton();
            await helper.formHelper.checkAllMandatoryInputErrors(formSchema);
        });

        await PROCESS_TEST.step('Without Business Name', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                name: '',
            });
            await helper.formHelper.checkInputError('name', formSchema['name']);
        });

        await PROCESS_TEST.step('With Invalid Business Name ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                name: '1224556',
            });
            await helper.formHelper.checkInputError('name', formSchema['name']);

            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                name: '@$#%^^&&',
            });
            await helper.formHelper.checkInputError('name', formSchema['name']);
        });

        await PROCESS_TEST.step('Without Business Type', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                type_id: '',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'type_id',
                formSchema['type_id']
            );
        });

        await PROCESS_TEST.step('Without Pin code', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                pincode: '',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'pincode',
                formSchema['pincode']
            );
        });

        await PROCESS_TEST.step('Without Invalid Pin code', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                pincode: '452',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'pincode',
                formSchema['pincode'],
                Invalid_Pin_code_Error_Message
            );
        });

        await PROCESS_TEST.step('Without Address ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                address: '',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'address',
                formSchema['address']
            );
        });

        await PROCESS_TEST.step('Without Email ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                email: '',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'email',
                formSchema['email']
            );
        });

        await PROCESS_TEST.step('With Invalid Email  ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                email: 'usergmail.com',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'email',
                formSchema['email'],
                Invalid_Email_Error_Message
            );
        });
        await PROCESS_TEST.step('Without Mobile ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                mobile: '',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile']
            );
        });

        await PROCESS_TEST.step('With Invalid Mobile Number ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                mobile: '98456123',
            });
            await helper.formHelper.submitButton();
            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile'],
                Invalid_Mobile_Error_Message
            );
        });

        await PROCESS_TEST.step(
            'fill form with valid information ',
            async () => {
                await helper.formHelper.fillFormInputInformation(formSchema, {
                    ...nonGstBusiness,
                });

                await helper.formHelper.submitButton();
            }
        );

        await PROCESS_TEST.step('verify create data in table ', async () => {
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
            });

            await helper.formHelper.submitButton();
            await helper.checkToastSuccess('Saved Successfully !!');

            await helper.verifyTableData(nonGstBusiness);
        });
    });
});
