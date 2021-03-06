# BigQuery Dialect for Knex.js

BigQuery dialect for building and executing queries using Knex.js.

**This project is no longer maintained**

This project was a quick POC to check whether or not it will be possible to migrate existing knex-postgres codebase to knex-bigquery without too much trouble.  
Although it was a success, we decided to go with a different approach.

## Installation

```bash
# Yarn:
yarn add knex-bigquery
# NPM:
npm install knex-bigquery
```

## Usage

```js
const { BigQueryClient } = require('knex-bigquery');
const knex = require('knex')({
  client: BigQueryClient,
  connection: {
    projectId: 'bigquery-playground',
    keyFilename: '/Users/dumbledore/playground-credentials.json'
  },
  pool: { min: 0, max: 5 }
});

(async () => {
  const commonNames = await knex('bigquery-public-data.usa_names.usa_1910_2013')
    .select('name', 'gender')
    .sum('number as total')
    .groupBy('name', 'gender')
    .orderBy('total', 'desc')
    .limit(3);

  console.log(commonNames);
  await knex.destroy();
})();
// [
//   { name: 'James', gender: 'M', total: 4924235 },
//   { name: 'John', gender: 'M', total: 4818746 },
//   { name: 'Robert', gender: 'M', total: 4703680 },
// ]
```

## Connection

Connection settings are passed to the BigQuery client library [constructor](https://googleapis.dev/nodejs/bigquery/latest/global.html#BigQueryOptions).  
Make sure you pass a valid properties combination.
