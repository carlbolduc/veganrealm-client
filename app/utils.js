define(function () {

    Date.prototype.getMonthText = function () {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[this.getMonth()];
    };

    return {

        Date: Date,

        cleanElementByClassName: function (className) {
            var currentResults = document.getElementsByClassName(className);
            if (currentResults.length > 0) {
                var parent = currentResults[0].parentNode;
                while (currentResults[0]) {
                    parent.removeChild(currentResults[0]);
                }
                parent.innerHTML = "";
            }
        },

        displayNoResultsMessage: function (keyword) {
            var message = document.createElement('article');
            message.setAttribute('class', 'message');
            message.innerHTML = 'There are no results matching <strong>"' + keyword + '"</strong>, please edit your query.';
            document.getElementById('results').appendChild(message);
        },

        getParameter: function (paramName) {
            var searchString = location.search.substring(1),
                i, val, params = searchString.split("&");

            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] === paramName) {
                    return val[1];
                }
            }
            return null;
        },

        scrollToTop: function () {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }

    };

});
