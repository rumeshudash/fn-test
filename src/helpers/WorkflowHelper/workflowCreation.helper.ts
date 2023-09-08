import { BaseHelper } from '@/baseHelper';
import { Page } from '@playwright/test';
import { WorkflowListingHelper } from './workflowListing.helper';

export class WorkflowCreationHelper extends BaseHelper {
    private workflowListing: WorkflowListingHelper;

    constructor(page: Page) {
        super(page);
        this.workflowListing = new WorkflowListingHelper(page);
    }

    public async init(type: 'expense' | 'advance' = 'expense') {
        await this.workflowListing.init(type);
        // this.workflowListing;
    }
}
