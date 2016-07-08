///<reference path="../typings/globals/selenium-webdriver/index.d.ts"/>
///<reference path="../typings/globals/node/index.d.ts"/>
///<reference path="../typings/globals/lodash/index.d.ts"/>
///<reference path="../typings/globals/moment-node/index.d.ts"/>

'use strict';

import * as moment from 'moment';
import * as _ from 'lodash';
import {ElementFinder, ElementArrayFinder} from 'protractor';
import {$$, browser, by} from 'protractor/globals';
import {rxComponentElement, AccessorPromiseString, Promise} from './rxComponent';

let rxSelect = require('./rxSelect.page').rxSelect;

interface rxDatePicker {
    close(): void;
    isDateSelected(string): Promise<boolean>;
    isOpen(): Promise<boolean>;
    isValid(): Promise<boolean>;
    open(): void;
};

/**
 * @class
 */
class rxDatePicker extends rxComponentElement {
    public rootElement: ElementFinder;
    private tblCurrentMonthDays: ElementArrayFinder;

    /**
     * @param {ElementFinder} [rxDatePickerElement=$('rx-date-picker')]
     * ElementFinder to be transformed into an rxDatePicker page object
     * @returns {rxDatePicker}
     */
    constructor(rxDatePickerElement) {
        if (rxDatePickerElement === undefined) {
            rxDatePickerElement = $$('rx-date-picker').first();
        }

        super(rxDatePickerElement);
        this.rootElement = rxDatePickerElement; // deprecate in 3.x

        this.tblCurrentMonthDays = this.$$('.day.inMonth');

        // Overrides
        this.isEnabled = (): Promise<boolean> => {
            return this.getAttribute('disabled')
                .then((disabled) => !disabled);
        };
    }

    /**
     * @private
     * @type {String}
     * @description (get/set) Month value of the picker _calendar_.
     * **Format:** `MMM` (e.g. "Apr", "May", "Jun")
     */
    private get month(): AccessorPromiseString {
        return rxSelect.initialize(this.element(by.model('currentMonth'))).selectedOption.getText();
    }
    private set month(value: AccessorPromiseString) {
        this.open();
        let slowClick = false;
        rxSelect.initialize(this.element(by.model('currentMonth'))).select(value, slowClick);
    }

    /**
     * @private
     * @type {String}
     * @description (get/set) Year value of the picker _calendar_.
     *
     * The date picker provides a 10-year range before and after the selected date,
     * if present.  Otherwise, the range is calculated from today's date.
     *
     * **Format:** `YYYY` (e.g. "2016")
     */
    private get year(): AccessorPromiseString {
        return rxSelect.initialize(this.element(by.model('currentYear'))).selectedOption.getText();
    }
    private set year(value: AccessorPromiseString) {
        this.open();
        let slowClick = false;
        rxSelect.initialize(this.element(by.model('currentYear'))).select(value, slowClick);
    }

    /**
     * @type {String}
     * @description (get/set) _Selected value_ of the picker.
     *
     * **Format:** `YYYY-MM-DD` (e.g. "2016-05-25")
     * @example
     * let datepicker = new encore.rxDatePicker();
     * datepicker.date = '2016-01-01';
     * expect(datepicker.date).to.eventually.equal('2016-01-01');
     */
    get date(): AccessorPromiseString {
        return this.$('.displayValue').getAttribute('datetime');
    }
    set date(dateString: AccessorPromiseString) {
        let date = moment(dateString as string, 'YYYY-MM-DD');
        this.month = date.format('MMM');
        this.year = date.format('YYYY');
        this._selectVisibleDate(dateString as string);
    }

    /**
     * @private
     * @description
     * Sets the calendar's date by clicking the date corresponding to the value of
     * `date`.
     *
     * @param {String} date
     * `YYYY-MM-DD` formatted string to select on the current month.
     *
     * @example
     * let picker = new rxDatePicker();
     * picker._selectVisibleDate('2014-05-13');
     * expect(picker.date).to.eventually.eq('2014-05-13');
     */
    private _selectVisibleDate(date: string): Promise<void> {
        this.open();
        return this._dateElementByDate(date).$('span').click();
    };

