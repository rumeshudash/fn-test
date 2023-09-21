import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
// import { firefox } from 'playwright';

let pocEmail;
let finopsEmail;
export class SavedExpenseCreation extends BaseHelper {
    public tabHelper: TabHelper;
    public notification: NotificationHelper;
    constructor(page: any) {
        super(page);
        this.tabHelper = new TabHelper(page);
        this.notification = new NotificationHelper(page);
    }
    private static SAVED_EXPENSE_DOM_SELECTOR =
        "//div[@dir='ltr']/following-sibling::div[1]";

    public async savedExpensePage() {
        this.locate(SavedExpenseCreation.SAVED_EXPENSE_DOM_SELECTOR);
    }
    public async checkPartyStatus() {
        return await this._page
            .locator("//div[@id='party-status']/div[1]/div[1]")
            .textContent();
    }

    // public async toastMessage() {
    //     return await this._page.locator("//div[@role='status']").textContent();
    // }

    // public async clickTab(buttonName: string) {
    //     await this.click({ role: 'tab', name: buttonName });
    // }
    public async clickLink(linkName: string) {
        await this._page.locator('a').filter({ hasText: linkName }).click();
        await this._page.waitForTimeout(1000);
    }

    public async expenseStatusSuccess(statusName: string) {
        const status = this._page
            .locator(`#expense-status-${statusName}`)
            .locator(`div.bg-success`);

        if (status) {
            return await status.isVisible();
        }
    }
    public async checkExpenseTo() {
        const toLocator = this._page.locator(
            '(//div[@aria-label="bill-to-card"]//div)[1]'
        );
        const toBusiness = await toLocator
            .locator('(//div[contains(@class,"flex-1 gap-1")]//div)[1]')
            .innerText();
        return toBusiness;
    }

    public async checkExpenseFrom() {
        const toLocator = this._page.locator(
            '(//div[@aria-label="bill-from-card"]//div)[1]'
        );
        const toBusiness = await toLocator
            .locator('//span')
            .first()
            .innerText();
        return toBusiness;
    }

    public async clickReject() {
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this.fillText('Rejected', { placeholder: 'Write a comment...' });
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this._page.waitForTimeout(1000);
    }

    public async clickApprove(data: ExpenseDetailInputs[] = []) {
        const partyStatus = await this._page
            .locator("//div[@id='party-status']/div[1]/div[1]")
            .textContent();
        console.log('Before Approve check Party Status: ', partyStatus);
        if (partyStatus === 'Submitted' || partyStatus === 'Pending Approval') {
            await this.click({ role: 'button', name: 'Approve' });
        }
        for (let update of data) {
            if (update.department)
                await this.selectOption({
                    input: update.department,
                    name: 'department_id',
                });

            if (update.expense_head)
                await this.selectOption({
                    input: update.expense_head,
                    name: 'expense_head_id',
                });
            if (update.comment)
                await this.fillText(update.comment, { name: 'comment' });
        }
        await this.fillText('Approved', {
            placeholder: 'Write a comment...',
        });
        await this.click({ role: 'button', name: 'Approve' });
        await this._page.waitForLoadState('networkidle');
    }

    public async logOut() {
        await this._page.locator('a').filter({ hasText: 'Logout' }).click();
    }
}

export class ApprovalWorkflowsTab extends BaseHelper {
    private APPROVAL_WORKFLOWS_DOM_SELECTOR =
        "//div[@aria-label='Verification Approvals']";

