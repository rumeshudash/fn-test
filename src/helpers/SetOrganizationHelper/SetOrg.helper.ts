import { Locator, Page, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { formatDate, generateRandomNumber } from '@/utils/common.utils';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { LISTING_ROUTES } from '@/constants/api.constants';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { ExpenseHelper } from '../ExpenseHelper/expense.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { FormHelper } from '../BaseHelper/form.helper';

export class SetOrganization extends FormHelper {
    private _documentHelper: DocumentHelper;
    public dialogHelper: DialogHelper;
    private _notificationHelper: NotificationHelper;
    private _detailsHelper: DetailsPageHelper;
    private _listingHelper: ListingHelper;
    private _tabHelper: TabHelper;
    private _expenseHelper: ExpenseHelper;
    private _statusHelper: StatusHelper;

    constructor(page: Page) {
        super(page);
        this._documentHelper = new DocumentHelper(page);
        this.dialogHelper = new DialogHelper(page);
        this._notificationHelper = new NotificationHelper(page);
        this._detailsHelper = new DetailsPageHelper(page);
        this._listingHelper = new ListingHelper(page);
        this._tabHelper = new TabHelper(page);
        this._expenseHelper = new ExpenseHelper(page);
        this._statusHelper = new StatusHelper(page);
    }

    private async _toggleSidebar() {
        const isExpanded = await this._page
            .locator('.hamburger_button.hamburger_button--active')
            .isVisible();
        if (!isExpanded) {
            await this._page.locator('.hamburger_button').click();
        }
    }

    private async _checkProfileImage(isPresent: boolean) {
        const profile = this._page.locator('.user-profile .placeholder');
        const count = await profile.count();
        if (isPresent) expect(count).toBe(0);
        else expect(count).toBe(1);
    }

    public async validateProductSelector() {
        await this.click({ selector: '#product-selector' });
        const dialog = this.dialogHelper.getDialogContainer().getLocator();
        await expect(dialog).toContainText('Recko Portal');
        await expect(dialog).toContainText('Employee Portal');
        await expect(dialog).toContainText('FinOps Portal');
    }

    public async openDropdownOption(option: string) {
        const dropDown = this._page.locator('#user-popover');
        await dropDown.click();
        const menu = this._page.locator('//div[@role="dialog"]');
        await menu.getByText(option).click();
    }

    public async validateProfileDropdown() {
        const dropDown = this._page.locator('#user-popover');
        await dropDown.click();

        const menu = this._page.locator('//div[@role="dialog"]');
        await expect(menu).toContainText('My Profile');
        await expect(menu).toContainText('Switch Organisation');
        await expect(menu).toContainText('Rename Organisation');
        await expect(menu).toContainText('Logout');
        await menu.getByText('My Profile').click();
        await this._page.waitForURL(LISTING_ROUTES.MYPROFILE);
    }

    public async validateProfileUpload() {
        await this._documentHelper.uploadDocument(false);
        await this._page.waitForTimeout(2000);
        await this.dialogHelper
            .getDialogContainer()
            .getLocator()
            .getByRole('button', { name: 'Save' })
            .click();
        await this._page.waitForLoadState('networkidle');
        await this._notificationHelper.checkToastSuccess(
            'Successfully set profile image'
        );
        await this._page.reload();
        await this._page.waitForLoadState('networkidle');
        await this._toggleSidebar();
        await this._checkProfileImage(true);
    }

    public async validateProfileDelete() {
        const deleteBtn = await this._page.locator('#my-profile-delete-button');
        await deleteBtn.click();
        await this.dialogHelper.clickConfirmDialogAction('Yes!');
        await this._notificationHelper.checkToastSuccess(
            'Successfully Removed Profile image'
        );
        await this._page.reload();
        await this._page.waitForLoadState('networkidle');
        await this._toggleSidebar();
        await this._checkProfileImage(false);
        expect(deleteBtn).not.toBeVisible();
    }

    public async validateDetailsInSidebar() {
        await this._detailsHelper.validateDetailsPageInfo('My Profile', [
            {
                selector: '#has-username',
                text: 'New Test Auto',
            },
            {
                selector: '#has-Roles',
                text: 'Finops Admin',
            },
            {
                selector: '#has-Email',
                text: 'newtestauto@company.com',
            },
            {
                selector: '#has-Mobile',
                text: '9936465792',
            },
        ]);
    }

    private async _checkPopulatedFields(cols: string[]) {
        const container = this._listingHelper.getTableContainer();
        const rows = container.locator('div.table-row.body-row');
        const count = await rows.count();
        if (count === 0) {
            console.log(chalk.blue('No rows found'));
            return;
        }
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            for (const col of cols) {
                const colText = await this._listingHelper.getCellText(row, col);
                expect(colText).not.toBe('');
            }
        }
    }

    public async validateOrganization() {
        const cols = ['ORGANIZATION NAME', 'PRODUCT', 'ADDED AT'];
        await this._checkPopulatedFields(cols);
    }

    public async validateInvitations() {
        await this._tabHelper.clickTab('Pending Invitations');
        const cols = [
            'BUSINESS NAME',
            'REQUEST RECEIVED',
            'ADDED AT',
            'ACTION',
        ];
        await this._checkPopulatedFields(cols);
    }

    public async fillBankDetails(bankInfo: BankDetails) {
        await this.fillInput(bankInfo['ACCOUNT NUMBER'], {
            name: 'account_number',
        });
        await this.fillInput(bankInfo['ACCOUNT NUMBER'], {
            name: 're_account_number',
        });
        await this.fillInput(bankInfo['IFSC CODE'], {
            name: 'ifsc_code',
        });
        await this._documentHelper.uploadDocument(true);
    }

    public async verifyDocument(bankInfo: BankDetails) {
        await this._listingHelper.openDetailsPage(
            bankInfo['ACCOUNT NUMBER'],
            'ACCOUNT NUMBER',
            false,
            'NAME',
            'span'
        );

        await this._page.waitForSelector('//div[@role="dialog"]');
        await this._page.waitForTimeout(300);
        await this._documentHelper.checkDocumentTitle('pan-card.jpg');
        await this.clickButton('Close');
    }

    public async verifyActionCheckbox() {
        const bankRows = this._listingHelper
            .getTableContainer()
            .locator('div.table-row.body-row');
        const count = await bankRows.count();
        for (let i = 0; i < count; i++) {
            const row = bankRows.nth(i);
            const cell = await this._listingHelper.getCell(row, 'ACTION');
            const checkbox = cell.locator('input[type="checkbox"]');
            await expect(checkbox).toBeVisible();
        }
    }

    public async changeDefaultAccount(bankInfo: BankDetails) {
        const row = await this._listingHelper.findRowInTable(
            bankInfo['ACCOUNT NUMBER'],
            'ACCOUNT NUMBER'
        );
        const cell = await this._listingHelper.getCell(row, 'ACTION');
        const checkbox = cell.locator('input[type="checkbox"]');
        await checkbox.check();
        await this.dialogHelper.clickConfirmDialogAction('Yes');
    }

    public async validateDefaultAccount(
        bankInfo: BankDetails,
        isDefault: boolean
    ) {
        await this._tabHelper.clickTab('Bank Accounts');
        await this._page.waitForSelector('div.table-row.body-row');
        const row = await this._listingHelper.findRowInTable(
            bankInfo['ACCOUNT NUMBER'],
            'ACCOUNT NUMBER'
        );
        const cell = await this._listingHelper.getCell(row, 'NAME');
        if (isDefault) expect(cell).toContainText('Default');
        else expect(cell).not.toContainText('Default');
    }

    public async verifyBankAccountUsage(bankInfo: BankDetails) {
        await this.navigateTo('RAISE_EXPENSES');
        await this._documentHelper.uploadDocument(false);
        await this._expenseHelper.fillBusinessDetails([
            {
                to: 'Hidesign India Pvt Ltd',
                from: 'Adidas India Marketing Private Limited',
            },
        ]);
        await this._expenseHelper.fillExpenses([
            {
                invoice: ' inv' + generateRandomNumber(),
                amount: 10000,
                taxable_amount: 10000,
                poc: 'Abhishek',
                pay_to: 'Employee',
                employee: 'Ravi',
                desc: 'Dummy Text',
            },
        ]);
        await this.clickButton('Save');
        const expenseContainer = this._page
            .locator('//div[@data-orientation="horizontal"]')
            .first();
        await expect(expenseContainer).toContainText(
            bankInfo['ACCOUNT NUMBER']
        );
        await expect(expenseContainer).toContainText(bankInfo['IFSC CODE']);
        await expect(expenseContainer).toContainText(bankInfo.NAME);
    }

    public async validateBankAccount() {
        const bankInfo: BankDetails = {
            'ACCOUNT NUMBER': generateRandomNumber(),
            'IFSC CODE': 'ICIC0004444',
            NAME: 'ICICI Bank',
        };

        const bankInfo2: BankDetails = {
            'ACCOUNT NUMBER': '137017073379',
            'IFSC CODE': 'ICIC0004444',
            NAME: 'ICICI Bank',
        };

        const defaultBankInfo: BankDetails = {
            'ACCOUNT NUMBER': '1111',
            'IFSC CODE': 'ICIC0004444',
            NAME: 'ICICI Bank',
        };

        const negativeBankInfo: BankDetails = {
            'ACCOUNT NUMBER': '111111111',
            'IFSC CODE': 'ICIC0004444444',
            NAME: 'ICICI Bank',
        };

        await this._detailsHelper.openActionButtonItem('Add Bank Account');
        await this.fillBankDetails(bankInfo);
        await this._documentHelper.uploadDocument(true);
        await this.clickButton('Save');
        await this._page.waitForTimeout(1000);
        await this._notificationHelper.checkToastSuccess(
            'Account Successfully Created'
        );

        await this._detailsHelper.openActionButtonItem('Add Bank Account');
        await this.fillBankDetails(negativeBankInfo);
        await this.clickButton('Save');
        await this._notificationHelper.checkErrorMessage(
            'IFSC Code is not allowed'
        );
        await this.dialogHelper
            .getDialogContainer()
            .getLocator()
            .locator('button.dialog-close')
            .click();

        await this._tabHelper.clickTab('Bank Accounts');
        await this._page.waitForSelector('div.table-row.body-row');
        const row = await this._listingHelper.findRowInTable(
            bankInfo['ACCOUNT NUMBER'],
            'ACCOUNT NUMBER'
        );
        await this._listingHelper.validateRow(row, bankInfo);
        await this.verifyDocument(bankInfo);
        await this.verifyActionCheckbox();

        // validate with first bank account
        await this.changeDefaultAccount(bankInfo);
        await this.validateDefaultAccount(bankInfo, true);
        await this.validateDefaultAccount(defaultBankInfo, false);

        // validate with another bank account
        await this.changeDefaultAccount(bankInfo2);
        await this.validateDefaultAccount(bankInfo2, true);
        await this.validateDefaultAccount(bankInfo, false);
    }

    public async addApprovalDelegation(data: ApprovalDelegationData) {
        await this._detailsHelper.openActionButtonItem(
            'Add Approval Delegation'
        );
        await this.fillApprovalDelegation(data);
    }

    public async fillApprovalDelegation(data: ApprovalDelegationData) {
        await this.selectOption({
            option: data.DELEGATOR,
            name: 'delegated_id',
        });
        await this.fillInput(data['START TIME'], {
            name: 'start_time',
        });
        await this.fillInput(data['END TIME'], {
            name: 'end_time',
        });
        await this.fillText(data.COMMENTS, { name: 'comments' });
        await this.clickButton('Save');
        await this._notificationHelper.checkToastSuccess('Successfully saved');
    }

    public async validateApprovalDelegation(data: ApprovalDelegationData) {
        await this._tabHelper.clickTab('Approval Delegations');
        await this.click({ text: 'ADDED AT' });
        await this.click({ role: 'menuitemradio', text: 'Descending' });
        const row = await this._listingHelper.findRowInTable('1', 'S.N');
        await this._listingHelper.validateRow(row, data);
    }

    public async validateRole() {
        await this._tabHelper.clickTab('Roles');
        const roleCols = ['ROLE NAME', 'DESCRIPTION', 'ASSIGNED ON'];
        await this._checkPopulatedFields(roleCols);
    }

    public async deactivateAll() {
        await this.navigateTo('MYPROFILE');
        await this._tabHelper.clickTab('Approval Delegations');
        const rows = this._listingHelper
            .getTableContainer()
            .locator('div.table-row.body-row');
        const count = await rows.count();
        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);
            await this._statusHelper.setStatusWithRow('Inactive', row);
        }
    }

    public async validateActionButtons() {
        await this._detailsHelper.checkActionButtonOptions([
            'Change Password',
            'Enable two factor authentication',
            'Add Bank Account',
            'Add Approval Delegation',
        ]);
    }
}
