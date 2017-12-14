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
requirejs(['app/pager', 'app/service', 'app/steward', 'app/utils'], function (pager, service, steward, utils) {
    var results = {};

    if (location.search === "") {
        history.pushState({'action': 'home'}, '', '');
        service.getRecipesCount(function (serverData) {
            var recipesCountElement = document.getElementById('recipes-count');
            recipesCountElement.innerHTML = serverData;
        });
    } else {
        var keyword = location.search.substring(1).split('=')[1];
        document.getElementById('keyword').value = decodeURIComponent(keyword);
        history.pushState({'action': 'search', 'keyword': keyword}, '', '?query=' + keyword);
        fetchResults(keyword);
    }

    window.addEventListener("popstate", function (e) {
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

    document.getElementById('pager').addEventListener('click', function (e) {
        if (e.target.className === 'page') {
            var previousPage = document.getElementsByClassName('page active');
            if (previousPage.length > 0) {
                previousPage[0].classList.remove('active');
            }
            e.target.className = e.target.className + ' active';
            pager.goToPage(results, parseInt(e.target.textContent) - 1);
        }
    });

    function actionHome() {
        document.getElementById('keyword').value = '';
        houseKeeping();
    }

    function actionSearch() {
        var keyword = document.getElementById('keyword').value;
        history.pushState({'action': 'search', 'keyword': keyword}, '', '?query=' + keyword);
        fetchResults(keyword);
    }

    function fetchResults(keyword) {
        houseKeeping();
        service.fetchResults(keyword, function (serverData) {
            results = serverData;
            if (results.length === 0) {
                utils.displayNoResultsMessage(keyword);
            } else {
                for (var i = 0; i < results.length; i++) {
                    if (results.length > 10) {
                        if (i === 10) {
                            pager.createPager(results);
                            break;
                        }
                    }
                    steward.buildAndLoadResult(results[i]);
                }
            }
        });
    }

    function houseKeeping() {
        utils.cleanElementByClassName('result');
        utils.cleanElementByClassName('message');
        utils.cleanElementByClassName('page');
    }

});
