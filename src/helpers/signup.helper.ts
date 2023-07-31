import { expect } from "@playwright/test";
import { BaseHelper } from "./BaseHelper/base.helper";
import { uuidV4 } from "@/utils/common.utils";

export class SignupHelper extends BaseHelper {
  private static SIGNUP_DOM_SELECTOR = "//form/parent::div";

  public async init() {
    await this.navigateTo("SIGNUP");
  }

  public static genRandomEmail() {
    return `test-${uuidV4()}@gmail.com`;
  }
  public async nextPage() {
    await this.click({ text: "Next" });
    await this._page.waitForTimeout(2000);
  }
  public async checkNextPage() {
    this.locate('//button[text()="Next →"]');
  }

  public async errorMessage() {
    return this._page
      .locator('//span[contains(@class, "label-text")]')
      .textContent();
  }

  public async isTermsChecked() {
    return this._page.locator("//input[@type='checkbox']");
  }
  public async clickPolicy() {
    await this._page.locator("//input[@type='checkbox']").click();
  }

  public async fillSignup(data: SignupDetailsInput) {
    const helper = this.locate(SignupHelper.SIGNUP_DOM_SELECTOR);

    await helper.fillInput(data.name, { name: "name" });
    await helper.fillInput(data.email, { name: "username" });
    await helper.fillInput(data.password, { name: "password" });
    await helper.fillInput(data.confirm_password, {
      name: "confirmPassword",
    });
  }
}
