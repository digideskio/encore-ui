describe('rxNotify', function () {
    var scope, compile, el, notifySvc, interval;
    var validTemplate = '<rx-notifications></rx-notifications>';
    var messageText1 = 'My Message 1';
    var messageText2 = 'My Message 2';
    var otherStack = 'other';

    beforeEach(function () {
        module('encore.ui.elements');
        module('encore.ui.rxSpinner');
        module('templates/rxNotifications.html');
        module('templates/rxNotification.html');

        inject(function ($rootScope, $compile, $interval, rxNotify) {
            scope = $rootScope.$new();
            compile = $compile;
            notifySvc = rxNotify;
            interval = $interval;
        });

        el = helpers.createDirective(validTemplate, compile, scope);
    });

    afterEach(function () {
        el = null;
    });

    describe('directive: rxNotifications', function () {
        it('should show only from specific stack', function () {
            // add message (to default stack)
            notifySvc.add(messageText1);

            scope.$digest();

            // validate message is shown
            expect(el.text()).to.contain(messageText1);

            // add other message to different stack
            notifySvc.add(messageText2, {
                stack: otherStack
            });

            scope.$digest();

            // validate other message not shown
            expect(el.text()).to.not.contain(messageText2);
        });

        it('should be hidden when no messages available', function () {
            // validate hidden (via class)
            expect(el.hasClass('ng-hide')).to.be.true;
        });

        it('should be dismiss messages via click', function () {
            // add message
            notifySvc.add(messageText1);

            scope.$digest();

            // validate message is shown
            expect(el.text()).to.contain(messageText1);

            // trigger click on element
            helpers.clickElement(el[0].querySelector('.notification-dismiss'));

            // wait until before timeout
            interval.flush(650);

            // validate no longer exists
            expect(el.text()).to.not.contain(messageText1);
        });

        it('should show spinner when loading set', function () {
            // add message
            notifySvc.add(messageText1, {
                loading: true
            });

            scope.$digest();

            // validate message is shown
            expect(el.text()).to.contain(messageText1);

            // validate spinner is shown
            expect(el.find('div').find('div')[0]).to.exist;

            // validate 'dismiss' action not found
            expect(el[0].querySelector('.notification-dismiss')).to.not.exist;
        });
    });//rxNotifications
});//rxNotify
