import { ListingHelper } from '../BaseHelper/listing.helper';

import { DialogHelper } from '../BaseHelper/dialog.helper';

export class GradesHelper extends ListingHelper {
    public dialogHelper: DialogHelper;

    constructor(page: any) {
        super(page);
        this.dialogHelper = new DialogHelper(page);
    }
    private static GRADES_DOM_SELECTOR =
        "(//div[contains(@class,'flex-1 h-full')])[1]";

    public async init() {
        await this.navigateTo('GRADES');
    }

    public async addGrades(name: string, priority: number) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });

        await this.click({ role: 'button', name: 'save' });
    }
    public async checkPriority(name: string) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.click({ role: 'button', name: 'save' });
    }

    public async checkWithCheckbox(name: string, priority: number) {
        await this.click({ role: 'button', name: 'Add Grade' });
        await this.fillText(name, {
            name: 'name',
        });
        await this.fillText(priority, {
            name: 'priority',
        });
        await this.clickCheckbox();

        await this.click({ role: 'button', name: 'save' });
    }
    public async activeToInactive(name: string) {
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'STATUS');
    }

    public async checkTitle() {
        await this.dialogHelper.checkDialogTitle('Add Grade');
    }

    public async editGrdaes(name: string, newname: string, priority: number) {
        const row = await this.findRowInTable(name, 'NAME');
        await this.clickButtonInTable(row, 'ACTION');

        if (newname !== undefined) {
            await this.fillText(newname, {
                name: 'name',
            });
        }
        if (priority !== null) {
            await this.fillText(priority, {
                name: 'priority',
            });
        }
        await this.click({ role: 'button', name: 'save' });
    }
}
