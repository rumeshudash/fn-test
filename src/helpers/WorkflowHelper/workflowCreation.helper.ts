import { BaseHelper } from '@/baseHelper';
import { WorkflowListingHelper } from './workflowListing.helper';

export class WorkflowCreationHelper extends BaseHelper {
    public async init(type: 'expense' | 'advance' = 'expense') {
        const workflowListing = new WorkflowListingHelper(this._page);
        await workflowListing.init(type);
    }
}
