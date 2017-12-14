define(['app/utils'], function (utils) {

    return {

        getRecipesCount: function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://veganrealm.net:8080/statistics/recipes-count');
            xhr.onload = function () {
                if (xhr.status === 200) {
                    callback && callback(JSON.parse(xhr.responseText))
                }
                else {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        },

        fetchResults: function (keyword, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://veganrealm.net:8080/recipes/' + keyword);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    callback && callback(JSON.parse(xhr.responseText));
                }
                else {
                    alert('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        }

    };

});

