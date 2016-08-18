'use strict';

    module.exports = {getAllAllocations, saveAllocation, getOneAllocation, updateAllocation, delAllocation};

    //GET /allocation
    function getAllAllocations(req, res, next) {

        pool.query('SELECT * FROM allocations' , function(err, result) {

            if (err) console.log(err);
            res.json({ allocations: result.rows});

        });

    }

    //POST /allocation
    function saveAllocation(req, res, next) {

        pool.query(
            "INSERT INTO allocations(user_id, asset_id, untill) values($1, $2, $3) returning *", 
            [req.body.user_id, req.body.asset_id, req.body.untill], 
            function(err, result) {
            
                if(err){
                    console.log(err);
                }

                console.log('-.-..-.-.-.-.-.-.');
                console.log(req.body);
                console.log(result);

                res.json({
                    success: 1, 
                    description: "Allocation added to the list!", 
                    object: result.rows[0]
                });
            
            });

    }

    //GET /allocation/{id}
    function getOneAllocation(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            'SELECT * FROM allocations WHERE id=($1)', 
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

    //PUT /allocation/{id} operationId
    function updateAllocation(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            "UPDATE allocations SET type=($1), attributes=($2), WHERE id=($3) returning *",
            [req.body.type, req.body.attributes, id],
            function(err, result) {

                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "Allocation updated!", 
                    object: result.rows[0]
                });
            
            });

    }

    //DELETE /allocation/{id} operationId
    function delAllocation(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            "DELETE FROM allocations WHERE id=($1) returning *",
            [id],
            function(err, result) {

                if(err){
                    console.log(err);
                }

                console.log(result);

                res.json({
                    success: 1, 
                    description: "Allocation deleted!", 
                    object: result.rows[0]
                });
            
            });

    }