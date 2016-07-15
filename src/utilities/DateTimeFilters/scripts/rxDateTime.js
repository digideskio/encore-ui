angular.module('encore.ui.utilities')

/**
 * @ngdoc filter
 * @name utilities.filter:rxDate
 * @description
 *
 * Converts dateString to standard DateTime format
 *
 **/
.filter('rxDateTime', function () {
    return function (dateString, param) {
        var date = moment(dateString);
        if (date.isValid()) {
            return param === 'short' ? date.format('YYYY-MM-DD @ HH:mmZ') : date.format('MMM D, YYYY @ h:mmA (UTCZ)');
        } else {
            return dateString;
        }
    };
});
