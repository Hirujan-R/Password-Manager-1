const { KMSClient, GenerateDataKeyCommand, DecryptCommand, KeySpec } = require('@aws-sdk/client-kms');
require('dotenv').config();

// Create AWS KMS Client
const kmsClient= new KMSClient({ region: process.env.AWS_REGION});

async function generateDataKey() {
    const params = {
        KeyId: process.env.KMS_KEY_ID,
        KeySpec: 'AES_256'
    };

    try {
        // Send Generate data key command to AWS client
        const command = new GenerateDataKeyCommand(params);
        const response = await kmsClient.send(command);
        /* Retrieve generated data key in encrypted and decrypted form. 
        The encrypted data key is stored in the db while the decrypted data key is used in the AES-256 encryption */
        const dataKey = response.Plaintext;
        const encryptedDataKey = response.CiphertextBlob;
        return {
            dataKey: (Buffer.from(dataKey)).toString('base64'),
            encryptedDataKey: (Buffer.from(encryptedDataKey)).toString('base64')
        };
    } catch (error) {
        // Throw error that may occur with AWS KMS client
        throw new Error('Error generating data key: ' + error.message);
    }
}

async function decryptDataKey(encryptedDataKey) {
    const params = {
        CiphertextBlob: Buffer.from(encryptedDataKey, 'base64')
    };

    try {
        // Send decrypt data key command to aws client
        const command = new DecryptCommand(params);
        const response = await kmsClient.send(command);

        return (Buffer.from(response.Plaintext)).toString('base64');
    } catch (error) {
        // Throw error that may occur with AWS KMS client
        throw new Error('Error decrypting data key: ' + error.message);
    }

}

module.exports = { generateDataKey, decryptDataKey };