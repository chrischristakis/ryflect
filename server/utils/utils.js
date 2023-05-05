module.exports = {

    // Return a nicely formatted date
    getDate: (date) => {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
    },

    // Returns a unique ID for a journal entry based on the current day (Only 1 entry per day)
    getDateID: (date, username) => {
        const month = date.getUTCMonth() + 1; // Returns month starting from 0, so increment to 1 for readability
        return `${username}-${date.getUTCMonth()+1}${date.getUTCDate()}${date.getUTCFullYear()}`
    }
};