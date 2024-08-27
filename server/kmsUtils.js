const { KMSClient, GenerateDataKeyCommand, DecryptCommand, KeySpec } = require('@aws-sdk/client-kms');
require('dotenv').config();

const kmsClient= new KMSClient({ region: process.env.AWS_REGION});

async function generateDataKey() {
    const params = {
        keyID: process.env.KMS_KEY_ID,
        KeySpec: 'AES_256'
    };

    try {
        const command = new GenerateDataKeyCommand(params);
        const response = await kmsClient.send(command);
        return {
            dataKey: response.Plaintext.toString('base64'),
            encryptedDataKey: response.CiphertextBlob.toString('base64')
        }
    } catch (error) {
        throw new Error('Error generating data key: ' + error.message);
    }
}

async function decryptDataKey(encryptedDataKey) {
    const params = {
        CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')
    };

    try {
        const command = new DecryptCommand(params);
        const response = await kmsClient.send(command);
        return response.Plaintext.toString('base64');
    } catch (error) {
        throw new Error('Error decrypting data key: ' + error.message);
    }

}

module.exports = { generateDataKey, decryptDataKey };