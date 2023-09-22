import { expect } from '@playwright/test';
import GenericNonGstinCardHelper, {
    nonGstinDataType,
} from '../CommonCardHelper/genericNonGstin.card.helper';
import chalk from 'chalk';
import { PAN_CODE_ADDRESS } from '@/utils/required_data';

export class VendorManagedWithoutGSTIN extends GenericNonGstinCardHelper {
    private VENDOR_MANAGED_ONBOARDING_DOM = '//div[text()="Vendor Onboarding"]';
    private BUSINESS_DETAILS_DOM =
        "//div[@class='input-addon-group input-group-md']/following-sibling::div[1]";
    private INVITATION_DETAILS_DOM =
        "(//div[contains(@class,'flex-1 gap-4')])[2]";
    public static VENDORONBOARDINGWITHOUTGSTIN_DOM =
        '//div[text()="Documents for Approval"]';

    public async fillVendorDetails(data: nonGstinDataType[] = []) {
        const helper = this.locate(this.VENDOR_MANAGED_ONBOARDING_DOM);
        for (let details of data) {
            expect(
                await helper.locate('#name')._locator.isVisible(),
                chalk.red('Name field visibility')
            ).toBe(true);

            await helper.fillText(details.trade_name, {
                name: 'name',
            });
            expect(
                await helper.locate('#display_name')._locator.isVisible(),
                chalk.red('Display Name field visibility')
            ).toBe(true);

            await helper.fillText(details.display_name, {
                name: 'display_name',
            });

            expect(
                await helper
                    .locate('input', { name: 'type_id' })
                    ._locator.isVisible(),
                chalk.red('Business Type visibility')
            ).toBe(true);

            await helper.selectOption({
                input: details.business_type,
                name: 'type_id',
            });

            expect(
                await helper.locate('#pincode')._locator.isVisible(),
                chalk.red('Pincode field visibility')
            ).toBe(true);

            await helper.fillText(details.pin_code, { name: 'pincode' });

            expect(
                await helper.locate('#address')._locator.isVisible(),
                chalk.red('Address field visibility')
            ).toBe(true);

            await helper.fillText(details.address, { name: 'address' });

            await this.checkWizardNavigationClickDocument('Documents');
            expect(
                await helper.locate('#name')._locator.inputValue(),
                chalk.red('Name field input value')
            ).not.toBeNull();

            expect(
                await helper.locate('#name')._locator.inputValue(),
                chalk.red('Name field value match')
            ).toBe(details.trade_name);

            expect
                .soft(
                    await helper.locate('#display_name')._locator.inputValue(),
                    chalk.red('Display Name input field')
                )
                .not.toBeNull();

            expect(
                await this._page
                    .locator('//div[contains(@class,"mt-2 text-sm")]')
                    .isVisible(),
                chalk.red('Pin Code Address check')
            ).toBe(true);

            expect(
                await this._page
                    .locator('//div[contains(@class,"mt-2 text-sm")]')
                    .textContent(),
                chalk.red('Pin Code Address match')
            ).toBe(PAN_CODE_ADDRESS);
            expect(
                (await helper.locate('#pincode')._locator.inputValue()).length,
                chalk.red('Pincode length check')
            ).toBeGreaterThan(5);

            expect(
                await this._page
                    .locator('//div[contains(@class,"mt-2 text-sm")]')
                    .isVisible(),
                chalk.red('Pin Code Address visibility')
            );

            expect(
                (await helper.locate('#address')._locator.inputValue()).length,
                chalk.red('Address input field ')
            ).not.toBe(0);
        }
    }
}
