import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';

let pocEmail;
export class SavedExpenseCreation extends BaseHelper {
    private static SAVED_EXPENSE_DOM_SELECTOR =
        "//div[@dir='ltr']/following-sibling::div[1]";

    public async savedExpensePage() {
        this.locate(SavedExpenseCreation.SAVED_EXPENSE_DOM_SELECTOR);
    }
    public async checkPartyStatus() {
        return this._page
            .locator("//div[@id='party-status']/div[1]/div[1]")
            .textContent();
    }

    public async toastMessage() {
        return this._page.locator("//div[@role='status']").textContent();
    }

    public async clickTab(buttonName: string) {
        await this._page.getByRole('tab', { name: buttonName }).click();
    }
}

export class ApprovalWorkflowsTab extends BaseHelper {
    private static APPROVAL_WORKFLOWS_DOM_SELECTOR =
        "//div[@aria-label='Verification Approvals']";

    public async checkLevel() {
        this.locate(ApprovalWorkflowsTab.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        await this._page.locator('span.level-number').textContent();
    }

    public async checkUser() {
        this.locate(ApprovalWorkflowsTab.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        await this._page.locator('p.approval-user-name').textContent();
    }

    public async checkEmail() {
        this.locate(ApprovalWorkflowsTab.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        pocEmail = await this._page
            .locator('span.approval-user-email')
            .textContent();
        return pocEmail;
    }
    public async checkApprovalStatus() {
        this.locate(ApprovalWorkflowsTab.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        return await this._page.locator('div.approval-status').textContent();
    }
}
