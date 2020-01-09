const Client = require('knex/lib/client');

class BigQueryClient extends Client {
  constructor(config) {
    super(config);
  }

  get dialect() {
    return 'bigquery';
  }

  get driverName() {
    return 'bigquery';
  }

  get canCancelQuery() {
    return true;
  }

  _driver() {
    const { BigQuery } = require('@google-cloud/bigquery');
    return new BigQuery(this.connectionSettings);
  }

  acquireRawConnection() {
    return Promise.resolve({
      driver: this.driver,
      job: null
    });
  }

  validateConnection() {
    return Promise.resolve(true);
  }

  destroyRawConnection(connection) {
    return this.cancelJob(connection);
  }

  wrapIdentifier(value) {
    return value !== '*' ? `\`${value}\`` : '*';
  }

  cancelJob(connection) {
    if (connection.job === null) {
      return Promise.resolve();
    }
    const cancelJobRequest = connection.job.cancel();
    connection.job = null;
    return cancelJobRequest;
  }

  async _query(connection, obj) {
    const queryConfig = {
      ...obj.options,
      query: obj.sql,
      params: obj.bindings
    };

    try {
      [connection.job] = await connection.driver.createQueryJob(queryConfig);
      [obj.response] = await connection.job.getQueryResults({ autoPaginate: false });
      connection.job = null;
      return obj;
    } catch (err) {
      await this.cancelJob(connection);
      throw new Error(err);
    }
  }

  processResponse(obj) {
    return obj.response;
  }
}

module.exports = { BigQueryClient };
