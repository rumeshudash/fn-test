import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';
import { FileHelper } from '../BaseHelper/file.helper';
import chalk from 'chalk';

export class BankAccountDetails extends BaseHelper {
    public bankDetails;
    public file: FileHelper;
    constructor(bankDetails, page) {
        super(page);
        this.bankDetails = bankDetails;
        this.file = new FileHelper(page);
    }
    // validate bank account name with business name
    public async validateBankAccountName() {
        expect(
            await this._page.locator('#account_name').isVisible(),
            chalk.red('Bank Name visibility')
        ).toBe(true);

        const clientBusinessName = await this._page
            .locator('#account_name')
            .inputValue();
        expect(clientBusinessName, chalk.red('Bank Name match')).toBe(
            this.bankDetails.bankName
        );
    }

    // Check if a button with the name 'Next' is visible and clickable on the page
    public async isBtnVisible() {
        expect(
            await this._page.getByRole('button', { name: 'Next' }).isEnabled(),
            chalk.red('Next button enabled ')
        ).toBe(true);
    }
    public async fillBankAccount() {
        await this.fillText(this.bankDetails.accountNumber, {
            name: 'account_number',
        });
        await this.fillText(this.bankDetails.accountNumber, {
            name: 're_account_number',
        });
        await this.fillText(this.bankDetails.ifsc, { name: 'ifsc_code' });
        await this._page.waitForLoadState('networkidle');
        await this.file.setFileInput({ isDialog: false });
        // if (IMAGE_NAME) {
        //     await this._page.setInputFiles(
        //         "//input[@type='file']",
        //         `./images/${IMAGE_NAME}`
        //     );
        // }
        await this.isBtnVisible();
    }
    public async vendorIfscLogoVisibilityValidation() {
        const iconLocator = this.locate('//img[@alt="bank"]')._locator;
        expect(
            await iconLocator.isVisible(),
            chalk.red('IFSC Bank Logo visibility')
        ).toBe(true);
    }
    public async vendorIfscDetailsValidation() {
        const ifsc_details = this.locate('div', {
            id: 'bank_ifsc_info',
        })._locator;
        expect(
            await ifsc_details.isVisible(),
            chalk.red('Bank Details visibility')
        ).toBe(true);

        return await ifsc_details.textContent();
    }
    public async bankAccountName() {
        const accountName = await this._page
            .locator('//label[@for="account_name"]/following-sibling::div[1]')
            .textContent();
        return accountName;
    }
    public async bankAccountNumber() {
        const account_number = await this._page
            .locator(
                '//span[@class="text-sm font-medium"]/following-sibling::span[1]'
            )
            .textContent();
        return account_number;
    }
    public async bankIFSCCode() {
        const ifsc_code = await this._page
            .locator("//img[@alt='bank']/following-sibling::p[1]")
            .textContent();
        return ifsc_code;
    }
    public async businessDetailsIFSC() {
        const gstin = await this._page
            .locator('//div[text()="IFSC Code"]/following-sibling::div')
            .textContent();
        return gstin;
    }
}
