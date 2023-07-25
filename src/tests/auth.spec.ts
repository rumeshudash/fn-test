import { PROCESS_TEST } from "../fixtures";
import { BaseHelper } from "../helpers/BaseHelper/base.helper";
const { expect, describe } = PROCESS_TEST;

describe("Auth", () => {
    PROCESS_TEST("has Name", async ({ page }) => {
        const helper = new BaseHelper(page);
        await expect(
            helper.locateByText("Test Automation", { id: "user-popover" })
        ).toBeVisible();
    });
});
