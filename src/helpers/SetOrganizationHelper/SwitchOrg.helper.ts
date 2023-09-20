import { SetOrganization } from './SetOrg.helper';

export class SwitchOrg extends SetOrganization {
    public async openSwitchOrg() {
        await this.openDropdownOption('Switch Organisation');
    }

    public async openOrganization(option: string) {
        await this.dialogHelper
            .getDialogContainer()
            .getLocator()
            .getByText(option)
            .click();
    }
}