    /**
     * @private
     * @deprecated Now that datepickers return strings, this complicated logic is not needed.
     * @description
     * Will select the last day of the current month seen on the picker calendar.
     * Does not accept arguments. Set the calendar month yourself with
     * {@link rxDatePicker#month} and {@link rxDatePicker#year} first, so that logic
     * picks the correct date.
     */
    private _selectLastDayOfCurrentMonth(): Promise<void> {
        this.open();
        return (this.month as Promise<string>).then(function (month) {
            return (this.year as Promise<string>).then(function (year) {
                let formattedDate = `${month}-${year}`;
                let lastOfMonth = moment(formattedDate, 'MMM-YYYY').endOf('month');
                return this._selectVisibleDate(lastOfMonth.format('YYYY-MM-DD'));
            });
        });
    };

    /**
     * @private
     * @description
     * Return a day seen on the picker calendar that corresponds to the value of
     * `date`.
     *
     * @param {String} date
     * `YYYY-MM-DD` formatted string of the date to select.
     *
     * @example
     * let picker = new encore.rxDatePicker();
     * picker.open();
     * picker._dateElementByDate('2012-06-23').getAttribute('class');
     *
     * @returns {ElementFinder}
     */
    private _dateElementByDate(date: string): ElementFinder {
        return this.$(`[data-date="${date}"]`);
    };

    /**
     * @see rxDatePicker#close
     * @description Ensures that the date picker is open.
     * @example
     * let picker = new encore.rxDatePicker();
     * picker.open();
     * picker.open(); // does nothing
     */
    open(): Promise<void> {
        return this.isOpen().then((open) => {
            if (!open) {
                return this.$('.control').click();
            }
        });
    };

    /**
     * @see rxDatePicker#open
     * @description Ensures that the date picker is closed.
     * @example
     * let picker = new encore.rxDatePicker();
     * picker.open();
     * picker.close();
     * picker.close(); // does nothing
     */
    close(): Promise<void> {
        return this.isOpen().then((isOpen) => {
            if (isOpen) {
                return this.$('.backdrop').click();
            }
        });
    };

    /**
     * @private
     * @description Click over to the next month in the calendar.
     */
    private nextMonth(): Promise<void> {
        this.open();
        return this.$('.arrow.next').click();
    };

    /**
     * @private
     * @description Click back to the previous month in the calendar.
     */
    private previousMonth(): Promise<void> {
        this.open();
        return this.$('.arrow.prev').click();
    };

    /**
     * @description Whether or not the date requested is currently selected.
     * @param {String} date
     * `YYYY-MM-DD` formatted date to check if it is currently selected.
     * @returns {Promise<Boolean>}
     */
    isDateSelected(date: string): Promise<boolean> {
        this.open();
        return this._dateElementByDate(date).getAttribute('class')
            .then(classes => _.includes(classes, 'selected'));
    };

    /**
     * @private
     * @description
     * Whether or not the date passed in matches the "today" date in the calendar.
     * @param {String} date
     * `YYYY-MM-DD` formatted date to check if it is styled as today's date.
     * @returns {Promise<Boolean>}
     */
    private isDateToday(date: string): Promise<boolean> {
        this.open();
        return this._dateElementByDate(date).getAttribute('class')
            .then(classes => _.includes(classes, 'today'));
    };

    /**
     * @description Whether or not the calendar is in an invalid state.
     * @returns {Promise<Boolean>}
     */
    isValid(): Promise<boolean> {
        return this.getAttribute('class')
            .then(classes => !_.includes(classes, 'ng-invalid'));
    };

    /**
     * @description Whether or not the calendar is open.
     * @returns {Promise<Boolean>}
     */
    isOpen(): Promise<boolean> {
        return this.$('.popup').getAttribute('class')
            .then(classes => !_.includes(classes, 'ng-hide'));
    };

    /**
     * @param {ElementFinder} rxDatePickerElement
     * @deprecated Prefer use of `new` constructor. Will be removed at version 3.0.
     * ElementFinder to be transformed into an rxDatePicker page object.
     * @returns {rxDatePicker} Page object representing the rxDatePicker element.
     */
    static initialize(rxDatePickerElement?: ElementFinder): rxDatePicker {
        return new rxDatePicker(rxDatePickerElement);
    };

};

exports.rxDatePicker = rxDatePicker;
