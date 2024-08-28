const { KMSClient, GenerateDataKeyCommand, DecryptCommand, KeySpec } = require('@aws-sdk/client-kms');
require('dotenv').config();

const kmsClient= new KMSClient({ region: process.env.AWS_REGION});

async function generateDataKey() {
    console.log(process.env.KMS_KEY_ID);
    const params = {
        KeyId: process.env.KMS_KEY_ID,
        KeySpec: 'AES_256'
    };

    try {
        const command = new GenerateDataKeyCommand(params);
        const response = await kmsClient.send(command);
        const dataKey = response.Plaintext;
        const encryptedDataKey = response.CiphertextBlob;

        // Ensure the data key is 32 bytes long
        console.log(dataKey);


        return {
            dataKey: (Buffer.from(dataKey)).toString('base64'),
            encryptedDataKey: (Buffer.from(encryptedDataKey)).toString('base64')
        };
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
        return (Buffer.from(response.Plaintext)).toString('base64');
    } catch (error) {
        throw new Error('Error decrypting data key: ' + error.message);
    }

}

module.exports = { generateDataKey, decryptDataKey };