describe('rxTime', function () {
    var convertToRegularDate;
    var dateString;
    var param;
    beforeEach(function () {
        module('encore.ui.utilities');

        inject(function ($filter) {
            convertToRegularDate = $filter('rxTime');
        });
    });

    it('should exist', function () {
        expect(convertToRegularDate).to.exist;
    });

    it('should convert [2016, 7, 18] to 12:00AM (UTC-05:00)', function () {
        dateString = [2016, 7, 18];
        expect(convertToRegularDate(dateString)).to.equal('12:00AM (UTC-05:00)');
    });

    it('should convert [2016, 7, 18] to 12:00AM (UTC-05:00) with param long', function () {
        dateString = [2016, 7, 18];
        param = 'long';
        expect(convertToRegularDate(dateString, param)).to.equal('12:00AM (UTC-05:00)');
    });

    it('should convert [2016, 7, 18] to 00:00-05:00 with param long', function () {
        dateString = [2016, 7, 18];
        param = 'short';
        expect(convertToRegularDate(dateString, param)).to.equal('00:00-05:00');
    });

    it('should convert [2016, 7, 18] to 12:00AM (UTC-05:00) with invalid param by default', function () {
        dateString = [2016, 7, 18];
        param = 'asdf';
        expect(convertToRegularDate(dateString)).to.equal('12:00AM (UTC-05:00)');
    });
});
