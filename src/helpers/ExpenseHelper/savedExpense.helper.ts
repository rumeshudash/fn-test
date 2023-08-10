import { Page, expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';

let pocEmail;
let finopsEmail;
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
        await this.click({ role: 'tab', name: buttonName });
    }
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

    public async clickReject() {
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this.fillText('Rejected', { placeholder: 'Write a comment...' });
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this._page.waitForTimeout(1000);
    }

    public async clickApprove(data: ExpenseDetailInputs[] = []) {
        await this.click({ role: 'button', name: 'Approve' });
        const title = await this._page
            .getByRole('dialog')
            .getByText('Warning')
            .isVisible();
        if (title === true) {
            const buttons = this._page.getByRole('dialog').locator('button');
            expect(await buttons.count()).toBe(3);
            await expect(buttons.nth(0)).toContainText('Update');
            await expect(buttons.nth(1)).toContainText('Ok');

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
    public async logOut() {
        await this._page.locator('a').filter({ hasText: 'Logout' }).click();
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
    public async checkApprovalStatus(labelName) {
        this.locate(ApprovalWorkflowsTab.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        return await this._page
            .getByLabel(labelName)
            .locator('div.approval-status')
            .first()
            .textContent();
    }
    public async checkByFinOpsAdmin(labelName) {
        this.locate(ApprovalWorkflowsTab.APPROVAL_WORKFLOWS_DOM_SELECTOR);
        await this._page
            .getByLabel(labelName)
            .locator('div.workflow-level-header div.icon-container')
            .filter({ hasText: /^arrow_back_ios_new$/ })
            .click();
        const levelStatus = this._page.locator('div.approval-status').nth(1);

        if (await levelStatus.isVisible()) {
            return levelStatus.textContent();
        } else {
            return this._page
                .locator('div.approval-status')
                .first()
                .textContent();
        }
    }

    public async nextPendingFlows(flowsName) {
        await this._page.reload();

        await this._page.reload();
        await this._page.waitForTimeout(1000);
        const flowsContainer = this._page
            .locator(`//div[@aria-label='${flowsName}']`)
            .locator('div.approval-status');
        if (await flowsContainer.isVisible())
            return await flowsContainer.textContent();
    }

    public async clickApproveWithoutComment() {
        // await this._page
        //     .locator(
        //         "//div[contains(@class,'w-full border-r')]/following-sibling::button[1]"
        //     )
        //     .click();
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
