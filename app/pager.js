define(['app/recipes', 'app/utils'], function (recipes, utils) {

    return {

        createPager: function (results) {
            var pages = Math.ceil(results.length / 10);
            for (var i = 0; i < pages; i++) {
                var pageElement = document.createElement('a');
                if (i === 0) {
                    pageElement.setAttribute('class', 'page active');
                } else {
                    pageElement.setAttribute('class', 'page');
                }
                pageElement.setAttribute('href', '#');
                pageElement.innerHTML = i + 1;
                document.getElementById('pager').appendChild(pageElement);
                if (i !== pages - 1) {
                    var pager = document.getElementById('pager');
                    pager.innerHTML = pager.innerHTML + ' &middot; ';
                }
            }
        },

        goToPage: function (results, page) {
            utils.cleanElementByClassName('result');
            var firstResult = page * 10;
            for (var i = firstResult; i < results.length; i++) {
                if ((page * 10) + 10 <= results.length) {
                    if (i === firstResult + 10) {
                        break;
                    }
                }
                // TODO add results module that test the result type and load the appropriate template
                recipes.buildRecipeResult(results[i]);
            }
        }

    };

});

