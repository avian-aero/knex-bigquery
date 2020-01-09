# BigQuery Dialect for Knex.js

BigQuery dialect for building and executing queries using Knex.js.

**This library is in early stages of development. Use at your own risk.**

## Installation

```bash
# Yarn:
yarn add @avian-aero/knex-bigquery
# NPM:
npm install @avian-aero/knex-bigquery
```

## Usage

```js
const { BigQueryClient } = require('@avian-aero/knex-bigquery');
const knex = require('knex')({
  client: BigQueryClient,
  connection: {
    projectId: 'bigquery-playground',
    keyFilename: '/Users/dumbledore/playground-credentials.json'
  },
  pool: { min: 0, max: 5 }
});

async function getCommonNames() {
  const commonNames = await knex('bigquery-public-data.usa_names.usa_1910_2013')
    .select('name', 'gender')
    .sum('number as total')
    .groupBy('name', 'gender')
    .orderBy('total', 'desc')
    .limit(3);

  console.log(commonNames);
  await knex.destroy();
}
getCommonNames();
// [
//   { name: 'James', gender: 'M', total: 4924235 },
//   { name: 'John', gender: 'M', total: 4818746 },
//   { name: 'Robert', gender: 'M', total: 4703680 },
// ]
```

## Connection

Connection settings are passed to the BigQuery client library [constructor](https://googleapis.dev/nodejs/bigquery/latest/global.html#BigQueryOptions).  
Make sure you pass a valid properties combination.
