angular.module('encore.ui.utilities')

/**
 * @ngdoc filter
 * @name utilities.filter:rxDate
 * @description
 *
 * Converts dateString to standard Date format
 *
 **/
.filter('rxDate', function () {
    return function (dateString, param) {
        var date = moment(dateString);
        if (date.isValid()) {
            return param === 'short' ? date.format('YYYY-MM-DD') : date.format('MMMM D, YYYY');
        } else {
            return dateString;
        }
    };
});
