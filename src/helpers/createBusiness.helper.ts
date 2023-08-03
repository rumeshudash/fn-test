import { BaseHelper } from "./BaseHelper/base.helper";

export class CreateBusinessHelper extends BaseHelper {
  private static CREATE_BUSINESS_DOM_SELECTOR =
    "(//div[@data-state='open']//div)[1]";

  public async fillBusiness(name: CreateBusinessInput) {
    const helper = this.locate(
      CreateBusinessHelper.CREATE_BUSINESS_DOM_SELECTOR
    );
    await helper.fillText(name.business_name, {
      placeholder: "Enter your organization name",
    });
  }

  public async clickContinue() {
    await this._page.getByRole("button", { name: "Continue" }).click();
  }
}
