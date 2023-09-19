// import { format, isDate, parse } from 'date-fns';

import { format, isDate, parse } from 'date-fns';

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
        showTime ? 'dd MMM, yyyy hh:mm a' : 'dd MMM, yyyy'
    );
};

export const GetDateValue = (date: any, format?: string) => {
    if (!date || isDate(date)) return date;
    if (format) {
        return parse(date, format, new Date());
    }
    return new Date(date);
};

export const formatDateProfile = (date: string) => {
    // Parse the input date string into a Date object
    const inputDate = parse(date, 'dd-MM-yyyy', new Date());

    // Format the parsed date as "dd MMM, yyyy"
    const formattedDate = format(inputDate, 'dd MMM, yyyy');
    return formattedDate;
};
