module.exports = {
    getDate: () => {
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const date = new Date(); // current date in UTC
        return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
    }
};