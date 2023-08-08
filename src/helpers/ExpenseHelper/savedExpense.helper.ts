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

    public async getExpData() {
        return this._page
            .locator("//span[@class='text-base text-base-secondary']")
            .textContent();
    }
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
        return await this._page
            .locator('div.approval-status')
            .first()
            .textContent();
    }

    public async logOut() {
        await this._page.locator('a').filter({ hasText: 'Logout' }).click();
        await this._page.waitForTimeout(2000);
    }

    public async clickLink(linkName: string) {
        await this._page.locator('a').filter({ hasText: linkName }).click();
        await this._page.waitForTimeout(2000);
    }

    public async clickReject() {
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this.fillText('Rejected', { placeholder: 'Write a comment...' });
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this._page.waitForTimeout(1000);
    }

    public async clickApprove(data: ExpenseDetailInputs[] = []) {
        await this.click({ role: 'button', name: 'Approve' });
        const title = await this._page.getByText('Warning').isVisible();
        if (title === true) {
            await this.click({ role: 'button', name: 'Update' });
            for (let update of data) {
                if (update.department)
                    await this.selectOption({
                        input: update.department,
                        placeholder: 'Select Department',
                    });

                if (update.expense_head)
                    await this.selectOption({
                        input: update.expense_head,
                        placeholder: 'Select Expense Head',
                    });
            }
            await this.fillText('Approved', {
                placeholder: 'Write a comment...',
            });
            await this.click({ role: 'button', name: 'Approve' });
        } else {
            await this.fillText('Approved', {
                placeholder: 'Write a comment...',
            });
            await this.click({ role: 'button', name: 'Approve' });
        }
        await this._page.waitForTimeout(1000);
    }

    public async clickApproveWithoutComment() {
        await this._page
            .locator(
                "//div[contains(@class,'w-full border-r')]/following-sibling::button[1]"
            )
            .click();
        await this.click({ role: 'menuitem', name: 'Approve without comment' });
        await this._page.waitForTimeout(1000);
    }
}
