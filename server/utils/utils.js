module.exports = {

    // Return a nicely formatted date
    getDate: (date) => {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
    },

    // Returns a unique ID for a journal entry based on the current day (Only 1 entry per day)
    getDateID: (date, username) => {
        const month = date.getUTCMonth() + 1; // Returns month starting from 0, so increment to 1 for readability
        return `${username}-${month}${date.getUTCDate()}${date.getUTCFullYear()}`
    },

    // Leap years are so weird man. So many rules but basically, if the year is divisble by 400, its a leap year.
    // If not, then if its divisivble by 4 but not by 100, then its also a leap year.
    getDaysInYear: (year) => {
        const leapYear = (year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0));
        return leapYear? 366 : 365;
    },

    // Get our current day in our year out of 365/366, index starting at 0, so [0, 364/365]
    getCurrentDayInYear: (date) => {

        // Get the time in milliseconds between today's date, and the first day of the year, January 1st
        const msElapsed = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - 
                          Date.UTC(date.getUTCFullYear(), 0, 1);

        // Use that elapsed time in ms to find how many days have elapsed
        const msInADay = 1000 * 60 * 60 * 24;
        return Math.floor(msElapsed / msInADay); 
    }
};