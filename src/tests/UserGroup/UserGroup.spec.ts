import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import { UserCreation } from '@/helpers/UserGroupHelper/UserGroup.helper';
import { UserDetails } from '@/helpers/UserGroupHelper/UserGroupDetails.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });

describe('FinOps_UsergrpCreation', () => {
    let userData: UserGroupData = {
        name: `Test User Group ${generateRandomNumber()}`,
        manager: 'Amit Raj',
        description: 'Test User Group Description',
        member: 'Admin Create',
        memberEmail: 'employeecreation1@test.com',
        role_id: 'Advance Manager',
    };

    let validationData: UserGroupData = {
        name: userData.name,
        manager: userData.manager,
        description: 'Test User Group Description',
        status: 'Active',
    };

    const formSchema = {
        name: {
            type: 'text',
            required: true,
        },
        manager: {
            type: 'reference_select',
            required: true,
        },
        description: {
            type: 'textarea',
            required: true,
        },
    };

    PROCESS_TEST('TUA001 -> User Group Creation', async ({ page }) => {
        const userCreation = new UserCreation(page);
        await userCreation.navigateTo('USERGROUPS');

        await test.step('Check User Group Form Opening', async () => {
            Logger.info('Checking User Group Form Opening');
            await userCreation.openUserGroupForm();
            Logger.success('User Group Form Opening Checked');
        });

        await test.step('Check User Group Form Opening', async () => {
            await userCreation.verifyCancelPopup();
            await userCreation.dialogHelper.clickButton('Close');
            await userCreation.dialogHelper.clickConfirmDialogAction('Yes!');
        });

        await test.step('Check User Group Form Error', async () => {
            Logger.info('Checking User Group Form Error');
            await userCreation.openUserGroupForm();
            await userCreation.fillFormInputInformation(formSchema, {});
            await userCreation.submitButton();
            await userCreation.checkAllMandatoryInputHasErrors(formSchema);
            Logger.success('User Group Form Error is visible');
        });

        await test.step('Check User Group Addition', async () => {
            Logger.info('Checking User Group Addition with valid details');
            await userCreation.fillFormInputInformation(formSchema, userData);
            await userCreation.submitButton();
            await userCreation.notificationHelper.checkToastSuccess(
                'Successfully saved'
            );
            Logger.success('User Group Added Successfully');
        });

        await test.step('Check User Group in Table', async () => {
            await userCreation.navigateTo('USERGROUPS');
            await userCreation.listHelper.searchInList(userData.name);
            const addedGroup = await userCreation.listHelper.findRowInTable(
                userData.name,
                'NAME'
            );
            await userCreation.verifyUserGroupDetails(
                addedGroup,
                userData,
                'Active'
            );
        });

        await test.step('Check User Group Details Page', async () => {
            await userCreation.openDetailsPage(userData.name);
            await userCreation.validateDetailsPage(userData);
        });

        await test.step('Check Group Status Toggle', async () => {
            // toggle status of the department
            await userCreation.setStatus(userData.name, 'Inactive');
            validationData.status = 'Inactive';

            // verify usergroup is not present in active tab
            await userCreation.tabHelper.clickTab('Active');
            await userCreation.verifyIfPresent({
                data: validationData,
                present: false,
            });

            // verify usergroup is present in inactive tab
            await userCreation.tabHelper.clickTab('Inactive');
            await userCreation.verifyIfPresent({
                data: validationData,
                present: true,
            });

            // toggle status of the userCreation
            await userCreation.setStatus(userData.name, 'Active');
            validationData.status = 'Active';

            // verify usergroup is present in active tab
            await userCreation.tabHelper.clickTab('Active');
            await userCreation.verifyIfPresent({
                data: validationData,
                present: true,
            });

            // verify usergroup is not present in inactive tab
            await userCreation.tabHelper.clickTab('Inactive');
            await userCreation.verifyIfPresent({
                data: validationData,
                present: false,
            });
        });
    });

    PROCESS_TEST('TUAD001 -> User Group Detail Page', async ({ page }) => {
        const userDetails = new UserDetails(page);
        await userDetails.navigateTo('USERGROUPS');
        await page.waitForURL(LISTING_ROUTES.USERGROUPS);

        await test.step('Check User Group Details', async () => {
            Logger.info('Checking User Group Details Page Info');
            await userDetails.openDetailsPage(userData.name);
            await userDetails.validateDetailsPage(userData);
            Logger.success('User Group Details Page Info Checked');
        });

        await test.step('Check Edit Department', async () => {
            Logger.info('Checking Department Details Edit');

            await userDetails.detailsHelper.openEditForm();
            const newUserData: UserGroupData = {
                name: 'Test' + generateRandomNumber(),
                manager: 'Abhishek Gupta',
                description: 'test' + generateRandomNumber(),
            };

            await userDetails.fillFormInputInformation(formSchema, newUserData);
            await userDetails.submitButton();
            await userDetails.notificationHelper.checkToastSuccess(
                'Successfully saved'
            );
            await userDetails.validateDetailsPage(newUserData);
            Logger.success('Department Details Edit Checked');
        });

        await test.step('Check Action Button', async () => {
            Logger.info('Checking Action Button');
            await userDetails.detailsHelper.checkActionButtonOptions([
                'Add Member',
                'Add Group Role',
                'Add Notes',
                'Add Documents',
            ]);
            Logger.success('Action Button Checked');
        });

        await test.step('Check Member Addition', async () => {
            Logger.info('Checking Member Addition');
            await userDetails.addMember(userData);
            await userDetails.verifyMemberAddition(userData);
            Logger.success('Member Addition Checked');
        });

        await test.step('Check Documents Addition', async () => {
            Logger.info('Checking Documents Addition');
            let document = {
                comment: 'test' + generateRandomNumber(),
                date: new Date(),
            };

            await userDetails.tabHelper.clickTab('Documents');
            await userDetails.addDocument(document);
            document.comment = 'test' + generateRandomNumber();
            await userDetails.addDocument(document);
            await userDetails.documentHelper.checkAllButtonsVisibility();
            await userDetails.documentHelper.checkZoom();
            await userDetails.documentHelper.checkPagination();
            await userDetails.verifyDocumentAddition(document);
            await userDetails.documentHelper.checkDocumentDelete(document);
            Logger.success('Documents Addition Checked');
        });

        await test.step('Check Notes Addition and Errors', async () => {
            Logger.info('Checking Notes Addition and Errors');
            let note = {
                comments: '',
                date: new Date(),
            };
            const notesSchema = {
                comments: {
                    type: 'textarea',
                    required: true,
                },
            };
            await userDetails.detailsHelper.openActionButtonItem('Add Notes');

            // check errors
            await userDetails.fillFormInputInformation(notesSchema, note);
            await userDetails.submitButton();
            await userDetails.checkIsMandatoryFields(notesSchema);

            // check addition
            note.comments = 'test' + generateRandomNumber();
            await userDetails.fillFormInputInformation(notesSchema, note);
            await userDetails.submitButton();

            await userDetails.verifyNoteAddition(note);
            Logger.success('Notes Addition and Errors Checked');
        });

        await test.step('Check Role Addition and Deletion', async () => {
            Logger.info('Checking Role Addition and Deletion');

            const roleSchema = {
                role_id: {
                    type: 'reference_select',
                    required: true,
                },
            };

            await userDetails.detailsHelper.openActionButtonItem(
                'Add Group Role'
            );
            await userDetails.fillFormInputInformation(roleSchema, {
                role_id: userData.role_id,
            });
            await userDetails.submitButton();

            await userDetails.verifyRoleAddition(userData);
            await userDetails.deleteRole(userData);
            await userDetails.verifyRoleDeletion(userData);
            Logger.success('Role Addition and Deletion Checked');
        });
    });
});
