const newman = require('newman')
newman.run({
  collection: require('./fortis_tests_dev.postman_collection.json'),
  reporters: 'cli',
})