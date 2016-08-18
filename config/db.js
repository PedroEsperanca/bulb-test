'use strict;'
//Include crypto to generate the movie id
var crypto = require('crypto');
var Pool = require('pg').Pool;
var dbConfig = {
  host: 'elmer-01.db.elephantsql.com',
  user: 'veocdxpd',
  password: 'MbrskFom-keSYcihWibqxbguhJpn79bW',
  database: 'veocdxpd',
};

process.on('unhandledRejection', function(e) {
  console.log(e.message, e.stack)
})

// create the pool somewhere globally so its lifetime
// lasts for as long as your app is running
global.pool = new Pool(dbConfig);

pool
  .query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, firstName VARCHAR(40), lastName VARCHAR(40), email VARCHAR(40))');

pool
  .query('CREATE TABLE IF NOT EXISTS assets (id SERIAL PRIMARY KEY, type VARCHAR(40), attributes jsonb)');

// pool
//   .query('DROP TABLE IF EXISTS allocations');

pool
  .query('CREATE TABLE IF NOT EXISTS allocations (id SERIAL PRIMARY KEY, user_id INTEGER, asset_id INTEGER, untill TIMESTAMP)');


module.exports = function() {
    return true;
};  