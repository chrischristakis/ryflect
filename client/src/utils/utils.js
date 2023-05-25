export const getDaysInYear = (year) => {
    // Leap years are so weird man. So many rules but basically, if the year is divisble by 400, its a leap year.
    // If not, then if its divisivble by 4 but not by 100, then its also a leap year.
    const leapYear = (year % 400 === 0) || ((year % 100 !== 0) && (year % 4 === 0));
    return leapYear? 366 : 365;
};