// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/utils', 'app/pager'], function(utils, pager) {
    var recipes = {};

    if (location.search === "") {
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
    } else {
        var keyword = location.search.substring(1).split('=')[1];
        document.getElementById('keyword').value = keyword;
        history.pushState({'action': 'search', 'keyword': keyword}, '', '?query=' + keyword);
        fetchResults(keyword);
    }

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

    document.getElementById('search-button').addEventListener('click', function () {
        actionSearch();
    });

    document.getElementById('keyword').addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            actionSearch();
        }
    });

    document.getElementById('pager').addEventListener('click', function(e) {
        if (e.target.className === 'page') {
            var previousPage = document.getElementsByClassName('page active');
            if (previousPage.length > 0) {
                previousPage[0].classList.remove('active');
            }
            e.target.className = e.target.className + ' active';
            pager.goToPage(recipes, parseInt(e.target.textContent) - 1);
        }
    });

    function actionHome() {
        document.getElementById('keyword').value = '';
        utils.cleanElementByClassName('result');
        utils.cleanElementByClassName('message');
        pager.cleanPager();
    }

    function actionSearch() {
        var keyword = document.getElementById('keyword').value;
        history.pushState({'action': 'search', 'keyword': keyword}, '', '?query=' + keyword);
        fetchResults(keyword);
    }

    function fetchResults(keyword) {
        utils.cleanElementByClassName('result');
        utils.cleanElementByClassName('message');
        pager.cleanPager();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://veganrealm.net:8080/recipes/' + keyword);
        xhr.onload = function () {
            if (xhr.status === 200) {
                recipes = JSON.parse(xhr.responseText);
                if (recipes.length === 0) {
                    displayNoResultsMessage(keyword);
                } else {
                    for (var recipe_i = 0; recipe_i < recipes.length; recipe_i++) {
                        if (recipes.length > 10) {
                            if (recipe_i === 10) {
                                pager.createPager(recipes);
                                break;
                            }
                        }
                        utils.loadRecipe(recipes[recipe_i]);
                    }
                }
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    function displayNoResultsMessage(keyword) {
        var message = document.createElement('article');
        message.setAttribute('class', 'message');
        message.innerHTML = 'There are no results matching <strong>"' + keyword + '"</strong>, please edit your query.';
        document.getElementById('results').appendChild(message);
    }

    Date.prototype.getMonthText = function() {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[this.getMonth()];
    };

});
