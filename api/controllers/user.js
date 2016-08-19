'use strict';

    module.exports = {getAllUsers, saveUser, getOneUser, updateUser, delUser};

    //GET /user
    function getAllUsers(req, res, next) {

        pool.query('SELECT * FROM users' , function(err, result) {

            if (err) console.log(err);
            res.json({ users: result.rows});

        });

    }

    //POST /user
    function saveUser(req, res, next) {

        pool.query(
            "INSERT INTO users(firstname, lastname, email) values($1, $2, $3) returning *", 
            [req.body.firstname, req.body.lastname, req.body.email], 
            function(err, result) {
            
                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "User added to the list!", 
                    object: result.rows[0]
                });
            
            });

    }

    //GET /user/{id}
    function getOneUser(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            'SELECT * FROM users WHERE id=($1)', 
            [id], 
            function(err, result) {

                if (err){
                    console.log(err);
                }

                if(result.rows[0]) {
                    res.json(result.rows[0]);
                } else {
                    res.status(204).send();
                }

            });

    }

    //PUT /user/{id} operationId
    function updateUser(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            "UPDATE users SET firstname=($1), lastname=($2), email=($3) WHERE id=($4) returning *",
            [req.body.firstname, req.body.lastname, req.body.email, id],
            function(err, result) {

                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "User updated!", 
                    object: result.rows[0]
                });
            
            });

    }

    //DELETE /user/{id} operationId
    function delUser(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            "DELETE FROM users WHERE id=($1) returning *",
            [id],
            function(err, result) {

                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "User deleted!", 
                    object: result.rows[0]
                });
            
            });

    }