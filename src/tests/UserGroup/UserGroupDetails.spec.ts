import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DetailsPageHelper } from '@/helpers/BaseHelper/details.helper';
import { DocumentHelper } from '@/helpers/BaseHelper/document.helper';
import { FileHelper } from '@/helpers/BaseHelper/file.helper';
import { DepartmentDetails } from '@/helpers/DepartmentHelper/DepartmentDetails.helper';
import { UserCreation } from '@/helpers/UserGroupHelper/UserGroup.helper';
import { UserDetails } from '@/helpers/UserGroupHelper/UserGroupDetails.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

describe('TUAD001', () => {
    PROCESS_TEST('User Group Details', async ({ page }) => {
        let userData: UserGroupData = {
            name: 'test',
            manager: 'New Test Auto',
            description: 'testt',
            member: 'Admin Create',
            memberEmail: 'employeecreation1@test.com',
            role: 'Advance Manager',
        };

        const userDetails = new UserDetails(page);
        // await userCreation.init();
        await userDetails.navigateTo('USERGROUPS');
        await page.waitForURL(LISTING_ROUTES.USERGROUPS);

        await test.step('Check User Group Details', async () => {
            console.log(chalk.blue('User Group Details Page Info Checking'));
            await userDetails.openDetailsPage(userData.name);
            await userDetails.validateDetailsPage(userData);
            console.log(chalk.green('User Group Details Page Info Checked'));
        });

        await test.step('Check Edit Department', async () => {
            console.log(chalk.blue('Department Details Edit Checking'));

            await userDetails.detailsHelper.openEditForm();
            const newUserData: UserGroupData = {
                name: 'Test' + generateRandomNumber(),
                manager: 'Abhishek Gupta',
                description: 'test' + generateRandomNumber(),
            };

            await userDetails.fillUserGroupForm({
                name: newUserData.name,
                manager: newUserData.manager,
                description: newUserData.description,
            });
            await userDetails.validateDetailsPage(newUserData);

            console.log(chalk.green('Department Details Edit Checked'));
        });

        await test.step('Check Action Button', async () => {
            console.log(chalk.blue('Action Button Checking'));
            await userDetails.detailsHelper.checkActionButtonOptions([
                'Add Member',
                'Add Group Role',
                'Add Notes',
                'Add Documents',
            ]);
            console.log(chalk.green('Action Button Checked'));
        });

        await test.step('Check Member Addition', async () => {
            console.log(chalk.blue('Member Addition Checking'));
            await userDetails.addMember(userData);
            await userDetails.verifyMemberAddition(userData);
            console.log(chalk.green('Member Addition Checked'));
        });

        // await test.step('Check Documents Addition', async () => {
        //     console.log(chalk.blue('Documents Addition Checking'));
        //     const document = {
        //         comment: 'test' + generateRandomNumber(),
        //         date: new Date(),
        //     };
        //     await userDetails.tabHelper.clickTab('Documents');

        //     await userDetails.documentHelper.checkAllButtonsVisibility();
        //     await userDetails.addDocument(document);
        //     await userDetails.documentHelper.checkZoom();
        //     await userDetails.documentHelper.checkPagination();
        //     // await userDetails.documentHelper.checkDocumentDelete(document);
        //     // await userDetails.checkDelete();
        //     // await userDetails.verifyDocumentAddition(document);
        //     console.log(chalk.green('Documents Addition Checked'));
        // });

        await test.step('Check Notes Addition and Errors', async () => {
            console.log(chalk.blue('Notes Addition and Errors Checking'));
            let note = {
                title: '',
                date: new Date(),
            };
            await userDetails.addNotes(note, false);
            note.title = 'test' + generateRandomNumber();
            await userDetails.addNotes(note, true);
            await userDetails.verifyNoteAddition(note);
            console.log(chalk.green('Notes Addition and Errors Checked'));
        });

        await test.step('Check Role Addition and Deletion', async () => {
            console.log(chalk.blue('Role Addition Checking'));
            await userDetails.addRole(userData);
            await userDetails.verifyRoleAddition(userData);
            await userDetails.deleteRole(userData);
            await userDetails.verifyRoleDeletion(userData);
            console.log(chalk.green('Role Addition Checked'));
        });
    });
});
