export const getDaysInYear = (year) => {
    // Leap years are so weird man. So many rules but basically, if the year is divisble by 400, its a leap year.
    // If not, then if its divisivble by 4 but not by 100, then its also a leap year.
    const leapYear = (year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0));
    return leapYear? 366 : 365;
};

// Return a nicely formatted date
export const getDate = (date) => {
    // Suffixes 'st', 'nd', etc to end of date. 
    const nth = function(d) {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
        }
    }
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}${nth(date.getUTCDate())} ${date.getUTCFullYear()}`;
};

// Get our current day in our year out of 365/366, index starting at 0, so [0, 364/365]
export const getCurrentDayInYear = (date) => {

    // Get the time in milliseconds between today's date, and the first day of the year, January 1st
    const msElapsed = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - 
                      Date.UTC(date.getUTCFullYear(), 0, 1);

    // Use that elapsed time in ms to find how many days have elapsed
    const msInADay = 1000 * 60 * 60 * 24;
    return Math.floor(msElapsed / msInADay); 
};

// Check if an object is empty
export const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};