import { PROCESS_TEST } from '@/fixtures';
import { FormHelper } from '@/helpers/BaseHelper/form.helper';
import {
    DesignationDetailsPageHelper,
    DesignationHelper,
} from '@/helpers/DesignationHelper/designation.helper';
import { generateRandomNumber } from '@/utils/common.utils';
let save_and_create: string;

const { describe } = PROCESS_TEST;
const Save_And_Create_Info = {
    name: 'sc' + generateRandomNumber(),
};
const Designation_Info = {
    name: 'test' + generateRandomNumber(),
};
const designationUpdateInfo = {
    name: 'update' + generateRandomNumber(),
};
describe.configure({ mode: 'serial' });
describe('HR-Designations', () => {
    save_and_create = Save_And_Create_Info.name;
    //Create Designation Info

    //Update Designation Info from Details Page
    const infoAfterUpdate = {
        name: designationUpdateInfo.name,
    };

    //designationInfo must be valid to change in details page
    const details_page_update = {
        name: Designation_Info.name,
    };

    const designationInfoSchema = {
        name: {
            type: 'text',
            required: true,
        },
    };
    //Add Employee in Designation field
    const employeeInfo = {
        name: 'CTO',
        email: `user${generateRandomNumber()}@test.com`,
        identifier: `emp${generateRandomNumber()}`,
        department_id: 'Test857730457030',
        grade_id: 'E2',
        manager_id: 'Amit Raj',
        approval_manager_id: 'Ravi',
        IMAGE_NAME: 'pan-card.jpg',
        comments: 'Testing upload document comments',
    };
    const employeeInfoSchema = {
        name: {
            type: 'text',
            required: true,
        },
        email: {
            type: 'text',
            required: true,
        },
        identifier: {
            type: 'text',
            required: true,
        },
        department_id: {
            type: 'select',
        },
        grade_id: {
            type: 'select',
        },
        manager_id: {
            type: 'select',
        },
        approval_manager_id: {
            type: 'select',
        },
    };
    const notes_info = {
        comments: 'Writing comment',
    };

    PROCESS_TEST('TDE001', async ({ page }) => {
        const designation = new DesignationHelper(page);
        const formHelper = new FormHelper(page);
        await designation.init();

        await PROCESS_TEST.step('Save and Create Designation', async () => {
            console.log('PT1 ', save_and_create);
            await designation.addDesignation();
            await designation.dialog.checkDialogTitle('Add Designation');
            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                Save_And_Create_Info
            );
            await designation.saveAndCreateCheckbox();
            await designation.clickButton('Save');
            await designation.notification.getErrorMessage();
            await designation.notification.checkToastSuccess(
                'Successfully saved'
            );

            await formHelper.isInputFieldEmpty('name');
        });

        await PROCESS_TEST.step('Create Designation', async () => {
            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                Designation_Info
            );
            await designation.clickButton('Save');
            await designation.notification.checkToastSuccess(
                'Successfully saved'
            );
            await designation.dialog.closeDialog();
        });

        await PROCESS_TEST.step('Verify Created Designation', async () => {
            await designation.listing.searchInList(Designation_Info.name);

            await designation.verifyItem(Designation_Info.name, 'NAME');
            await designation.verifyItem(Designation_Info.name, 'STATUS');
            await designation.verifyItem(Designation_Info.name, 'ACTION');
            await designation.verifyItem(Designation_Info.name, 'ADDED AT');
        });

        await PROCESS_TEST.step('Change Designation Status', async () => {
            await designation.listing.searchInList(Designation_Info.name);
            //Change from Active to Inactive
            await designation.status.setStatus(
                Designation_Info.name,
                'Inactive'
            );
        });

        await PROCESS_TEST.step('Verify Inactive Tab', async () => {
            //Change from Inactive to Active
            await designation.tab.clickTab('Inactive');
            await designation.listing.searchInList(Designation_Info.name);
            await designation.verifyChangeStatus('Inactive');
        });

        await PROCESS_TEST.step('Verify Active Tab', async () => {
            await designation.status.setStatus(Designation_Info.name, 'Active');
            await designation.tab.clickTab('Active');
            await designation.verifyChangeStatus('Active');
        });

        await PROCESS_TEST.step('Verifying All Tab', async () => {
            await designation.tab.clickTab('All');
            await designation.listing.searchInList(Designation_Info.name);
            await designation.verifyItem(Designation_Info.name, 'NAME');
        });

        await PROCESS_TEST.step('Test Action Designation', async () => {
            await designation.listing.searchInList(Designation_Info.name);
            await designation.tab.clickTab('All');
            // await designation.clickAction();
            await designation.clickEditColumn(Designation_Info.name);

            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                designationUpdateInfo
            );
            await designation.clickButton('Save');
            await designation.notification.checkToastSuccess(
                'Successfully saved'
            );

            await designation.tab.clickTab('All');
            await designation.listing.searchInList(designationUpdateInfo.name);
            await designation.verifyItem(designationUpdateInfo.name, 'NAME');
            await designation.verifyItem(designationUpdateInfo.name, 'STATUS');
            await designation.verifyItem(
                designationUpdateInfo.name,
                'ADDED AT'
            );
            await designation.verifyItem(designationUpdateInfo.name, 'ACTION');
            // await designation.verifyItemInList(designationUpdateInfo.name);
        });
    });

    PROCESS_TEST('TDED001', async ({ page }) => {
        const designation = new DesignationHelper(page);
        const detailsPage = new DesignationDetailsPageHelper(
            employeeInfo,
            page
        );

        // const dialog = new DialogHelper(page);

        await PROCESS_TEST.step('Verify Details Page', async () => {
            console.log('PT2 ', save_and_create);
            await designation.init();
            // await designation.searchDesignation();
            await designation.listing.searchInList(infoAfterUpdate.name);
            await designation.tab.clickTab('All');
            await designation.clickDesignationRowLink(infoAfterUpdate.name);
            await designation.breadCrumb.checkBreadCrumbTitle(
                'Designation Detail'
            );
            await PROCESS_TEST.step('Verifying Options', async () => {
                //Checks available options in Page
                await detailsPage.verifyOptions();
            });
        });

        await PROCESS_TEST.step('Edit name from details page', async () => {
            await detailsPage.clickEditIcon();

            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                details_page_update
            );
            await designation.clickButton('Save');
            await designation.notification.checkToastSuccess(
                'Successfully saved'
            );
            // expect(
            //     await designation.toastMessage(),
            //     chalk.red('ToastMessage match')
            // ).toBe('Successfully saved ');
        });

        await PROCESS_TEST.step('Verifying Action Options', async () => {
            await detailsPage.clickActionButton();
            await detailsPage.verifyActionOptions('Add Employee');
            await detailsPage.verifyActionOptions('Add Notes');
            await detailsPage.verifyActionOptions('Add Documents');
        });

        await PROCESS_TEST.step('Verify Employee Form Field', async () => {
            await detailsPage.clickActionOption('Add Employee');
            await designation.form.checkMandatoryFields([
                'Name',
                'Email',
                'Employee Code',
            ]);
            // await dialog.verifyInputField('Name');
            // await dialog.verifyInputField('Email');
            // await dialog.verifyInputField('Employee Code');
            await designation.dialog.verifyInputField('Department');
            await designation.dialog.verifyInputField('Designation');
            await designation.dialog.verifyInputField('Grade');
            await designation.dialog.verifyInputField('Reporting Manager');
            await designation.dialog.verifyInputField('Approval Manager');
        });

        await PROCESS_TEST.step('Fill Employee Form Field', async () => {
            // const formHelper = new FormHelper(page);
            await designation.form.fillFormInputInformation(
                employeeInfoSchema,
                employeeInfo
            );
            // await detailsPage.fillEmployeeForm();
            await detailsPage.clickButton('Save');
            await designation.notification.checkToastSuccess(
                'Successfully created'
            );

            await PROCESS_TEST.step('Verify Employee Tab Details', async () => {
                // await detailsPage.verifyEmployeeTabDetails();
                await detailsPage.verifyEmployeeTab(
                    employeeInfo.identifier,
                    'IDENTIFIER'
                );
                await detailsPage.verifyEmployeeTab(
                    employeeInfo.identifier,
                    'NAME'
                );
                await detailsPage.verifyEmployeeTab(
                    employeeInfo.identifier,
                    'EMAIL'
                );
                await detailsPage.verifyEmployeeTab(
                    employeeInfo.identifier,
                    'DEPARTMENT'
                );
            });
        });

        await PROCESS_TEST.step('Fill Notes', async () => {
            await detailsPage.clickActionButton();
            await detailsPage.clickActionOption('Add Notes');
            await detailsPage.form.fillTextAreaForm(notes_info);
            await detailsPage.clickButton('Save');
        });

        await PROCESS_TEST.step('Verify Notes Tab Details', async () => {
            await detailsPage.verifyNotesTabDetails(notes_info.comments);
        });

        await PROCESS_TEST.step('Add Documents', async () => {
            const detailsPage = new DesignationDetailsPageHelper(
                details_page_update,
                page
            );

            const detailsPageUploadDocuments = new DesignationDetailsPageHelper(
                employeeInfo,
                page
            );

            await PROCESS_TEST.step('Upload Documents', async () => {
                await detailsPage.clickActionButton();
                await detailsPage.clickActionOption('Add Documents');
                await detailsPageUploadDocuments.uploadDocuments();
                // await detailsPage.clickButton('Save');
            });
            await PROCESS_TEST.step(
                'Verify Documents Tab Details',
                async () => {
                    await detailsPageUploadDocuments.verifyDocumentsTabDetails();
                }
            );
        });
    });
});
