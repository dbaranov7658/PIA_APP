const newman = require('newman')
newman.run({
  collection: require('./fortis_emails_dev.postman_collection.json'),
  reporters: 'cli',
})