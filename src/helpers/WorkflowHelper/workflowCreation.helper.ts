import { Page } from '@playwright/test';
import { FormHelper } from '../BaseHelper/form.helper';

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
}
