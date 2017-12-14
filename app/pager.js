define(['app/steward', 'app/utils'], function (steward, utils) {

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
                pageElement.setAttribute('id', 'page_' + (i + 1));
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
            var arrayPage = page - 1;
            utils.cleanElementByClassName('result');
            var firstResult = arrayPage * 10;
            for (var i = firstResult; i < results.length; i++) {
                if ((arrayPage * 10) + 10 <= results.length) {
                    if (i === firstResult + 10) {
                        break;
                    }
                }
                steward.buildAndLoadResult(results[i]);
            }

            if (results.length > 10) {
                var previousPage = document.getElementsByClassName('page active');
                if (previousPage.length > 0) {
                    previousPage[0].classList.remove('active');
                    document.getElementById('page_' + page).setAttribute('class', 'page active');
                }
            }

            utils.scrollToTop();

        }

    };

});

