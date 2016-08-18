'use strict';

    module.exports = {getAllocations, saveAllocation, getOneAllocation, updateAllocation, delAllocation};

    //GET /allocation
    function getAllocations(req, res, next) {

        var queryString = 'SELECT * FROM allocations';
        var queryParams = [];

        if(req.query.user_id){
            queryParams.push(req.query.user_id);
            queryString = 
                queryString + 
                ((queryParams.length > 1) ? ' AND' : ' WHERE') +
                ' user_id=($'+queryParams.length+')';
        }
        if(req.query.asset_id){
            queryParams.push(req.query.asset_id);
            queryString = 
                queryString + 
                ((queryParams.length > 1) ? ' AND' : ' WHERE') +
                ' asset_id=($'+queryParams.length+')';
        }
        if(req.query.only_current){
            queryString = 
                queryString + 
                ((queryParams.length) ? ' AND' : ' WHERE') +
                ' untill >= now()';
        }

        pool.query(queryString, queryParams, function(err, result) {

            if (err) console.log(err);
            res.json({ allocations: result.rows});

        });

    }

    //POST /allocation
    function saveAllocation(req, res, next) {

        //TODO: check if asset is being used
        pool.query(
            "SELECT * FROM allocations WHERE ( asset_id=($1) AND untill >= now() )", 
            [req.body.asset_id], 
            function(err, result) {

                if(err){console.log(err);}

                if(result.rowCount){

                    res.json({
                        success: 0, 
                        description: "Asset already allocated for the time being", 
                        object: result.rows[0]
                    });

                } else {

                    pool.query(
                        "INSERT INTO allocations(user_id, asset_id, untill) values($1, $2, $3) returning *", 
                        [req.body.user_id, req.body.asset_id, req.body.untill], 
                        function(err, result) {
                        
                            if(err){
                                console.log(err);
                            }

                            res.json({
                                success: 1, 
                                description: "Allocation added to the list!", 
                                object: result.rows[0]
                            });
                        
                        });

                }

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

        // user_id, asset_id, untill
        pool.query(
            "UPDATE allocations SET user_id=($1), asset_id=($2), untill=($3) WHERE id=($4) returning *",
            [req.body.user_id, req.body.asset_id, req.body.untill, id],
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

                res.json({
                    success: 1, 
                    description: "Allocation deleted!", 
                    object: result.rows[0]
                });
            
            });

    }