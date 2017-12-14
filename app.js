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

    window.addEventListener("popstate", function (e) {
        if (e.state !== null) {
            if (e.state.action === 'search') {
                document.getElementById('keyword').value = e.state.keyword;
                fetchResults(e.state.keyword, e.state.page)
            } else if (e.state.action === 'home') {
                actionHome();
            }
        }
    });

    if (location.search === "") {
        history.pushState({'action': 'home'}, '', '');
        service.getRecipesCount(function (serverData) {
            var recipesCountElement = document.getElementById('recipes-count');
            recipesCountElement.innerHTML = serverData;
        });
    } else {
        var keyword = decodeURIComponent(utils.getParameter('query'));
        var page = utils.getParameter('page') === null ? 1 : parseInt(utils.getParameter('page'));
        document.getElementById('keyword').value = keyword;
        history.pushState({
            'action': 'search',
            'keyword': keyword,
            'page': page
        }, '', '?query=' + encodeURI(keyword) + '&page=' + page);
        fetchResults(keyword, page)
    }

    document.getElementById('search-button').addEventListener('click', function (e) {
        e.preventDefault();
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
            e.preventDefault();
            var keyword = decodeURI(utils.getParameter('query'));
            var page = parseInt(e.target.textContent);
            history.pushState({
                'action': 'search',
                'keyword': keyword,
                'page': page
            }, '', '?query=' + encodeURI(keyword) + '&page=' + page);
            pager.goToPage(results, page);
        }
    });

    function actionHome() {
        document.getElementById('keyword').value = '';
        houseKeeping();
    }

    function actionSearch() {
        var keyword = document.getElementById('keyword').value;
        history.pushState({'action': 'search', 'keyword': keyword, 'page': 1}, '', '?query=' + encodeURI(keyword) + '&page=1');
        fetchResults(keyword, 1);
    }

    function fetchResults(keyword, page) {
        houseKeeping();
        service.fetchResults(keyword, function (serverData) {
            results = serverData;
            if (results.length === 0) {
                utils.displayNoResultsMessage(keyword);
            } else if (results.length < 11) {
                for (var i = 0; i < results.length; i++) {
                    steward.buildAndLoadResult(results[i]);
                }
            } else {
                pager.createPager(results);
                pager.goToPage(results, page);
            }
        });
    }

    function houseKeeping() {
        utils.cleanElementByClassName('result');
        utils.cleanElementByClassName('message');
        utils.cleanElementByClassName('page');
    }

});
