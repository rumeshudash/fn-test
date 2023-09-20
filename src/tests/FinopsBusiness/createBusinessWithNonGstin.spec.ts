import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
    Invalid_Pin_code_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import CreateFinopsBusinessHelper, {
    BusinessDetailsPageHelper,
} from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
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
let random_business_name: string;
export const updated_BusinessInfo = {
    email: 'updateduser@testing.com',
    mobile: '9876032123',
    name: 'update non gstin business',
    address: 'Update Uttar pradesh chhattis gund',
    type_id: 'Private Limited',
    pincode: 560056,
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
        Logger.info('Initial Business Data Setup', `\n`);
        const helper = await createInit(page);
        random_business_name = `non gstin business--${generateRandomNumber()}`;
        const nonGstBusiness = {
            ...businessInformation,
            name: random_business_name,
        };

        await PROCESS_TEST.step('Check Confirm Pop Up Modal', async () => {
            Logger.info(`\nstep-1-->Check Confirm Pop Up Modal`, `\n`);

            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.dialogHelper.checkConfirmDialogOpenOrNot();
            await helper.formHelper.dialogHelper.clickConfirmDialogAction('No');
        });

        await PROCESS_TEST.step('Check Mandatory Fields', async () => {
            Logger.info(`\nstep-2-->Check Mandatory Fields`, `\n`);
            await helper.formHelper.checkIsMandatoryFields(formSchema);
        });

        await PROCESS_TEST.step('Fill Form Without  Data', async () => {
            Logger.info(`\nstep-3-->Fill Form Without  Data`, `\n`);
            await helper.formHelper.fillFormInputInformation(formSchema, {});
            await helper.formHelper.submitButton();
            await helper.formHelper.checkAllMandatoryInputHasErrors(formSchema);
        });

        await PROCESS_TEST.step('Without Business Type', async () => {
            Logger.info(`\nstep-6-->Without Business Type`, `\n`);
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
            Logger.info(`\nstep-4-->Without Business Name`, `\n`);
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...nonGstBusiness,
                name: '',
            });
            await helper.formHelper.checkInputError('name', formSchema['name']);
        });

        await PROCESS_TEST.step('With Invalid Business Name ', async () => {
            Logger.info(`\nstep-5-->With Invalid Business Name`, `\n`);

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
            Logger.info(`\nstep-7-->Without Pin code`, `\n`);
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
            Logger.info(`\nstep-8-->With Invalid Pin code`, `\n`);
            await helper.formHelper.fillFormInputInformation(
                formSchema,
                {
                    ...nonGstBusiness,
                    pincode: '452',
                },
                'email'
            );

            // await helper.formHelper.checkDisableSubmit();
            await helper.formHelper.checkInputError(
                'pincode',
                formSchema['pincode'],
                Invalid_Pin_code_Error_Message
            );
        });

        await PROCESS_TEST.step('Without Address ', async () => {
            Logger.info(`\nstep-9-->Without Address`, `\n`);
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
            Logger.info(`\nstep-10-->Without Email`, `\n`);
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
            Logger.info(`\nstep-11-->With Invalid Email`, `\n`);
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
            Logger.info(`\nstep-12-->Without Mobile`, `\n`);
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
            Logger.info(`\nstep-13-->With Invalid Mobile Number`, `\n`);

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
            Logger.info(`\nstep-15-->verify create data in table`, `\n`);

            await helper.listHelper.searchInList(nonGstBusiness.name);

            await helper.verifyTableData(nonGstBusiness);
        });
    });
});

describe('Business Detail', () => {
    PROCESS_TEST('TBD001', async ({ page }) => {
        const businessDetails = new BusinessDetailsPageHelper(
            businessInformation,
            page
        );
        await businessDetails.init();
        await businessDetails.breadCrumb.checkBreadCrumbTitle('My Businesses');

        await PROCESS_TEST.step('redirect detail page', async () => {
            await businessDetails.listHelper.searchInList(random_business_name);
            await businessDetails.redirectDetailPage(
                'NAME',
                random_business_name
            );
        });

        await PROCESS_TEST.step('Verify Created Data Information', async () => {
            await businessDetails.verifyHeading(random_business_name);
            await businessDetails.verifyInformation(
                'Business Type',
                businessInformation.type_id
            );
            await businessDetails.verifyInformation(
                'Address',
                businessInformation.address
            );
            await businessDetails.verifyInformation(
                'Email',
                businessInformation.email
            );
            await businessDetails.verifyInformation(
                'Mobile Number',
                businessInformation.mobile
            );
        });

        await PROCESS_TEST.step('Edit Business Details', async () => {
            await businessDetails.clickEditIcon();
            await businessDetails.dialog.checkDialogTitle('Edit Business');

            await businessDetails.formHelper.fillFormInputInformation(
                formSchema,
                {
                    ...updated_BusinessInfo,
                    name: `update-${random_business_name}`,
                }
            );

            await businessDetails.formHelper.submitButton('Save', {
                waitForNetwork: true,
            });
            await businessDetails.checkToastSuccess('Successfully Saved');

            await page.waitForTimeout(1000);
            await page.waitForLoadState('networkidle');

            await PROCESS_TEST.step('Verify Updated Info', async () => {
                await businessDetails.verifyHeading(
                    `update-${random_business_name}`
                );

                await businessDetails.verifyInformation(
                    'Business Type',
                    updated_BusinessInfo.type_id
                );
                await businessDetails.verifyInformation(
                    'Address',
                    updated_BusinessInfo.address
                );
                await businessDetails.verifyInformation(
                    'Email',
                    updated_BusinessInfo.email
                );
                await businessDetails.verifyInformation(
                    'Mobile Number',
                    updated_BusinessInfo.mobile
                );
            });
        });
    });
});
