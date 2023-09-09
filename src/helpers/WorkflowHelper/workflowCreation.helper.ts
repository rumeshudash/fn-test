import { Page } from '@playwright/test';
import { FormHelper } from '../BaseHelper/form.helper';
import { TabHelper } from '../BaseHelper/tab.helper';

export class WorkflowCreationHelper extends FormHelper {
    protected workflowType: 'expense' | 'advance' = 'expense';

    constructor(page: Page) {
        super(page);
    }

    public init(
        type: typeof this.workflowType = this.workflowType,
        approvalType: 'verification' | 'payment' | 'finops' = 'verification'
    ) {
        this.workflowType = type;

        if (type === 'expense')
            return this.navigateToUrl(`e/f/expense-approval/${approvalType}/c`);
        return this.navigateToUrl(`e/f/advance-approval/${approvalType}/c`);
    }

    public async openApprovalCreationForm(tabName: string) {
        const tabHelper = new TabHelper(this._page);
        await tabHelper.clickTab(tabName);

        await this.click({ role: 'button', text: 'Add Approval' });
        await this._page.waitForTimeout(500);
    }
}
