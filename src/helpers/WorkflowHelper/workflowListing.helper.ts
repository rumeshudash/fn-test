import { ListingHelper } from '../BaseHelper/listing.helper';

export class WorkflowListingHelper extends ListingHelper {
    protected workflowType: 'expense' | 'advance' = 'expense';

    public init(type: typeof this.workflowType = this.workflowType) {
        this.workflowType = type;

        if (type === 'expense') return this.navigateTo('EXPENSE_APPROVAL');
        return this.navigateTo('ADVANCE_APPROVAL');
    }

    public async openApprovalCreationForm(tabName: string) {
        await this.tabHelper.clickTab(tabName);

        await this.click({ role: 'button', text: 'Add Approval' });
        await this._page.waitForTimeout(500);
    }
}
