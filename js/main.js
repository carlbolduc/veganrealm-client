var recipes = {}

function fetchResults() {
    cleanResults();
    cleanPager();
    var keyword = document.getElementById('keyword').value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://veganrealm.net:8080/recipes/' + keyword);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var results = document.getElementById('results');
            recipes = JSON.parse(xhr.responseText);
            if (recipes.length > 10) {
                createPager();
                for (var recipe_i = 0; recipe_i < 10; recipe_i++) {
                    loadRecipe(recipes[recipe_i]);
                }
            } else {
                for (var recipe_i = 0; recipe_i < recipes.length; recipe_i++) {
                    loadRecipe(recipes[recipe_i]);
                }
            }
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function handle(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        fetchResults();
    }
}

function loadRecipe(recipe) {
    var recipeElement = document.createElement('article');
    recipeElement.setAttribute('class', 'result');
    var title = document.createElement('h2');
    var link = document.createElement('a');
    link.setAttribute('href', recipe.link);
    link.innerHTML = recipe.title;
    title.appendChild(link);
    var author = document.createElement('h3');
    author.innerHTML = recipe.author;
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
}

function createPager() {
    var pages = Math.ceil(recipes.length / 10);
    for (var page_i = 0; page_i < pages; page_i++) {
        var pageElement = document.createElement('a');
        pageElement.setAttribute('class', 'page');
        pageElement.setAttribute('href', '#');
        pageElement.setAttribute('onclick', `goToPage(${page_i})`);
        pageElement.innerHTML = page_i + 1;
        document.getElementById('pager').appendChild(pageElement);
        if (page_i !== pages - 1) {
            var pager = document.getElementById('pager');
            pager.innerHTML = pager.innerHTML + ' / ';
        }
    }
}

function goToPage(page) {
    cleanResults();
    var firstResult = page * 10;
    if ((page * 10) + 10 > recipes.length) {
        for (var recipe_i = firstResult; recipe_i < recipes.length; recipe_i++) {
            loadRecipe(recipes[recipe_i]);
        }
    } else {
        for (var recipe_i = firstResult; recipe_i < firstResult + 10; recipe_i++) {
            loadRecipe(recipes[recipe_i]);
        }
    }
}

function cleanResults() {
    var currentResults = document.getElementsByClassName('result');
    while (currentResults[0]) {
        currentResults[0].parentNode.removeChild(currentResults[0]);
    }
}

function cleanPager() {
    var currentPages = document.getElementsByClassName('page');
    while (currentPages[0]) {
        currentPages[0].parentNode.removeChild(currentPages[0]);
    }
    var pager = document.getElementById('pager');
    pager.innerHTML = '';
}

window.onload = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://veganrealm.net:8080/statistics/recipes-count');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var recipesCountElement = document.getElementById('recipes-count');
            var recipesCount = JSON.parse(xhr.responseText);
            recipesCountElement.innerHTML = recipesCount;
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
};
