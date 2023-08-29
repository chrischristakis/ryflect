module.exports = {
    emojis: '💼🎓🌎🌕🐳🐙🎻🎸🎬🎮🎯🎒🚠⚓⌛💻📬🎁🔭📓📗📘📙📚📕📄🌅🌠🚄',
    MAX_BYTES: 500000, // Max bytes for one journal entry
    TOKEN_LIFESPAN: 604800, // in seconds, a week
    DERIVED_KEY_ITERS: 100000 // How many iterations to run PBKDF2 through when getting our derived key
}