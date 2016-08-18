'use strict';

    module.exports = {getAllAssets, saveAsset, getOneAsset, updateAsset, delAsset};

    //GET /asset
    function getAllAssets(req, res, next) {

        pool.query('SELECT * FROM assets' , function(err, result) {

            if (err) {
                console.log(err);
            }

            res.json({ assets: result.rows});

        });

    }

    //POST /asset
    function saveAsset(req, res, next) {

        var attributes = filterAttributes(req.body.type, req.body.attributes);

        pool.query(
            "INSERT INTO assets(type, attributes) values($1, $2) returning *", 
            [req.body.type, attributes], 
            function(err, result) {
            
                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "Asset added to the list!", 
                    object: result.rows[0]
                });
            
            });

    }

    //GET /asset/{id}
    function getOneAsset(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            'SELECT * FROM assets WHERE id=($1)', 
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

    //PUT /asset/{id}
    function updateAsset(req, res, next) {

        var id = req.swagger.params.id.value;
        var attributes = filterAttributes(req.body.type, req.body.attributes);

        pool.query(
            "UPDATE assets SET type=($1), attributes=($2) WHERE id=($3) returning *",
            [req.body.type, attributes, id],
            function(err, result) {

                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "Asset updated!", 
                    object: result.rows[0]
                });
            
            });

    }

    //DELETE /asset/{id}
    function delAsset(req, res, next) {

        var id = req.swagger.params.id.value;

        pool.query(
            "DELETE FROM assets WHERE id=($1) returning *",
            [id],
            function(err, result) {

                if(err){
                    console.log(err);
                }

                res.json({
                    success: 1, 
                    description: "Asset deleted!", 
                    object: result.rows[0]
                });
            
            });

    }


    /*
        Private
     */
    
    //ensures that only the predefined attributes affect each specific type
    function filterAttributes(type, attributes){
        if(type === 'type1'){
            return {
                attr_1_a: attributes.attr_1_a,
                attr_1_b: attributes.attr_1_b,
            };
        }
        else if(type === 'type2'){
            return {
                attr_2_a: attributes.attr_2_a,
                attr_2_b: attributes.attr_2_b,
            };
        }
        else {
            return {};
        }
    };