// import { format, isDate, parse } from 'date-fns';

import { format, isDate, parse, addDays } from 'date-fns';

// This will Generate Random Name
export function generateRandomName() {
    var prefixes = ['John', 'Alice', 'Robert', 'Emily', 'Michael', 'Olivia'];
    var suffixes = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis'];

    var randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    var randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    return randomPrefix + ' ' + randomSuffix;
}

// This will select the select box options
export async function selectBoxSelect(page, placeholder, optionIndex) {
    await page.locator('div').filter({ hasText: placeholder }).nth(1).click();
    await page.locator(`div[id$="-option-${optionIndex}"]`).click();
}

// this will select the date
export async function selectDate(page, placeholder, date = '25') {
    await page.getByPlaceholder(placeholder).click();
    await page.getByRole('button', { name: date }).nth(2).click();
}

// this will select the input box
export async function SelectInput(page, id, data) {
    await page.locator(id).fill(data);
}

// This will Access Listing Button
export async function ClickListingAdd(page, btnName: string) {
    await page
        .getByRole('button', { name: `add_circle_outline ${btnName}` })
        .click();
}

/**
 * Generates a random 12-digit number.
 *
 * @return {string} The generated random number as a string.
 */
export function generateRandomNumber() {
    const min = 100000000000; // Minimum 12-digit number (10^11)
    const max = 999999999999; // Maximum 12-digit number (10^12 - 1)
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Get Unique UUID v4.
 *
 * @returns string
 */
export function uuidV4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

export const formatDate = (date: string | Date, showTime?: boolean) => {
    return format(
        GetDateValue(date),
        showTime ? 'dd MMM, yyyy h:mm a' : 'dd MMM, yyyy'
    );
};

// in format 18-09-2023
export const formatDateNew = (date: string | Date) => {
    return format(GetDateValue(date), 'dd-MM-yyyy');
};

export const GetDateValue = (date: any, format?: string) => {
    if (!date || isDate(date)) return date;
    if (format) {
        return parse(date, format, new Date());
    }
    return new Date(date);
};
export function AccessNestedObject<T>(
    obj: object | T[],
    path: string | string[],
    valueNotFound: any = undefined
): T {
    if (
        !(
            (Array.isArray(path) ||
                typeof path == 'string' ||
                typeof path == 'number') &&
            obj &&
            typeof obj == 'object'
        )
    ) {
        return valueNotFound;
    }

    if (typeof path == 'number') {
        path = String(path);
    }

    if (typeof path == 'string') {
        path = path.split('.');
    }

    return path.reduce(
        (xs: any, x: string) =>
            xs && xs[x] != undefined ? xs[x] : valueNotFound,
        obj
    );
}

export const formatDateProfile = (date: string) => {
    // Parse the input date string into a Date object
    const inputDate = parse(date, 'dd-MM-yyyy', new Date());

    // Format the parsed date as "dd MMM, yyyy"
    const formattedDate = format(inputDate, 'dd MMM, yyyy');
    return formattedDate;
};

export const generateRandomDate = () => {
    // Generate a random number of days to add to the current date
    const randomDays = Math.floor(Math.random() * 2000);
    const currentDate = new Date();
    // Add the random number of days to the current date
    const randomDate = addDays(currentDate, randomDays);
    const formattedDate = format(randomDate, 'dd-MM-yyyy');
    return formattedDate;
};
