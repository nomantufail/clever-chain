import cassandra from "cassandra-driver";
import { readFileSync, promises as fsPromises } from 'fs';
import { join } from 'path';
import * as encryptionService from 'shared/services/encryption.service';

let connection: cassandra.Client | PromiseLike<cassandra.Client>;
export const getDbClient = async () => {
    if (connection) {
        return Promise.resolve(connection);
    } else {
        switch (process.env.ENVIRONMENT) {
            case 'PROD':
                {
                    const auth = new cassandra.auth.PlainTextAuthProvider(process.env.CASSANDRA_USERNAME!, process.env.CASSANDRA_PASSWORD!);
                    const sslOptions1 = {
                        ca: [readFileSync(process.env.CASSANDRA_CRT_PATH!, 'utf-8')],
                        host: process.env.CASSANDRA_HOST!,
                        rejectUnauthorized: true
                    };
                    connection = new cassandra.Client({
                        contactPoints: [process.env.CASSANDRA_HOST!],
                        localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER,
                        keyspace: process.env.CASSANDRA_KEYSPACE,
                        authProvider: auth,
                        sslOptions: sslOptions1,
                        protocolOptions: { port: +process.env.CASSANDRA_PORT! }
                    });
                }
                break;
            case 'DEV':
                {
                    const contents = await fsPromises.readFile(join(__dirname, '../encrypted_file.txt'));
                    const password = await encryptionService.decryptData(contents);
                    connection = new cassandra.Client({
                        contactPoints: [process.env.CASSANDRA_HOST!],
                        localDataCenter: 'datacenter1',
                        keyspace: process.env.CASSANDRA_KEYSPACE,
                        credentials: {
                            username: process.env.CASSANDRA_USERNAME!,
                            password: password
                        },
                        sslOptions: {
                            host: process.env.CASSANDRA_HOST,
                            port: +process.env.CASSANDRA_PORT!,
                            cert: readFileSync(process.env.CASSANDRA_CRT_PATH!, 'utf8'),
                            key: readFileSync(process.env.CASSANDRA_KEY_PATH!, 'utf8')
                        }
                    })
                }
                break;
            default:
                connection = new cassandra.Client({
                    contactPoints: [process.env.CASSANDRA_HOST!],
                    localDataCenter: 'datacenter1',
                    keyspace: process.env.CASSANDRA_KEYSPACE,
                    credentials: {
                        username: process.env.CASSANDRA_USERNAME!,
                        password: 'cassandra'
                    },
                    sslOptions: {
                        host: process.env.CASSANDRA_HOST,
                        port: +process.env.CASSANDRA_PORT!,
                        cert: readFileSync(process.env.CASSANDRA_CRT_PATH!, 'utf8'),
                        key: readFileSync(process.env.CASSANDRA_KEY_PATH!, 'utf8')
                    }
                })
        }
        return Promise.resolve(connection);
    }
}
