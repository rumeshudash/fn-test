import { Locator, Page, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import {
    formatDate,
    formatDateProfile,
    generateRandomNumber,
} from '@/utils/common.utils';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { DetailsPageHelper } from '../BaseHelper/details.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import { DocumentHelper } from '../BaseHelper/document.helper';
import { StatusHelper } from '../BaseHelper/status.helper';
import { LISTING_ROUTES, TEST_URL } from '@/constants/api.constants';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { SetOrganization } from './SetOrg.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { ExpenseHelper } from '../ExpenseHelper/expense.helper';
import { SavedExpenseCreation } from '../ExpenseHelper/savedExpense.helper';
import { SignInHelper } from '../SigninHelper/signIn.helper';

export class ApprovalDelegation extends FormHelper {
    private _detailsPageHelper: DetailsPageHelper;
    private _listingHelper: ListingHelper;
    public tabHelper: TabHelper;
    private statusHelper: StatusHelper;
    private _documentHelper: DocumentHelper;
    private _expenseHelper: ExpenseHelper;
    private _savedExpensePage: SavedExpenseCreation;
    private _signInHelper: SignInHelper;
    private _setOrg: SetOrganization;
    private _notificationHelper: NotificationHelper;

    constructor(page: Page) {
        super(page);
        this._detailsPageHelper = new DetailsPageHelper(page);
        this._listingHelper = new ListingHelper(page);
        this.tabHelper = new TabHelper(page);
        this.statusHelper = new StatusHelper(page);
        this._documentHelper = new DocumentHelper(page);
        this._expenseHelper = new ExpenseHelper(page);
        this._savedExpensePage = new SavedExpenseCreation(page);
        this._signInHelper = new SignInHelper(page);
        this._setOrg = new SetOrganization(page);
        this._notificationHelper = new NotificationHelper(page);
    }

    public async init() {
        await this.navigateTo('MYPROFILE');
    }

    public async openDelegationForm() {
        await this._detailsPageHelper.openActionButtonItem(
            'Add Approval Delegation'
        );
    }

    public async fillAndValidateForm(
        schema: any,
        data: DelegationFillData,
        errors: ErrorType[]
    ) {
        await this.fillInput('', {
            name: 'start_time',
        });
        await this.fillFormInputInformation(schema, data);
        await this.submitButton();
        for (const err of errors) {
            await this.checkIsInputHasErrorMessage(err.message, {
                name: err.name,
            });
        }
    }

    private async getRowWithDates(start_date: string, end_date: string) {
        const row = this._listingHelper
            .getTableContainer()
            .locator('div.table-row')
            .filter({
                hasText: start_date,
            })
            .filter({
                hasText: end_date,
            })
            .first();
        return row;
    }

    public async validateDelegationRow(data: ApprovalDelegationData) {
        const start_date = formatDateProfile(data['START TIME']);
        const end_date = formatDateProfile(data['END TIME']);
        const row = await this.getRowWithDates(start_date, end_date);
        const newData = {
            ...data,
            'START TIME': start_date,
            'END TIME': end_date,
        };
        await this._listingHelper.validateRow(row, newData);
    }

    public async verifyDelegationAddition(data: ApprovalDelegationData) {
        await this.validateDelegationRow(data);
    }

    public async verifyStatusChange(
        data: ApprovalDelegationData,
        status: 'Active' | 'Inactive'
    ) {
        const start_date = formatDateProfile(data['START TIME']);
        const end_date = formatDateProfile(data['END TIME']);
        await this.navigateTo('APPROVAL_DELEGATIONS');
        const row = await this.getRowWithDates(start_date, end_date);
        await this.statusHelper.setStatusWithRow(status, row);
    }

    public async verifyDelegationInWorkflows(data: ApprovalDelegationData) {
        await this.navigateTo('APPROVAL_DELEGATIONS');
        await this.validateDelegationRow(data);
    }

    public async validateInApprovalTab(
        delegationData: ApprovalDelegationData,
        isActive: boolean,
        delegatorInfo
    ) {
        await this.tabHelper.clickTab('Approval Workflows');
        const tab = this._page.locator("//div[@data-state='active']");
        const userContainer = tab.locator('.approval-user').first();
        const delegatorContainer = tab.locator('.approval-user').last();
        if (isActive) {
            await expect(userContainer).toContainText(delegatorInfo.name);
            await expect(userContainer).toContainText(delegatorInfo.email);
            await expect(userContainer).toContainText('Transferred');
            await expect(delegatorContainer).toContainText(
                delegationData.DELEGATOR
            );
        } else {
            await expect(userContainer).not.toContainText('Transferred');
            await expect(delegatorContainer).not.toContainText(
                delegationData.DELEGATOR
            );
        }
        await expect(delegatorContainer).toContainText('Pending Approval');
    }

    public async createExpense() {
        await this.navigateTo('RAISE_EXPENSES');
        await this._documentHelper.uploadDocument(false);
        await this._expenseHelper.fillExpenses([
            {
                to: 'Hidesign India Pvt Ltd',
                from: 'Adidas India Marketing Private Limited',
                invoice: ' inv' + generateRandomNumber(),
                amount: 10000,
                taxable_amount: 10000,
                poc: 'newtestauto@company.com',
                pay_to: 'Vendor',
                desc: 'Dummy Text',
            },
        ]);
        await this.submitButton();
    }

    public async verifyDelegatorInApprovalTab(
        delegationData: ApprovalDelegationData,
        isActive: boolean,
        delegatorInfo
    ) {
        await this.validateInApprovalTab(
            delegationData,
            isActive,
            delegatorInfo
        );
        const expenseIdSpan = this.breadcrumbHelper
            .getBreadCrumbContainer()
            .getLocator()
            .locator('.text-base.text-base-secondary');
        const expenseId = await expenseIdSpan.textContent();
        const id = expenseId.split('#')[1];
        return id;
    }

    public async openDelegatorAccount(delegatorInfo, expenseId: string) {
        await this._savedExpensePage.logOut();
        await this._page.waitForLoadState('domcontentloaded');
        await this._signInHelper.signInPage(
            delegatorInfo.email,
            delegatorInfo.password
        );
        await this._page.waitForSelector('//div[@role="dialog"]', {
            state: 'attached',
        });
        await this._page.getByText('New Test Auto').click();
        await this._page.waitForURL(TEST_URL + '/e/e');
    }

    public async verifyDelegatorInProfile(data: ApprovalDelegationData) {
        await this._setOrg.openDropdownOption('My Profile');
        await this.tabHelper.clickTab('Approval Delegations');
        await this.validateDelegationRow(data);
    }

    public async verifyInExpense(userInfo, data, expenseId) {
        await this._savedExpensePage.clickLink('Expenses');
        const date = this._page.getByText('to', { exact: true });
        await date.click();
        await this.dialogHelper
            .getDialogContainer()
            .locateByText('This Year')
            .click();
        await this.dialogHelper.clickConfirmDialogAction('Apply');
        await this._listingHelper.openDetailsPage(expenseId, 'EXPENSE NO.');
        await this.validateInApprovalTab(data, true, userInfo);
        await this._savedExpensePage.clickApprove([
            {
                department: 'Finance',
                expense_head: 'Travelling',
            },
        ]);
        await this._notificationHelper.checkToastSuccess(
            'Successfully Approved!'
        );
    }
}