    public async getExpData() {
        const helper = this.locate(this.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        return helper._page
            .locator("//span[@class='text-base text-base-secondary']")
            .textContent();
    }
    public async checkLevel() {
        const helper = this.locate(this.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        const verificationContainer = helper.locateByText('Pending Approval');

        if ((await verificationContainer.count()) >= 2) {
            return await helper._page
                .locator("(//div[@class='col-flex']) [1]")
                .locator('span.level-number')
                .textContent();
        } else {
            return await helper._page
                .locator("(//div[@class='col-flex'])")
                .locator('span.level-number')
                .textContent();
        }
    }

    public async checkUser() {
        const helper = this.locate(this.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        await helper._page.locator('p.approval-user-name').textContent();
    }

    public async checkEmail() {
        const helper = this.locate(this.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        pocEmail = await helper._page
            .locator('span.approval-user-email')
            .textContent();
        return pocEmail;
    }
    public async checkApprovalStatus(levelName) {
        const helper = this.locate(this.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        return await helper._page
            .getByLabel(levelName)
            .locator('div.approval-status')
            .first()
            .textContent();
    }
    public async checkByFinOpsAdmin(labelName: string) {
        const levelOne = this._page.locator("(//div[@class='col-flex'])[1]");
        const levelOneVisibility = await levelOne
            .locator(
                "(//div[contains(@class,'row-flex justify-between')]/following-sibling::div)[1]"
            )
            .isVisible();
        if (levelOneVisibility === false) {
            await this._page
                .getByLabel(labelName)
                .locator('div.workflow-level-header div.icon-container')
                .filter({ hasText: /^arrow_back_ios_new$/ })
                .click();
            return this._page.locator('div.approval-status').textContent();
        } else {
            return this._page
                .locator('div.approval-status')
                .first()
                .textContent();
        }
    }

    public async checkApprovalByFinOps() {
        const verificationApproval = this._page.getByLabel(
            'Verification Approvals'
        );
        await expect(
            verificationApproval.locator('.approval-status'),
            chalk.red('Approval status contains')
        ).toContainText('Approved');
    }

    public async checkManagerApproval() {
        const verificationApproval = this._page.getByLabel(
            'Verification Approvals'
        );
        await expect(
            verificationApproval.locator('.approval-status').nth(1)
        ).toContainText('Approved');
    }

    public async nextVerificationFlows() {
        await this._page.reload();
        await this._page.reload();
        const helper = this.locate(this.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        const verificationContainer = helper.locateByText('Pending Approval');
        console.log(
            'verificationContainer: ',
            await verificationContainer.count()
        );
        for (let i; i < (await verificationContainer.count()); i++) {
            return await verificationContainer.nth(i).textContent();
        }
    }

    public async nextApprovalFlows(flowsName) {
        await this._page.reload();

        await this._page.reload();
        await this._page.waitForTimeout(1000);
        const flowsContainer = this._page.locator(
            `//div[@aria-label='${flowsName}']`
        );

        const flowsStatus = flowsContainer
            .locator('(//div[@class="col-flex"])')
            .filter({ hasText: 'Pending Approval' });
        if (flowsStatus) {
            const email = await flowsStatus
                .locator("(//span[@class='text-xs approval-user-email'])[2]")
                .textContent();
            console.log(email);
            return email;
        }
    }

    public async nextPendingFlows(flowsName) {
        await this._page.reload();
        await this._page.reload();
        // await this._page.waitForLoadState('load');
        await this._page.waitForTimeout(2000);
        const flowsContainer = this._page
            .locator(`//div[@aria-label='${flowsName}']`)
            .locator('div.approval-status')
            .nth(2);
        if (await flowsContainer.isVisible())
            return await flowsContainer.textContent();
    }

    public async checkPendingFlows() {
        await this._page.reload();
        await this._page.reload();
        // await this._page.waitForLoadState('load');
        await this._page.waitForTimeout(2000);
        const verificationApproval = this._page.getByLabel('FinOps Approvals');
        await expect(
            verificationApproval.locator('.approval-status')
        ).toContainText('Pending Approval');
    }

    public async clickApproveWithoutComment() {
        await this.click({
            selector:
                "//div[contains(@class,'w-full border-r')]/following-sibling::button[1]",
        });
        await this.click({ role: 'menuitem', name: 'Approve without comment' });
        await this._page.waitForTimeout(1000);
    }
}

export class FinOpsVerificationHelper extends BaseHelper {
    private FINOPS_VERIFICATION_DOM_SELECTOR =
        '//div[@aria-label="FinOps Approvals"]';
    helper = this.locate(this.FINOPS_VERIFICATION_DOM_SELECTOR);
    public async getLevelName() {
        return await this.helper._page
            .locator('span.level-name')
            .first()
            .textContent();
    }

    public async getLevelStatus() {
        return await this.helper._page
            .locator('div.approval-status')
            .first()
            .textContent();
    }

    public async getFinopsEmail() {
        finopsEmail = await this.helper._page
            .locator('span.approval-user-email')
            .first()
            .textContent();
        return finopsEmail;
    }

    public async getEmailName() {
        return await this.helper._page
            .locator('p.approval-user-name')
            .first()
            .textContent();
    }
}

export class PaymentVerificationHelper extends BaseHelper {
    private PAYMENT_VERIFICATION_DOM_SELECTOR =
        '//div[@aria-label="Payment Approvals"]';
    helper = this.locate(this.PAYMENT_VERIFICATION_DOM_SELECTOR);
    public async getLevelName() {
        return await this.helper._page
            .locator('span.level-name')
            .first()
            .textContent();
    }

    public async getLevelStatus() {
        return await this.helper._page
            .locator('div.approval-status')
            .first()
            .textContent();
    }

    public async getPaymentEmail() {
        finopsEmail = await this.helper._page
            .getByLabel('Payment Approvals')
            .locator('span.approval-user-email')
            .first()
            .textContent();
        return finopsEmail;
    }

    public async getEmailName() {
        return await this.helper._page
            .locator('p.approval-user-name')
            .first()
            .textContent();
    }
}

export class ApprovalToggleHelper extends BaseHelper {
    public async gotoExpenseApproval() {
        // await this._page.goto(TEST_URL + '/e/f/expense-approval');
        const isExpanded = await this._page
            .locator('.hamburger_button.hamburger_button--active')
            .isVisible();
        if (!isExpanded) {
            await this._page.locator('.hamburger_button').click();
        }
        await this._page
            .locator('.sidebar-item-title')
            .filter({ hasText: 'Work Flows' })
            .click();
        await this._page
            .locator('.sidebar-item-title')
            .filter({ hasText: 'Expense Approvals' })
            .click();
    }

    public async gotoTab(tab: string) {
        await this.click({
            role: 'tab',
            text: tab,
        });
    }

    public async toggleOption(option: string, status: string) {
        const toggleRow = this._page.locator('div.table-row.body-row').filter({
            hasText: option,
        });
        const button = toggleRow.locator('button').first();
        const text = await button.textContent();
        if (
            (text === 'Active' && status === 'Active') ||
            (text === 'Inactive' && status === 'Inactive')
        ) {
            return;
        }
        await button.click();
    }

    public async allInactive() {
        await this.toggleInactive();
        await this.gotoTab('Finops');
        await this.toggleInactive();
        await this.gotoTab('Payment');
        await this.toggleInactive();
    }

    public async toggleInactive() {
        await this._page.waitForSelector('div.table-row.body-row');
        const toggleRow = await this._page
            .locator('div.table-row.body-row')
            .all();
        for (let i = 0; i < toggleRow.length; i++) {
            const button = toggleRow[i].locator('button').first();
            const text = await button.textContent();
            if (text === 'Inactive') {
                continue;
            }
            await button.click();
        }
    }
}
