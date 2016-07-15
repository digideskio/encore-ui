angular.module('encore.ui.utilities')

/**
 * @ngdoc filter
 * @name utilities.filter:rxDate
 * @description
 *
 * Converts dateString to standard Month format
 *
 **/
.filter('rxMonth', function () {
    return function (dateString, param) {
        var date = moment(dateString);
        if (date.isValid()) {
            if (param === 'short') {
                return date.format('MM / YYYY');
            } else if (param === 'micro') {
                return date.format('MM / YY');
            } else {
                return date.format('MMMM YYYY');
            }
        } else {
            return dateString;
        }
    };
});
