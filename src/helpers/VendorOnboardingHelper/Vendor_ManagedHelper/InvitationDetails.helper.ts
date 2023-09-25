import { BaseHelper } from '@/helpers/BaseHelper/base.helper';

import { MSME_NUMBER, vendorGstinInfo } from '@/utils/required_data';
import chalk from 'chalk';
import { expect } from '@playwright/test';
import { Logger } from '@/helpers/BaseHelper/log.helper';

export class VendorInvitationDetails extends BaseHelper {
    public bankDetails;
    public lowerTDS;
    constructor(bankDetails, lowerTDS, page: any) {
        super(page);
        this.bankDetails = bankDetails;
        this.lowerTDS = lowerTDS;
    }
    private INVITATION_DETAILS_DOM =
        "(//div[contains(@class,'flex-1 gap-4')])[2]";

    public async checkFrom(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("(//div[contains(@class,'flex-1 gap-1')]//div)[1]")
            .textContent();
    }
    public async checkFromGSTIN(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM)._locator;
        const businessGSTIN = helper.locator(
            "//span[contains(@class,'text-xs text-base-tertiary')]"
        );
        await expect
            .soft(businessGSTIN, chalk.red('GSTIN of Business visibility'))
            .toBeVisible();
        if (await businessGSTIN.isVisible())
            return await businessGSTIN.textContent();
    }
    public async checkClient(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'inline-block w-3/4')]")
            .textContent();
    }

    public async checkClientGSTIN(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'text-xs cursor-pointer')]")
            .textContent();
    }

    //For non GSTIN Information
    public async checkNonGstinFrom(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("(//div[@class='w-full']//span)[3]")
            .textContent();
    }
    public async checkGstinFromNonGstin(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        const businessGSTIN = helper._page.locator(
            "(//div[contains(@class,'text-center rounded')])[1]"
        );
        await expect
            .soft(businessGSTIN, chalk.red('GSTIN of Business visibility'))
            .toBeVisible();
        if (await businessGSTIN.isVisible())
            return await businessGSTIN.textContent();
    }

    public async checkNonGstinClient(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'inline-block w-3/4')]")
            .textContent();
    }

    public async checkNonGstinClientGSTIN(): Promise<string> {
        const helper = this.locate(this.INVITATION_DETAILS_DOM);
        return await helper._page
            .locator("//span[contains(@class,'text-xs cursor-pointer')]")
            .textContent();
    }

    public async checkDocument(title: string): Promise<void> {
        const helper = this.locate(
            '//div[text()="Documents for Approval"]/parent::div'
        )._locator;
        const container = helper
            .locator(`(//div[contains(@class,'border-b cursor-pointer')])`)
            .filter({ hasText: title });
        const imageName = helper.locator(
            '//div[contains(@class,"overflow-hidden font-medium")]'
        );
        if (await container.isVisible()) {
            await container.click();
            if (title === 'GSTIN Certificate') {
                const gstinStatus = helper.locator(
                    "//p[text()='GST Status']/following-sibling::p"
                );

                await expect(
                    gstinStatus,
                    chalk.red('GSTIN Status visibility')
                ).toBeVisible();

                expect(
                    await gstinStatus.textContent(),
                    chalk.red('GSTIN Status match')
                ).toBe(vendorGstinInfo.status);

                if (await imageName.isVisible()) {
                    expect(
                        imageName,
                        chalk.red('Image Name match')
                    ).toBeVisible();
                }
            }
            if (title === 'Pan Card') {
                if (await imageName.isVisible()) {
                    expect(
                        imageName,
                        chalk.red('Image Name match')
                    ).toBeVisible();
                }
            }

            if (title === 'MSME') {
                const msmeLocator = helper.locator(
                    '//div[text()="MSME number"]/following-sibling::div[@class="font-medium"]'
                );
                Logger.info('MSME Number', await msmeLocator.textContent());
                await expect(
                    msmeLocator,
                    chalk.red('MSME visibility')
                ).toBeVisible();

                expect(
                    await msmeLocator.textContent(),
                    chalk.red('MSME match')
                ).toBe(MSME_NUMBER);

                if (await imageName.isVisible()) {
                    expect(
                        imageName,
                        chalk.red('Image Name match')
                    ).toBeVisible();
                }
            }

            if (title === 'Lower TDS') {
                const tdsCertNumber = helper.locator(
                    "//div[text()='TDS Certificate Number']/following-sibling::div"
                );
                const tdsPercentage = helper.locator(
                    '//div[text()="Lower TDS Percentage"]/following-sibling::div'
                );
                Logger.info(
                    'Lower TDS Percentage: ' + (await tdsPercentage.innerText())
                );
                const expireDate = helper.locator(
                    '//div[text()="Expiry Date"]/following-sibling::div'
                );

                expect(
                    await tdsCertNumber.textContent(),
                    chalk.red('TDS Certificate Number match')
                ).toBe(this.lowerTDS.identifier);

                expect(
                    await tdsPercentage.textContent(),
                    chalk.red('TDS Percentage match')
                ).toBe(this.lowerTDS.percentage + '%');

                expect(
                    await expireDate.textContent(),
                    chalk.red('Expiry Date match')
                ).toBe('22 Feb, 2023');

                if (await imageName.isVisible()) {
                    expect(
                        imageName,
                        chalk.red('Image Name match')
                    ).toBeVisible();
                }
            }

            if (title === 'Bank') {
                const bankName = helper.locator(
                    "//div[text()='Name']/following-sibling::div"
                );
                const accountNumber = helper.locator(
                    '//div[text()="A/C Number"]/following-sibling::div'
                );
                const ifscCode = helper.locator(
                    "//div[text()='IfSC Code']/following-sibling::div"
                );

                await expect(
                    bankName,
                    chalk.red('Bank Name match')
                ).toBeVisible();

                expect(
                    await accountNumber.textContent(),
                    chalk.red('Account Number match')
                ).toBe(this.bankDetails.account_number);

                expect(
                    await ifscCode.textContent(),
                    chalk.red('IFSC Code match')
                ).toBe(this.bankDetails.ifsc_code);
            }
        }
    }
}
/**
     * @todo -Need to add Expiry Date converter

     */
