define(['app/utils'], function (utils) {

    return {

        buildAndLoadRecipe: function(recipeData) {

            var recipe = document.createElement('article');
            recipe.setAttribute('class', 'result');

            var title = document.createElement('h2');

            var link = document.createElement('a');
            link.setAttribute('href', recipeData.link);
            link.innerHTML = recipeData.title;

            title.appendChild(link);

            var publishedAt = new utils.Date(recipeData.publishedAt);
            var publishedOn = publishedAt.getMonthText() + ' ' + publishedAt.getDate() + ', ' + publishedAt.getFullYear();

            var authorLink = document.createElement('a');
            var pathArray = recipeData.link.split('/');
            var protocol = pathArray[0];
            var host = pathArray[2];
            authorLink.setAttribute('href', protocol + '//' + host);
            authorLink.innerHTML = '<strong>' + recipeData.author + '</strong>';

            var author = document.createElement('h3');
            author.appendChild(document.createTextNode('Published by '));
            author.appendChild(authorLink);
            author.appendChild(document.createTextNode(' on ' + publishedOn));

            var imageContainer = document.createElement('div');
            imageContainer.setAttribute('class', 'image');
            var image = document.createElement('img');
            image.src = recipeData.imageLink;
            imageContainer.appendChild(image);

            var ingredientsContainer = document.createElement('div');
            ingredientsContainer.setAttribute('class', 'ingredients');
            var recipeIngredients = [];
            if (recipeData.ingredients.indexOf("|") !== -1) {
              recipeIngredients = recipeData.ingredients.split("|");
            }
            if (recipeIngredients.length > 0) {
                  var ingredients = document.createElement('ul');
                  for (var ingredient_i = 0; ingredient_i < recipeIngredients.length; ingredient_i++) {
                      var ingredient = document.createElement('li');
                      ingredient.innerHTML = recipeIngredients[ingredient_i];
                      ingredients.appendChild(ingredient);
                  }
                  ingredientsContainer.appendChild(ingredients);
            } else {
                ingredientsContainer.innerHTML = "See ingredients in the original recipe.";
            }

            recipe.appendChild(title);
            recipe.appendChild(author);
            recipe.appendChild(imageContainer);
            recipe.appendChild(ingredientsContainer);

            document.getElementById('results').appendChild(recipe);

        }

    };

});

