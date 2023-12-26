import {
  KmsKeyringNode,
  buildClient,
  CommitmentPolicy,
} from '@aws-crypto/client-node'
/* This builds the client with the REQUIRE_ENCRYPT_REQUIRE_DECRYPT commitment policy,
 * which enforces that this client only encrypts using committing algorithm suites
 * and enforces that this client
 * will only decrypt encrypted messages
 * that were created with a committing algorithm suite.
 * This is the default commitment policy
 * if you build the client with `buildClient()`.
 */
const { encrypt, decrypt } = buildClient(
  CommitmentPolicy.REQUIRE_ENCRYPT_REQUIRE_DECRYPT
)

export async function encryptData(data: string) {
  const generatorKeyId = 'arn:aws:kms:eu-west-2:015668616993:alias/demo-key'

  const keyIds = ['arn:aws:kms:eu-west-2:015668616993:key/eb10e76e-e99f-4b17-bb82-f17ac18de794']

  /* The KMS keyring must be configured with the desired CMKs */
  const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })

  const context = {
    stage: 'demo-key',
    purpose: 'simple demonstration app',
    origin: 'eu-west-2',
  }

  /* Find data to encrypt.  A simple string. */
  const cleartext = data


  console.log("data cleartext: ");
  console.log(cleartext);

  /* Encrypt the data. */
  const { result } = await encrypt(keyring, cleartext, {
    encryptionContext: context,
  })
  return result;
}

export async function decryptData(encryptedText: any) {

  const generatorKeyId = 'arn:aws:kms:eu-west-2:015668616993:alias/demo-key'

  const keyIds = ['arn:aws:kms:eu-west-2:015668616993:key/eb10e76e-e99f-4b17-bb82-f17ac18de794']

  /* The KMS keyring must be configured with the desired CMKs */
  const keyring = new KmsKeyringNode({ generatorKeyId, keyIds })

  const context = {
    stage: 'demo-key',
    purpose: 'simple demonstration app',
    origin: 'eu-west-2',
  }

  /* Decrypt the data. */
  const { plaintext, messageHeader } = await decrypt(keyring, encryptedText)

  /* Grab the encryption context so you can verify it. */
  const { encryptionContext } = messageHeader

  Object.entries(context).forEach(([key, value]) => {
    if (encryptionContext[key] !== value)
      throw new Error('Encryption Context does not match expected values')
  })

  return plaintext.toString('utf8');
}
