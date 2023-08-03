import { uuidV4 } from "@/utils/common.utils";
import { BaseHelper } from "./BaseHelper/base.helper";

export class VerifyEmailHelper extends BaseHelper {
  private static VERIFY_EMAIL_DOM_SELECTOR =
    "(//div[contains(@class,'flex-1 h-full')])[1]";

  public async init() {
    await this.navigateTo("VERIFYEMAIL");
  }

  public async genRandomEmail() {
    const genEmail = `test-${uuidV4()}@gmail.com`;
    return genEmail;
  }

  public async verifyPageClick() {
    await this._page.locator("//button[text()='Verify →']").click();
    await this._page.waitForTimeout(2000);
  }

  public async toastMessage() {
    return this._page.locator("//div[@role='status']").textContent();
  }

  public async fillCode(data: string) {
    this.locate(VerifyEmailHelper.VERIFY_EMAIL_DOM_SELECTOR);
    for (let i = 0; i < 6; i++) {
      await this._page.locator(".otpInput").nth(i).fill(data);
    }
  }

  public async clickContinue() {
    await this._page.getByRole("button", { name: "Continue →" }).click();
    await this._page.waitForTimeout(1000);
  }
}
