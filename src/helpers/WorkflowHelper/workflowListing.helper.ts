import { BaseHelper } from '@/baseHelper';

export class WorkflowListingHelper extends BaseHelper {
    public async init(type: 'expense' | 'advance' = 'expense') {
        if (type === 'expense') await this.navigateTo('EXPENSE_APPROVAL');
        await this.navigateTo('ADVANCE_APPROVAL');
    }
}
