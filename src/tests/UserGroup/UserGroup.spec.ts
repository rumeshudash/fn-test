import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { UserCreation } from '@/helpers/UserGroupHelper/UserGroup.helper';
import { UserDetails } from '@/helpers/UserGroupHelper/UserGroupDetails.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

describe.configure({ mode: 'serial' });

describe('Configuration -> User Group Creation and Details Verification', () => {
    let userData: UserGroupData = {
        name: ``,
        manager: '',
        description: '',
        member: 'Admin Create',
        memberEmail: 'employeecreation1@test.com',
        role: 'Advance Manager',
    };

    PROCESS_TEST('TUA001', async ({ page }) => {
        const userCreation = new UserCreation(page);
        await userCreation.navigateTo('USERGROUPS');

        await test.step('Check User Group Form Opening', async () => {
            console.log(chalk.blue('Checking User Group Form Opening'));
            await userCreation.openUserGroupForm();
            console.log(chalk.green('User Group Form is visible'));
        });

        await test.step('Check User Group Form Opening', async () => {
            await userCreation.verifyCancelPopup();
        });

        await test.step('Check User Group Form Error', async () => {
            console.log(chalk.blue('Checking User Group Form Error'));
            await userCreation.fillUserGroupForm(userData);
            console.log(chalk.green('User Group Form Error is visible'));
        });

        userData.name = `Test User Group ${generateRandomNumber()}`;
        userData.manager = 'Amit Raj';
        userData.description = 'Test User Group Description';

        await test.step('Check User Group Addition', async () => {
            console.log(
                chalk.blue('Checking User Group Addition with valid details')
            );
            await userCreation.fillUserGroupForm(userData);
            console.log(chalk.green('User Group Added Successfully'));
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

            // verify usergroup is not present in active tab
            await userCreation.tabHelper.clickTab('Active');
            await userCreation.verifyIfPresent({
                data: userData,
                present: false,
                status: 'Inactive',
            });

            // verify usergroup is present in inactive tab
            await userCreation.tabHelper.clickTab('Inactive');
            await userCreation.verifyIfPresent({
                data: userData,
                present: true,
                status: 'Inactive',
            });

            // toggle status of the userCreation
            await userCreation.setStatus(userData.name, 'Active');

            // verify usergroup is present in active tab
            await userCreation.tabHelper.clickTab('Active');
            await userCreation.verifyIfPresent({
                data: userData,
                present: true,
                status: 'Active',
            });

            // verify usergroup is not present in inactive tab
            await userCreation.tabHelper.clickTab('Inactive');
            await userCreation.verifyIfPresent({
                data: userData,
                present: false,
                status: 'Active',
            });
        });
    });

    PROCESS_TEST('TUAD001', async ({ page }) => {
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

        await test.step('Check Documents Addition', async () => {
            console.log(chalk.blue('Documents Addition Checking'));
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
            console.log(chalk.green('Documents Addition Checked'));
        });

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
