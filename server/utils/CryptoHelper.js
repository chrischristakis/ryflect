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

const genKey = crypto.randomBytes(16);
const derKey = Buffer.from('d42a6df1a01925c57551843511d879d90f7fa0103077e4ce160f6076040ec424', 'hex')
const enc = encrypt(genKey, derKey);
console.log('key = ', genKey);
console.log('enc = ', enc.ciphertext);
console.log('dec = ', decrypt(enc.ciphertext, derKey, enc.iv).toString('hex'))

module.exports = {
    encrypt,
    decrypt
};