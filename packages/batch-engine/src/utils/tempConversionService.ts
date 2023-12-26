// require('dotenv').config()

import dbService from "shared/services/db.service";

var fs = require('fs');

class TempService {
  async getJsonResults() {
    const query = 'SELECT intermediate_entity_record FROM clever_chain.job_results';
    const results = await dbService.executeQuery(query);
    var file = fs.createWriteStream('tempArray.txt');
    // @ts-ignore
    file.on('error', function (err: any) {
      /* error handling */
    });
    results.rows.forEach(function (row: any) {
      file.write(row['intermediate_entity_record'] + ',' + '\n');
    });
    file.end();
  }
}

const tempService = new TempService();
tempService.getJsonResults();
// export default changeDetectionService;
