import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
    Invalid_Pin_code_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import chalk from 'chalk';

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
        console.log(chalk.blue('Initial Business Data Setup', `\n`));
        const helper = await createInit(page);
        const nonGstBusiness = {
            ...businessInformation,
            name: `non gstin business--${generateRandomNumber()}`,
        };

        await PROCESS_TEST.step('Check Confirm Pop Up Modal', async () => {
            console.log(
                chalk.blue(`\nstep-1-->Check Confirm Pop Up Modal`, `\n`)
            );
            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction('No');
        });

        await PROCESS_TEST.step('Check Mandatory Fields', async () => {
            console.log(chalk.blue(`\nstep-2-->Check Mandatory Fields`, `\n`));
            await helper.formHelper.checkMandatoryFields(formSchema);
        });

        await PROCESS_TEST.step('Fill Form Without  Data', async () => {
            console.log(chalk.blue(`\nstep-3-->Fill Form Without  Data`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.submitButton();
            await helper.formHelper.checkAllMandatoryInputErrors(formSchema);
        });
        await PROCESS_TEST.step('Without Business Type', async () => {
            console.log(chalk.blue(`\nstep-6-->Without Business Type`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                type_id: '',
            });

            await helper.formHelper.checkInputError(
                'type_id',
                formSchema['type_id']
            );
        });

        await PROCESS_TEST.step('Without Business Name', async () => {
            console.log(chalk.blue(`\nstep-4-->Without Business Name`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                name: '',
            });
            await helper.formHelper.checkInputError('name', formSchema['name']);
        });

        await PROCESS_TEST.step('With Invalid Business Name ', async () => {
            console.log(
                chalk.blue(`\nstep-5-->With Invalid Business Name`, `\n`)
            );
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

        await PROCESS_TEST.step('Without Pin code', async () => {
            console.log(chalk.blue(`\nstep-7-->Without Pin code`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                pincode: '',
            });

            await helper.formHelper.checkInputError(
                'pincode',
                formSchema['pincode']
            );
        });

        await PROCESS_TEST.step('With Invalid Pin code', async () => {
            console.log(chalk.blue(`\nstep-8-->With Invalid Pin code`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                pincode: '452',
            });

            await helper.formHelper.checkDisableSubmit();
            await helper.formHelper.checkInputError(
                'pincode',
                formSchema['pincode'],
                Invalid_Pin_code_Error_Message
            );
        });

        await PROCESS_TEST.step('Without Address ', async () => {
            console.log(chalk.blue(`\nstep-9-->Without Address`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                address: '',
            });

            await helper.formHelper.checkInputError(
                'address',
                formSchema['address']
            );
        });

        await PROCESS_TEST.step('Without Email ', async () => {
            console.log(chalk.blue(`\nstep-10-->Without Email`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                email: '',
            });

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email']
            );
        });

        await PROCESS_TEST.step('With Invalid Email  ', async () => {
            console.log(chalk.blue(`\nstep-11-->With Invalid Email`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                email: 'usergmail.com',
            });

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email'],
                Invalid_Email_Error_Message
            );
        });
        await PROCESS_TEST.step('Without Mobile ', async () => {
            console.log(chalk.blue(`\nstep-12-->Without Mobile`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                mobile: '',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile']
            );
        });

        await PROCESS_TEST.step('With Invalid Mobile Number ', async () => {
            console.log(
                chalk.blue(`\nstep-13-->With Invalid Mobile Number`, `\n`)
            );
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                mobile: '98456123',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile'],
                Invalid_Mobile_Error_Message
            );
        });

        await PROCESS_TEST.step(
            'fill form with valid information ',
            async () => {
                console.log(
                    chalk.blue(
                        `\nstep-14-->fill form with valid information`,
                        `\n`
                    )
                );
                await helper.formHelper.fillFormInputInformation(
                    formSchema,
                    {
                        ...nonGstBusiness,
                    },
                    'name'
                );

                await helper.formHelper.submitButton('Save', {
                    waitForNetwork: true,
                });
                await helper.checkToastSuccess('Successfully Saved');
            }
        );

        await PROCESS_TEST.step('verify create data in table ', async () => {
            console.log(
                chalk.blue(`\nstep-15-->verify create data in table`, `\n`)
            );
            await helper.listHelper.searchInList(nonGstBusiness.name);

            await helper.verifyTableData(nonGstBusiness);
        });
    });
});
