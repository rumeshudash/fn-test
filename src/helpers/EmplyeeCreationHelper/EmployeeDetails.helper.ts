import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { BreadCrumbHelper } from '../BaseHelper/breadCrumb.helper';
import { DialogHelper } from '../BaseHelper/dialog.helper';
import { FileHelper } from '../BaseHelper/file.helper';
import { FormHelper } from '../BaseHelper/form.helper';
import { ListingHelper } from '../BaseHelper/listing.helper';
import { NotificationHelper } from '../BaseHelper/notification.helper';
import { TabHelper } from '../BaseHelper/tab.helper';
import chalk from 'chalk';

export class EmployeeDetailsPage extends BaseHelper {
    public employeeCreationInfo;
    public form: FormHelper;
    public notification: NotificationHelper;
    public breadCrumb: BreadCrumbHelper;
    public tab: TabHelper;
    public dialog: DialogHelper;
    public listing: ListingHelper;
    public file: FileHelper;
    constructor(employeeCreationInfo, page: any) {
        super(page);
        this.employeeCreationInfo = employeeCreationInfo;
        this.notification = new NotificationHelper(page);
        this.form = new FormHelper(page);
        this.breadCrumb = new BreadCrumbHelper(page);
        this.tab = new TabHelper(page);
        this.dialog = new DialogHelper(page);
        this.listing = new ListingHelper(page);
        this.file = new FileHelper(page);
    }
    public async parentEmployeeDetails() {
        return this.locate('//div[contains(@class,"h-full overflow-hidden")]')
            ._locator;
    }

    public async checkEmployeeName(name?: string) {
        const parentHelper = await this.parentEmployeeDetails();
        const locateName = parentHelper.filter({
            hasText: name || this.employeeCreationInfo.name,
        });

        await expect(locateName).toBeVisible();
    }

    public async checkEmployeeCode(identifier?: string) {
        const parentHelper = await this.parentEmployeeDetails();
        const locateCode = parentHelper.locator(
            "//div[@class='text-sm text-base-secondary']"
        );
        expect(await locateCode.innerText()).toBe(
            identifier || this.employeeCreationInfo.identifier
        );
    }

    public async checkEmployeeDetails(locator: string, text: string) {
        const parentHelper = await this.parentEmployeeDetails();
        const isVisible = await parentHelper.locator(locator).innerText();
        expect(isVisible).toBe(text);
    }

    public async verifyClickableLinks(
        locator: string,
        text: string,
        redirectPageTitle: string
    ) {
        const information_element = await this.parentEmployeeDetails();
        const targetElement = information_element
            .locator(locator)
            .getByText(text);
        await targetElement.click();
        await this._page.waitForTimeout(1000);
        await this._page.waitForLoadState('networkidle');

        await this.breadCrumb.checkBreadCrumbTitle(redirectPageTitle);
        await this._page.goBack({
            waitUntil: 'networkidle',
        });
    }

    public async clickEditIcon() {
        await this._page.locator("//button[@data-title='Edit']").click();
    }
    public async checkBankInfo(ifsc: string) {
        const row = await this.listing.findRowInTable(ifsc, 'IFSC CODE');
        expect(await row.isVisible(), 'Check row of IFSC Code').toBe(true);
    }
    public async setRole(title: string) {
        const role = this.locate(
            `//div[text()='${title}']/parent::div/parent::div`
        )._locator;

        await role.locator('//input').click();
    }

    public async addNotes(notes: string) {
        await this.fillText(notes, {
            selector: 'textarea',
        });
    }

    public async checkNotes(notes: string) {
        const notesParentLocator = this.locate(
            `//div[text()='${notes}']/parent::div/parent::div`
        )._locator.first();

        expect(
            await notesParentLocator.isVisible(),
            chalk.red('Checking Notes visibility')
        ).toBe(true);
        const user = notesParentLocator.locator('//p[1]');
        const date_time = notesParentLocator.locator('//p[2]');

        await expect(user).toBeVisible();
        await expect(date_time).toBeVisible();
    }

    public async checkInviteUserEmail() {
        const email = this.locate(
            `(//span[text()='${this.employeeCreationInfo.email}'])[2]`
        )._locator;
        await expect(
            email,
            chalk.red(`${this.employeeCreationInfo.email} Visibility check`)
        ).toBeVisible();
    }
    public async checkDocumentName(name: string | number) {
        const documentNameContainer = this.locate(
            "//div[contains(@class,'absolute left-0')]"
        )._locator;
        const documentName = documentNameContainer.locator(
            `//div[text()='${name}']`
        );
        await expect(
            documentName,
            chalk.red(`Document ${name} Visibility`)
        ).toBeVisible();
    }
}
