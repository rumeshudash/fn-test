import { Page } from '@playwright/test';
import { SignInHelper } from '../SigninHelper/signIn.helper';
import { SignupHelper } from '../SignupHelper/signup.helper';

export class ProcessSignup {
    public userData = {
        username: '',
        password: '',
    };
    public signupHelper: SignupHelper;
    public signinHelper: SignInHelper;
    // constructor(page: Page) {
    //     super(page);
    //     this.signupHelper = new SignupHelper(page);
    //     this.signinHelper = new SignInHelper(page);
    // }

    public async newSignup(page: Page) {
        this.signupHelper = new SignupHelper(page);

        // this.signupHelper = new SignupHelper(page);
        await this.signupHelper.init();
        const username = SignupHelper.genRandomEmail();
        const name = 'test';
        const password = '123456';
        const confirm_password = '123456';

        await this.signupHelper.fillSignup({
            name: name,
            email: username,
            password: password,
            confirm_password: confirm_password,
        });

        await this.signupHelper.clickButton('Next →');

        await this.signupHelper.fillOtp('111111', 6);

        await this.signupHelper.clickButton('Verify →');
        await this.signupHelper.clickButton('Continue →');
        await this.signupHelper.fillInput(name, { name: 'organization_name' });

        await this.signupHelper.clickButton('Continue');
        await page.waitForLoadState('domcontentloaded');
        // await page.waitForLoadState('do')

        this.userData.username = username;
        this.userData.password = password;

        return this.userData;
    }

    public async newLogin(page: Page) {
        this.signinHelper = new SignInHelper(page);
        await this.signinHelper.init();

        await this.signinHelper.checkDashboard({
            username: this.userData.username,
            password: this.userData.password,
        });
        // if (redirectUrl) {
        //     await this.navigateTo(redirectUrl);
        // }
    }
}
