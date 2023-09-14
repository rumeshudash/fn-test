import { LISTING_ROUTES } from '@/constants/api.constants';
import { PROCESS_TEST } from '@/fixtures';
import { DepartmentDetails } from '@/helpers/DepartmentHelper/DepartmentDetails.helper';
import { UserCreation } from '@/helpers/UserGroupHelper/UserGroup.helper';
import { generateRandomNumber } from '@/utils/common.utils';
import { test } from '@playwright/test';
import chalk from 'chalk';

const { describe } = PROCESS_TEST;

describe('TUA001', () => {
    PROCESS_TEST('User Group Creation Verification', async ({ page }) => {
        let userData: UserGroupData = {
            name: ``,
            manager: '',
            description: '',
        };

        const userCreation = new UserCreation(page);
        // await userCreation.init();
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
});
