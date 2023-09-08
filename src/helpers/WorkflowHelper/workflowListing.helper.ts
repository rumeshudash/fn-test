import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';

export class WorkflowListingHelper extends BaseHelper {
    protected workflowType: 'expense' | 'advance' = 'expense';

    public init(type: typeof this.workflowType = this.workflowType) {
        this.workflowType = type;

        if (type === 'expense') return this.navigateTo('EXPENSE_APPROVAL');
        return this.navigateTo('ADVANCE_APPROVAL');
    }

    public async openApprovalCreationForm(tabName: string) {
        await this.clickTab(tabName);
    }
}
