import { PROCESS_TEST } from '@/fixtures';
import { DesignationDetailsPageHelper } from '@/helpers/DesignationHelper/DesignationDetails.helper';
import { DesignationHelper } from '@/helpers/DesignationHelper/DesignationCreation.helper';
import { generateRandomNumber } from '@/utils/common.utils';
let save_and_create: string;

const { describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });
describe('HR - Designations', () => {
    const Save_And_Create_Info = {
        name: 'Sc' + generateRandomNumber(),
    };
    const Designation_Info = {
        name: 'test' + generateRandomNumber(),
    };
    const designationUpdateInfo = {
        name: 'update' + generateRandomNumber(),
    };

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
        department_id: 'Test710037676621',
        grade_id: 'E2',
        manager_id: 'Amit Raj',
        approval_manager_id: 'Ravi',
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
            type: 'reference_select',
        },
        grade_id: {
            type: 'reference_select',
        },
        manager_id: {
            type: 'reference_select',
        },
        approval_manager_id: {
            type: 'reference_select',
        },
    };
    const notes_info = {
        comments: 'Writing comment',
    };

    const uploadDocumentInfo = {
        comments: `Testing comment on upload document ${generateRandomNumber()}`,
    };

    PROCESS_TEST('TDE001', async ({ page }) => {
        const designation = new DesignationHelper(page);
        await designation.init();
        await designation.addDesignation();
        await designation.dialog.checkFormIsOpen();
        await designation.dialog.checkDialogTitle('Add Designation');

        await PROCESS_TEST.step('Empty Name Field', async () => {
            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                {}
            );
            await designation.form.submitButton();
            await designation.form.checkIsInputFieldEmpty('name');
        });

        await PROCESS_TEST.step('Save and Create Designation', async () => {
            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                Save_And_Create_Info
            );
            await designation.saveAndCreateCheckbox();
            await designation.clickButton('Save');
            await designation.notification.checkToastSuccess(
                'Successfully saved'
            );
            await designation.closeDialogBox();
        });

        await PROCESS_TEST.step('Verify Created Designation', async () => {
            await designation.listing.searchInList(Save_And_Create_Info.name);

            await designation.verifyItem(Save_And_Create_Info.name, 'NAME');
            await designation.verifyItem(Save_And_Create_Info.name, 'STATUS');
            await designation.verifyItem(Save_And_Create_Info.name, 'ACTION');
            await designation.verifyItem(Save_And_Create_Info.name, 'ADDED AT');
        });

        await PROCESS_TEST.step('Click and Verify Name', async () => {
            await designation.clickColumnText(
                Save_And_Create_Info.name,
                'NAME'
            );
            await designation.breadCrumb.checkBreadCrumbTitle(
                'Designation Detail'
            );

            await designation.checkDetailsPage(Save_And_Create_Info.name);

            await designation.breadCrumb.clickBreadCrumbsLink('Designations');
        });

        await PROCESS_TEST.step('Inactive Designation Status', async () => {
            await designation.listing.searchInList(Save_And_Create_Info.name);
            //Change from Active to Inactive
            await designation.status.setStatus(
                Save_And_Create_Info.name,
                'Inactive'
            );
        });

        await PROCESS_TEST.step('Verifying All Tab', async () => {
            await designation.tab.clickTab('All');
            await designation.verifyItem(Save_And_Create_Info.name, 'NAME');
        });

        await PROCESS_TEST.step('Verify Active Tab', async () => {
            await designation.status.setStatus(
                Save_And_Create_Info.name,
                'Active'
            );
            await designation.tab.clickTab('Active');
            await designation.verifyChangeStatus('Active');
        });

        await PROCESS_TEST.step('Verify Inactive Tab', async () => {
            //Change from Inactive to Active
            await designation.tab.clickTab('Inactive');
            await designation.verifyChangeStatus('Inactive');
        });

        await PROCESS_TEST.step('Test Action Designation', async () => {
            await designation.tab.clickTab('Active');
            // await designation.clickAction();
            await designation.clickEditColumn(Save_And_Create_Info.name);

            await designation.form.fillFormInputInformation(
                designationInfoSchema,
                designationUpdateInfo
            );
            await designation.clickButton('Save');
            await page.waitForTimeout(500);
            await designation.notification.checkToastSuccess(
                'Successfully saved'
            );

            //For details page
            save_and_create = designationUpdateInfo.name;
            await designation.tab.clickTab('All');
        });
        await PROCESS_TEST.step('Verify Updated Info', async () => {
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
        // save_and_create = 'update158560370082';

        // const dialog = new DialogHelper(page);

        await PROCESS_TEST.step('Verify Details Page', async () => {
            await designation.init();
            // await designation.searchDesignation(); infoAfterUpdate.name
            await designation.listing.searchInList(save_and_create);
            await designation.tab.clickTab('All');
            await designation.clickDesignationRowLink(save_and_create);
            await designation.breadCrumb.checkBreadCrumbTitle(
                'Designation Detail'
            );
        });

        await PROCESS_TEST.step('Verifying Options', async () => {
            //Checks available options in Page
            await detailsPage.verifyEdit();

            await PROCESS_TEST.step('Edit Designation name', async () => {
                await detailsPage.clickEditIcon();

                await designation.form.fillFormInputInformation(
                    designationInfoSchema,
                    details_page_update
                );

                await designation.form.submitButton();
                await designation.notification.checkToastSuccess(
                    'Successfully saved'
                );
            });

            await detailsPage.verifyAction();
            await PROCESS_TEST.step('Verify Action Options', async () => {
                await detailsPage.clickActionButton();
                await detailsPage.verifyActionOptions('Add Employee');
                await detailsPage.verifyActionOptions('Add Notes');
                await detailsPage.verifyActionOptions('Add Documents');
            });
        });

        await PROCESS_TEST.step('Verify Employee Form Field', async () => {
            await detailsPage.clickActionOption('Add Employee');
            await detailsPage.dialog.checkFormIsOpen();
            await detailsPage.dialog.checkDialogTitle('Add Employee');
            await designation.form.checkIsMandatoryFields([
                'Name',
                'Email',
                'Employee Code',
            ]);
            // await dialog.verifyInputField('Name');
            // await dialog.verifyInputField('Email');
            // await dialog.verifyInputField('Employee Code');
            // await designation.dialog.verifyInputField('Department');
            // await designation.dialog.verifyInputField('Designation');
            // await designation.dialog.verifyInputField('Grade');
            // await designation.dialog.verifyInputField('Reporting Manager');
            // await designation.dialog.verifyInputField('Approval Manager');
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
        });
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
                await detailsPage.file.setFileInput({ isDialog: true });
                await detailsPage.form.fillTextAreaForm(uploadDocumentInfo);
                await detailsPage.form.submitButton();
                // await detailsPageUploadDocuments.uploadDocuments();
                // await detailsPage.clickButton('Save');
            });
            await PROCESS_TEST.step(
                'Verify Documents Tab Details',
                async () => {
                    await detailsPageUploadDocuments.tab.clickTab('Documents');
                    await detailsPageUploadDocuments.verifyDocumentsTabDetails();
                }
            );
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
    });
});
