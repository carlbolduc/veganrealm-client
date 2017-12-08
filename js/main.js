var recipes = {};

function actionHome() {
    document.getElementById('keyword').value = '';
    cleanElementByClassName('result');
    cleanElementByClassName('message');
    cleanPager();
}

function actionSearch() {
    var keyword = document.getElementById('keyword').value;
    history.pushState({'action': 'search', 'keyword': keyword}, '', '');
    fetchResults(keyword);
}

function fetchResults(keyword) {
    cleanElementByClassName('result');
    cleanElementByClassName('message');
    cleanPager();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://veganrealm.net:8080/recipes/' + keyword);
    xhr.onload = function () {
        if (xhr.status === 200) {
            recipes = JSON.parse(xhr.responseText);
            if (recipes.length === 0) {
                displayNoResultsMessage(keyword);
            } else if (recipes.length > 10) {
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
        actionSearch();
    }
}

function displayNoResultsMessage(keyword) {
    var message = document.createElement('article');
    message.setAttribute('class', 'message');
    message.innerHTML = 'There are no results matching <strong>"' + keyword + '"</strong>, please edit your query.';
    document.getElementById('results').appendChild(message);
}

function loadRecipe(recipe) {
    var recipeElement = document.createElement('article');
    recipeElement.setAttribute('class', 'result');
    var title = document.createElement('h2');
    var link = document.createElement('a');
    link.setAttribute('href', recipe.link);
    link.innerHTML = recipe.title;
    title.appendChild(link);

    var publishedAt = new Date(recipe.publishedAt);
    var publishedOn = 'Published on ' + publishedAt.getMonthText() + " " + publishedAt.getDate() + " " + publishedAt.getFullYear();
    var author = document.createElement('h3');
    author.innerHTML = publishedOn + " by <strong>" + recipe.author + "</strong>";

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
        pageElement.setAttribute('onclick', 'goToPage(' + page_i + ')');
        pageElement.innerHTML = page_i + 1;
        document.getElementById('pager').appendChild(pageElement);
        if (page_i !== pages - 1) {
            const pager = document.getElementById('pager');
            pager.innerHTML = pager.innerHTML + ' / ';
        }
    }
}

function goToPage(page) {
    cleanElementByClassName('result');
    // enable previously active page in pager
    // disable active page in pager
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

function cleanElementByClassName(className) {
    var currentResults = document.getElementsByClassName(className);
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

Date.prototype.getMonthText = function() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.getMonth()];
};

window.onload = function() {
    history.pushState({'action': 'home'}, '', '');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://veganrealm.net:8080/statistics/recipes-count');
    xhr.onload = function () {
        if (xhr.status === 200) {
            var recipesCountElement = document.getElementById('recipes-count');
            recipesCountElement.innerHTML = JSON.parse(xhr.responseText);
        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
};

window.addEventListener("popstate", function(e) {

    if (e.state !== null) {
        if (e.state.action === 'search') {
            document.getElementById('keyword').value = e.state.keyword;
            fetchResults(e.state.keyword)
        } else if (e.state.action === 'home') {
            actionHome();
        }
    }


});
