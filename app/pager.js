define(['app/utils'], function (utils) {

    return {

        createPager: function (recipes) {
            var pages = Math.ceil(recipes.length / 10);
            for (var page_i = 0; page_i < pages; page_i++) {
                var pageElement = document.createElement('a');
                if (page_i === 0) {
                    pageElement.setAttribute('class', 'page active');
                } else {
                    pageElement.setAttribute('class', 'page');
                }
                pageElement.setAttribute('href', '#');
                pageElement.innerHTML = page_i + 1;
                document.getElementById('pager').appendChild(pageElement);
                if (page_i !== pages - 1) {
                    const pager = document.getElementById('pager');
                    pager.innerHTML = pager.innerHTML + ' / ';
                }
            }
        },

        goToPage: function (recipes, page) {
            utils.cleanElementByClassName('result');
            var firstResult = page * 10;
            for (var recipe_i = firstResult; recipe_i < recipes.length; recipe_i++) {
                if ((page * 10) + 10 <= recipes.length) {
                    if (recipe_i === firstResult + 10) {
                        break;
                    }
                }
                utils.loadRecipe(recipes[recipe_i]);
            }
        },

        cleanPager: function () {
            var currentPages = document.getElementsByClassName('page');
            while (currentPages[0]) {
                currentPages[0].parentNode.removeChild(currentPages[0]);
            }
            var pager = document.getElementById('pager');
            pager.innerHTML = '';
        }

    };

});

