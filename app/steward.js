define(['app/recipes'], function (recipes) {

    return {

        buildAndLoadResult: function (resultData) {
            // eventually, test result type and use the proper result builder
            recipes.buildAndLoadRecipe(resultData);
        }

    };

});
