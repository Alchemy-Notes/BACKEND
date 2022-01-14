const pool = require('./lib/utils/pool');
const setup = require('./data/setup');
const seedDB = require('./lib/utils/seedDB');

setup(pool)
  .then(() => seedDB())
  .catch((err) => console.error(err))
  .finally(() => process.exit());
