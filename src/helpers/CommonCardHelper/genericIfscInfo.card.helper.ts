import { expect } from '@playwright/test';
import { BaseHelper } from '../BaseHelper/base.helper';

type ifscInfoType = {
    ifsc_code: string;
    address: string;
};
export default class GenericIfscInfoCardHelper extends BaseHelper {
    public ifsc_data: ifscInfoType;
    public ifsc_info_card: any;
    constructor(data: ifscInfoType, page: any) {
        super(page);
        this.ifsc_data = data;
    }
    async checkImagePresent() {
        const image_element = await this.ifsc_info_card.locate('img');
        expect(
            await image_element.isVisible(),
            'ifsc image  not found !!'
        ).toBe(true);
    }

    async validateInformation() {
        this.ifsc_info_card = await this.locate('div', {
            id: 'bank_ifsc_info',
        });

        expect(
            await this.ifsc_info_card.isVisible(),
            'Ifsc card info not found !!'
        ).toBe(true);

        await this.checkImagePresent();

        await expect(
            this.ifsc_info_card,
            'Ifsc code not matched!!!'
        ).toHaveText(this.ifsc_data.ifsc_code);

        await expect(
            this.ifsc_info_card,
            'Ifsc address not matched!!!'
        ).toHaveText(this.ifsc_data.address);
    }
}
