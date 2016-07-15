angular.module('encore.ui.utilities')

/**
 * @ngdoc filter
 * @name utilities.filter:rxDate
 * @description
 *
 * Converts dateString to standard Time format
 *
 **/
.filter('rxTime', function () {
    return function (dateString, param) {
        var date = moment(dateString);
        if (date.isValid()) {
            return param === 'short' ? date.format('HH:mmZ') : date.format('h:mmA (UTCZ)');
        } else {
            return dateString;
        }
    };
});
