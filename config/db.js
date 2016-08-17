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

pool
  .query('CREATE TABLE IF NOT EXISTS allocations (id SERIAL PRIMARY KEY, user_id INTEGER, asset_id INTEGER, untill TIMESTAMP)');


module.exports = function() {
    return {
        movieList : [],
        /*
         * Save the movie inside the "db".
         */
        save(movie) {
            movie.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
            this.movieList.push(movie);
            return 1;           
        },
        /*
         * Retrieve a movie with a given id or return all the movies if the id is undefined.
         */
        find(id) {
            if(id) {
                return this.movieList.find(element => {
                        return element.id === id;
                    }); 
            }else {
                return this.movieList;
            }
        },
        /*
         * Delete a movie with the given id.
         */
        remove(id) {
            var found = 0;
            this.movieList = this.movieList.filter(element => {
                    if(element.id === id) {
                        found = 1;
                    }else {
                        return element.id !== id;
                    }
                });
            return found;           
        },
        /*
         * Update a movie with the given id
         */
        update(id, movie) {
            var movieIndex = this.movieList.findIndex(element => {
                return element.id === id;
            });
            if(movieIndex !== -1) {
                this.movieList[movieIndex].title = movie.title;
                this.movieList[movieIndex].year = movie.year;
                return 1;
            }else {
                return 0;
            }
        }       
    }
};  