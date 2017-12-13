define(function () {

    return {

        loadRecipe: function (recipe) {
            var recipeElement = document.createElement('article');
            recipeElement.setAttribute('class', 'result');
            var title = document.createElement('h2');
            var link = document.createElement('a');
            link.setAttribute('href', recipe.link);
            link.innerHTML = recipe.title;
            title.appendChild(link);

            var publishedAt = new Date(recipe.publishedAt);
            var publishedOn = publishedAt.getMonthText() + ' ' + publishedAt.getDate() + ', ' + publishedAt.getFullYear();
            var author = document.createElement('h3');
            author.innerHTML = 'Published by <strong>' + recipe.author + '</strong> on ' + publishedOn;

            var imageContainer = document.createElement('div');
            imageContainer.setAttribute('class', 'image');
            var image = document.createElement('img');
            image.src = recipe.imageLink;
            imageContainer.appendChild(image);
            var ingredientsContainer = document.createElement('div');
            ingredientsContainer.setAttribute('class', 'ingredients');
            if (recipe.ingredients.length > 0) {
                if (recipe.ingredients.length === 1 && recipe.ingredients[0] === "") {
                    ingredientsContainer.innerHTML = "See ingredients in the original recipe.";
                } else {
                    var ingredients = document.createElement('ul');
                    for (var ingredient_i = 0; ingredient_i < recipe.ingredients.length; ingredient_i++) {
                        var ingredient = document.createElement('li');
                        ingredient.innerHTML = recipe.ingredients[ingredient_i];
                        ingredients.appendChild(ingredient);
                    }
                    ingredientsContainer.appendChild(ingredients);
                }
            } else {
                ingredientsContainer.innerHTML = "See ingredients in the original recipe.";
            }
            recipeElement.appendChild(title);
            recipeElement.appendChild(author);
            recipeElement.appendChild(imageContainer);
            recipeElement.appendChild(ingredientsContainer);
            document.getElementById('results').appendChild(recipeElement);
        },

        cleanElementByClassName: function (className) {
            var currentResults = document.getElementsByClassName(className);
            while (currentResults[0]) {
                currentResults[0].parentNode.removeChild(currentResults[0]);
            }
        }

    };

});
