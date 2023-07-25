import { Page } from "@playwright/test";
import { BaseHelper } from "./BaseHelper/base.helper";
import { uuidV4 } from "../utils/common.utils";

export class ExpenseHelper extends BaseHelper {
    public static amounts = [
        "100", // Auto Reject
        "110", //testing managers
        "2000", //Departmental
        "10000", // Verification Approval Travel Auto Approve
        "20000", // Auto Approval
        "810000", // All expenses
        "5000", // All travel bill
        "110000", // Sales bill greater than
        "510000", //Finance department invoices greater than
    ];
    public static tax = "80";
    public static department = "Sales";
    public static expenseHead = "Travelling";

    constructor(page: Page) {
        super(page);
    }

    public async init() {
        await this.navigateTo("EXPENSES");
    }

    public static genInvoiceNumber() {
        return `INV-${uuidV4()}-${Date.now()}`;
    }
}
