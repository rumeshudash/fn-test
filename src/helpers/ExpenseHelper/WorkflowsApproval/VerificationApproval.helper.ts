import { BaseHelper } from '@/helpers/BaseHelper/base.helper';
import { Logger } from '@/helpers/BaseHelper/log.helper';
import { expect } from '@playwright/test';
import chalk from 'chalk';

let pocEmail: string;
export class VerificationWorkflowsTab extends BaseHelper {
    private APPROVAL_WORKFLOWS_DOM_SELECTOR =
        "//div[@aria-label='Verification Approvals']";

    public async getExpData() {
        // const helper = this.locate(
        //     this.APPROVAL_WORKFLOWS_DOM_SELECTOR
        // )._locator;
        return await this.locate(
            "//span[@class='text-base text-base-secondary']"
        )._locator.textContent();
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
        const helper = this.locate(
            this.APPROVAL_WORKFLOWS_DOM_SELECTOR
        )._locator;
        await helper.locator('p.approval-user-name').textContent();
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
        // div[@aria-label="Verification Approvals"] //div[contains(@class,"col-flex")]
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
            return await this._page
                .locator('div.approval-status')
                .textContent();
        } else {
            return await this._page
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
        Logger.info(
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
            Logger.info(email);
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
