function search() {
    var currentResults = document.getElementsByClassName('result');
    while (currentResults[0]) {
        currentResults[0].parentNode.removeChild(currentResults[0]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8080/recipes');
    xhr.onload = function() {
        if (xhr.status === 200) {
            var results = document.getElementById('results');
            var recipes = JSON.parse(xhr.responseText);
            for (var recipe_i = 0; recipe_i < recipes.length; recipe_i++) {
                var recipe = document.createElement('div');
                recipe.setAttribute('class', 'result');
                var title = document.createElement('h1');
                title.textContent = recipes[recipe_i].title;
                var image = document.createElement('img');
                image.src = recipes[recipe_i].imageLink;
                image.style.width = '400px';
                var ingredients = document.createElement('ul');
                for (var ingredient_i = 0; ingredient_i < recipes[recipe_i].ingredients.length; ingredient_i++) {
                    var ingredient = document.createElement('li');
                    ingredient.textContent = recipes[recipe_i].ingredients[ingredient_i];
                    ingredients.appendChild(ingredient);
                }
                recipe.appendChild(title);
                recipe.appendChild(image);
                recipe.appendChild(ingredients);
                document.getElementById('results').appendChild(recipe);
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}
