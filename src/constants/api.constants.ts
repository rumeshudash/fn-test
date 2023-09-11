type PATH_TYPE = 'development' | 'production' | 'local';

/**
 * @description Production Url
 */
const PRODUCTION_URL = 'https://finnoto.com';

/**
 * @description development Url
 */
const DEVELOPMENT_URL = 'https://devfn.vercel.app';

/**
 * @description Local Host Url
 */
const LOCALHOST_URL = 'http://localhost:3000';

export const handleTestUrl = (type: PATH_TYPE = 'development') => {
    switch (type) {
        case 'development':
            return DEVELOPMENT_URL;
        case 'production':
            return PRODUCTION_URL;
        case 'local':
            return LOCALHOST_URL;
        default:
            break;
    }
};

export const TEST_URL = handleTestUrl(
    (process.env.TEST_ENV as PATH_TYPE) || 'development'
);

const number = '9876543210';

export const LISTING_ROUTES = {
    EXPENSES: TEST_URL + '/e/f/expenses',
    RAISE_EXPENSES: TEST_URL + '/e/f/expense/c',
    EMPLOYEE_ADVANCES: TEST_URL + '/e/f/employee-advances',
    BUSINESSESS: TEST_URL + '/e/f/my-businesses',
    VENDORS: TEST_URL + '/e/f/vendors',
    VENDOR_INVITATIONS: TEST_URL + '/e/f/vendor-invitations',
    EMPLOYEES: TEST_URL + '/e/f/employees',
    DEPARTMENTS: TEST_URL + '/e/f/departments',
    DESIGNATIONS: TEST_URL + '/e/f/designations',
    GRADES: TEST_URL + '/e/f/grades',
    EXPENSE_APPROVAL: TEST_URL + '/e/f/expense-approval',
    ADVANCE_APPROVAL: TEST_URL + '/e/f/advance-approval',
    SIGNUP: TEST_URL + '/signup',
    SIGNIN: TEST_URL + '/login',
    VERIFYOTP: TEST_URL + '/login?mobile=',
    FORGOTPASSWORD: TEST_URL + '/forgot-password',
    VERIFYEMAIL: TEST_URL + '/verify-email',
    USERGROUPS: TEST_URL + '/e/f/user-groups',
    CUSTOMEFEILDS: TEST_URL + '/e/f/custom-fields',
    MYPROFILE: TEST_URL + '/e/f/settings/my-profile',
    EXPENSE_HEADS: TEST_URL + '/e/f/expense-heads',
    PAYMENTMODES: TEST_URL + '/e/f/payment-modes',
};
