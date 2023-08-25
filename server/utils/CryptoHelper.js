const crypto = require('crypto');

function encrypt(data, key) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    // Encrypt data using cipher and append remaining contents using final()
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return { ciphertext: encrypted.toString('base64'), iv: iv.toString('hex') };
}

function decrypt(data, key, iv) {
    let textBuffer = Buffer.from(data, 'base64');
    let ivBuffer = Buffer.from(iv, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), ivBuffer);

    let decrypted = decipher.update(textBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
}

module.exports = {
    encrypt,
    decrypt
};