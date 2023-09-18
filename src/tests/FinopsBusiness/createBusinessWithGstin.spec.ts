import {
    Invalid_Email_Error_Message,
    Invalid_Mobile_Error_Message,
} from '@/constants/errorMessage.constants';
import { PROCESS_TEST } from '@/fixtures';
import GenericGstinCardHelper, {
    gstinDataType,
} from '@/helpers/CommonCardHelper/genericGstin.card.helper';
import CreateFinopsBusinessHelper from '@/helpers/FinopsBusinessHelper/createFinopsBusiness.helper';
import chalk from 'chalk';
const businessGstinInfo: gstinDataType = {
    trade_name: 'Shree Mahavir Builders & Developers',
    value: '27ADDFS4470J2ZR',
    business_type: 'Partnership Firm',
    pan_number: 'ADDFS4470J',
    address:
        'VIJENDRA CHAMBERS, SHIVAJI CHOWK SECTOR 1, NAVI MUMBAI, ROOM NO 101, Thane, 400706, Maharashtra, NA, H NO 810',
    status: 'Cancelled',
};

const { describe } = PROCESS_TEST;
const businessInformation = {
    gstin: '27ADDFS4470J2ZR',
    mobile: '9845612345',
    email: 'user@gmail.com',
};

const formSchema = {
    gstin: {
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

    await helper.clickNavigationTab('GST Registered');

    return {
        gstin_helper,
        helper,
    };
};
describe(`Create Gstin Business`, () => {
    PROCESS_TEST('TBA001', async ({ page }) => {
        const { helper, gstin_helper } = await createInit(page);

        await PROCESS_TEST.step(' Check Confirm Pop Up Modal', async () => {
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
        await PROCESS_TEST.step('without Gstin Number', async () => {
            console.log(chalk.blue(`\nstep-3-->without Gstin Number`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                gstin: '',
            });
            await helper.checkGstinError();
            await helper.formHelper.checkDisableSubmit();
        });
        await PROCESS_TEST.step('Verify Invalid Gstin', async () => {
            console.log(chalk.blue(`\nstep-4-->Verify Invalid Gstin`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                gstin: '27AAQCS4259Q1Z1',
            });

            await helper.checkGstinError('Invalid Gstin Number');
            await helper.formHelper.submitButton();
        });

        await PROCESS_TEST.step('Without Email ', async () => {
            console.log(chalk.blue(`\nstep-5-->Without Email`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                email: '',
            });

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email']
            );
        });

        await PROCESS_TEST.step('With Invalid Email  ', async () => {
            console.log(chalk.blue(`\nstep-6-->With Invalid Email`, `\n`));
            await helper.formHelper.fillFormInputInformation(
                formSchema,
                {
                    ...businessInformation,
                    email: 'usergmail.com',
                },
                'mobile'
            );

            await helper.formHelper.checkInputError(
                'email',
                formSchema['email'],
                Invalid_Email_Error_Message
            );
        });
        await PROCESS_TEST.step('Without Mobile ', async () => {
            console.log(chalk.blue(`\nstep-7-->Without Mobile`, `\n`));
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: '',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile']
            );
        });

        await PROCESS_TEST.step('With Invalid Mobile Number ', async () => {
            console.log(
                chalk.blue(`\nstep-8-->With Invalid Mobile Number`, `\n`)
            );
            await helper.formHelper.fillFormInputInformation(formSchema, {
                ...businessInformation,
                mobile: '98456123',
            });

            await helper.formHelper.checkInputError(
                'mobile',
                formSchema['mobile'],
                Invalid_Mobile_Error_Message
            );
        });

        await PROCESS_TEST.step('Create Business Account.', async () => {
            console.log(
                chalk.blue(`\nstep-10-->Create Business Account.`, `\n`)
            );
            await helper.formHelper.fillFormInputInformation(
                formSchema,
                businessInformation
            );

            await helper.formHelper.checkMandatoryFields(formSchema);
            await gstin_helper.gstinInfoCheck();
            await helper.formHelper.submitButton();
            await helper.checkToastSuccess('Successfully Saved');
        });
        await PROCESS_TEST.step('verify create data in table ', async () => {
            console.log(
                chalk.blue(`\nstep-11-->verify create data in table`, `\n`)
            );
            await helper.listHelper.searchInList(businessInformation?.gstin);

            await helper.verifyTableData(businessGstinInfo, true);
        });
    });
});
