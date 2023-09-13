import { BaseHelper } from '@/baseHelper';
import { expect } from '@playwright/test';

/**
 * Helper class for BreadCrumbs
 */
export class BreadCrumbHelper extends BaseHelper {
    /**
     * Returns the breadcrumb container element.
     *
     * @return {Element} The breadcrumb container element.
     */
    public getBreadCrumbContainer() {
        return this.locate('div.breadcrumbs');
    }

    /**
     * Retrieves the title from the breadcrumb container.
     *
     * @return {Promise<string | null>} The title text or null if not found.
     */
    public async getBreadCrumbTitle() {
        const container = this.getBreadCrumbContainer().getLocator();
        const titleTexts = await container.locator('> h1').allInnerTexts();

        if (titleTexts.length < 1) return null;
        return titleTexts[0];
    }

    /**
     * Checks the breadcrumb title against the provided title.
     *
     * @param {string} title - The title to check against the breadcrumb title.
     * @return {Promise<void>} - A Promise that resolves with no value.
     */
    public async checkBreadCrumbTitle(title: string): Promise<void> {
        await this._page.waitForSelector(`//h1[text()="${title}"]`);
        const breadCrumbTitle = await this.getBreadCrumbTitle();

        expect(breadCrumbTitle, {
            message: `Breadcrumb title check: "${title}"`,
        }).toBe(title);
    }

    public async clickBreadCrumbsLink(linkName: string): Promise<void> {
        const breadcrumbContainer = this.getBreadCrumbContainer();
        await breadcrumbContainer
            .locate(`//a[contains(text(),"${linkName}")]`)
            ._locator.click();
    }
}
