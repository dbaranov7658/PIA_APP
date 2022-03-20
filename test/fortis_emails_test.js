const newman = require('newman')
newman.run({
  collection: require('./fortis_emails.postman_collection.json'),
  reporters: 'cli',
})