describe('rxMonth', function () {
    var convertToRegularDate;
    var dateString;
    var param;
    beforeEach(function () {
        module('encore.ui.utilities');

        inject(function ($filter) {
            convertToRegularDate = $filter('rxMonth');
        });
    });

    it('should exist', function () {
        expect(convertToRegularDate).to.exist;
    });

    it('should convert [2016, 7, 18] to August 2016', function () {
        dateString = [2016, 7, 18];
        expect(convertToRegularDate(dateString)).to.equal('August 2016');
    });

    it('should convert [2016, 7, 18] to August 2016 with param long', function () {
        dateString = [2016, 7, 18];
        param = 'long';
        expect(convertToRegularDate(dateString, param)).to.equal('August 2016');
    });

    it('should convert [2016, 7, 18] to 08 / 2016 with param long', function () {
        dateString = [2016, 7, 18];
        param = 'short';
        expect(convertToRegularDate(dateString, param)).to.equal('08 / 2016');
    });

    it('should convert [2016, 7, 18] to 08 / 16 with param micro', function () {
        dateString = [2016, 7, 18];
        param = 'micro';
        expect(convertToRegularDate(dateString, param)).to.equal('08 / 16');
    });

    it('should convert [2016, 7, 18] to August 2016 with invalid param by default', function () {
        dateString = [2016, 7, 18];
        param = 'asdf';
        expect(convertToRegularDate(dateString, param)).to.equal('August 2016');
    });
});
