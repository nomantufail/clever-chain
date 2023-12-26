import cassandra from "cassandra-driver";
import { getDbClient } from "shared/db/connector";
import commonService from "shared/services/common.service";

class DbService {
  constructor() {}

  async executeQuery(query: string, params: cassandra.ArrayOrObject = {}, options: cassandra.QueryOptions = {}) {
    const consistencySettings = { consistency: cassandra.types.consistencies.localQuorum, prepare: true };
    params = { ...params };
    options = { ...options, ...consistencySettings }
    return (await getDbClient()).execute(query, params, options);
  }

  async executeBatch(
    query: Array<string|{query: string, params?: cassandra.ArrayOrObject}>,
    options: cassandra.QueryOptions = {}
  ) {
    options = { ...options, prepare: true, logged: false, consistency: cassandra.types.consistencies.localQuorum };
    const arrayChunks = commonService.splitArrayIntoChunks(query, 20);
    for (let i = 0; i < arrayChunks.length; i++) {
      await (await getDbClient()).batch(arrayChunks[i], options)
    }
    return true
  }
}

const dbService = new DbService();
export default dbService;
