import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import chalk from 'chalk';
import { TabHelper } from '../BaseHelper/tab.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { Logger } from '../BaseHelper/log.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { tr } from 'date-fns/locale';
// import { firefox } from 'playwright';

export class SavedExpenseCreation extends BaseHelper {
    public listing: ListingHelper;
    public tabHelper: TabHelper;
    public notification: NotificationHelper;
    constructor(page: any) {
        super(page);
        this.tabHelper = new TabHelper(page);
        this.notification = new NotificationHelper(page);
        this.listing = new ListingHelper(page);
    }
    private static SAVED_EXPENSE_DOM_SELECTOR =
        "//div[@dir='ltr']/following-sibling::div[1]";

    public async savedExpensePage() {
        this.locate(SavedExpenseCreation.SAVED_EXPENSE_DOM_SELECTOR);
    }
    public async checkPartyStatus(): Promise<string> {
        await this._page.waitForTimeout(1 * 5 * 1000);
        await this._page.reload();
        return await this._page
            .locator("//div[@id='party-status']/div[1]/div[1]")
            .textContent();
    }

    public async clickLink(linkName: string): Promise<void> {
        const link = this._page.locator('a').filter({ hasText: linkName });
        expect(
            await link.isVisible(),
            chalk.red(linkName + ' visibility check')
        ).toBe(true);

        await link.click();
        await this._page.waitForTimeout(2000);
        await this._page.waitForLoadState('networkidle');
        await this._page.waitForLoadState('domcontentloaded');
    }

    public async clickExpensesLink(identifier: string) {
        await this._page.reload();
        await this._page.waitForTimeout(1000);
        await this._page.waitForLoadState('domcontentloaded');
        const link = this.locate(`//a[text()="${identifier}"]`)._locator;
        expect(
            await link.isVisible(),
            chalk.red(`Check expenses ${identifier}`)
        ).toBe(true);

        await link.click();
    }

    public async expenseStatusSuccess(statusName: string): Promise<boolean> {
        const status = this._page
            .locator(`#expense-status-${statusName}`)
            .locator(`div.bg-success`);

        if (status) {
            return await status.isVisible();
        }
    }
    public async checkExpenseTo(): Promise<string> {
        const toLocator = this._page.locator(
            '(//div[@aria-label="bill-to-card"]//div)[1]'
        );
        const toBusiness = await toLocator
            .locator('(//div[contains(@class,"flex-1 gap-1")]//div)[1]')
            .innerText();
        return toBusiness;
    }

    public async checkExpenseFrom(): Promise<string> {
        const toLocator = this._page.locator(
            '(//div[@aria-label="bill-from-card"]//div)[1]'
        );
        const toBusiness = await toLocator
            .locator('//span')
            .first()
            .innerText();
        return toBusiness;
    }

    public async clickReject(): Promise<void> {
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this.fillText('Rejected', { placeholder: 'Write a comment...' });
        await this._page.getByRole('button', { name: 'Reject' }).click();
        await this._page.waitForTimeout(1000);
    }

    public async clickApprove(data: ExpenseDetailInputs[] = []): Promise<void> {
        const partyStatus = await this._page
            .locator("//div[@id='party-status']/div[1]/div[1]")
            .textContent();
        Logger.info('Before Approve check Party Status: ', partyStatus);
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
}

export class ApprovalToggleHelper extends BaseHelper {
    public async gotoExpenseApproval(): Promise<void> {
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

        await this._page.locator('.hamburger_button').click();
    }

    public async gotoTab(tab: string): Promise<void> {
        await this.click({
            role: 'tab',
            text: tab,
        });
    }

    public async toggleOption(option: string, status: string): Promise<string> {
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

    public async allInactive(): Promise<void> {
        await this.toggleInactive();
        await this.gotoTab('Finops');
        await this.toggleInactive();
        await this.gotoTab('Payment');
        await this.toggleInactive();
    }

    public async toggleInactive(): Promise<void> {
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
