describe('rxNotify', function () {
    var scope, rootScope, notifySvc, interval;
    var defaultStack = 'page';
    var otherStack = 'other';

    beforeEach(function () {
        module('encore.ui.utilities');
        module('encore.ui.elements');

        inject(function ($rootScope, $interval, rxNotify) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            notifySvc = rxNotify;
            interval = $interval;
        });
    });

    describe('Service: rxPromiseNotifications', function () {
        var prom, rpn, q;
        var loadingMsg = 'loading';
        var successMsg = 'success';
        var errorMsg = 'error';

        beforeEach(function () {
            inject(function (rxPromiseNotifications, $q) {
                rpn = rxPromiseNotifications;
                q = $q;
            });

            prom = q.defer();
        });

        afterEach(function () {
            prom = null;
        });

        it('should show loading message immediately', function () {
            // create message w/o an options
            rpn.add(prom.promise, {
                loading: loadingMsg
            });

            // expect loading message to be in stack
            expect(notifySvc.stacks[defaultStack][0].text).to.equal(loadingMsg);
            expect(notifySvc.stacks[defaultStack][0].loading).to.equal(true);
        });

        it('should dismiss loading message after promise resolves', function () {
            rpn.add(prom.promise, {
                loading: loadingMsg
            });

            prom.resolve();

            scope.$digest();

            // wait until before timeout
            interval.flush(650);

            // expect loading message to no longer be in stack
            expect(notifySvc.stacks[defaultStack].length).to.equal(0);
        });

        it('should allow for no loading message to be set', function () {
            rpn.add(prom.promise, {
                success: successMsg
            });

            // expect no messages to be in the stack
            expect(notifySvc.stacks[defaultStack].length).to.equal(0);
        });

        it('should show success message after promise is resolved successfully', function () {
            rpn.add(prom.promise, {
                success: successMsg
            });

            prom.resolve();

            scope.$digest();

            // expect success message to be the only thing showing
            expect(notifySvc.stacks[defaultStack].length).to.equal(1);
            expect(notifySvc.stacks[defaultStack][0].text).to.equal(successMsg);
        });

        it('should show error message after promise is rejected', function () {
            rpn.add(prom.promise, {
                error: errorMsg
            });

            prom.reject();

            scope.$digest();

            // expect error message to be the only thing showing
            expect(notifySvc.stacks[defaultStack].length).to.equal(1);
            expect(notifySvc.stacks[defaultStack][0].text).to.equal(errorMsg);
        });

        it('should not show messages if route is changed before promise is resolved', function () {
            rpn.add(prom.promise, {
                loading: loadingMsg,
                success: successMsg
            });

            // expect loading to be showing
            expect(notifySvc.stacks[defaultStack].length).to.equal(1);

            // simulate a route change
            rootScope.$broadcast('$routeChangeStart');

            scope.$digest();

            // wait until before timeout
            interval.flush(650);

            // expect loading message to no longer be in stack
            expect(notifySvc.stacks[defaultStack].length).to.equal(0);

            prom.resolve();

            scope.$digest();

            // expect no messages to be in stack
            expect(notifySvc.stacks[defaultStack].length).to.equal(0);
        });

        it('should show in custom stack', function () {
            rpn.add(prom.promise, {
                loading: loadingMsg,
                error: errorMsg
            }, otherStack);

            expect(notifySvc.stacks[otherStack][0].text).to.equal(loadingMsg);

            prom.reject();

            scope.$digest();

            // wait until before timeout
            interval.flush(650);

            // expect error message to be the only thing showing
            expect(notifySvc.stacks[otherStack].length).to.equal(1);
            expect(notifySvc.stacks[otherStack][0].text).to.equal(errorMsg);
        });

        it('should convert expression to string based on response data', function () {
            rpn.add(prom.promise, {
                loading: loadingMsg,
                error: errorMsg + '{{message}}'
            }, otherStack);

            expect(notifySvc.stacks[otherStack][0].text).to.equal(loadingMsg);

            prom.reject({
                message: 'test'
            });

            scope.$digest();

            // wait until before timeout
            interval.flush(650);

            // expect error message to be the only thing showing
            expect(notifySvc.stacks[otherStack].length).to.equal(1);
            expect(notifySvc.stacks[otherStack][0].text).to.equal(errorMsg + 'test');
        });
    });//service: rxPromiseNotifications
});//rxNotify
