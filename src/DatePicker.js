import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
import { extendMoment } from 'moment-range'

const moment = extendMoment(Moment)

const WEEKS_TO_DISPLAY = 6

const isDateDifferent = (prev, next) => (
    (prev && ! next) ||
    (! prev && next) ||
    (prev && next && (prev - next !== 0))
)

export default class DatePicker extends Component {
    static propTypes = {
        date: PropTypes.instanceOf(Date),
        dateFormat: PropTypes.string,
        max: PropTypes.instanceOf(Date),
        min: PropTypes.instanceOf(Date),
        onChange: PropTypes.func.isRequired,
        weekDayStart: PropTypes.number,
    }

    static defaultProps = {
        weekDayStart: 1,
    }

    constructor(props) {
        super(props)

        //  Set locale to start week on Monday
        moment.updateLocale('en', {
            week: {
                dow: this.props.weekDayStart,

                // Just use the moment default (https://github.com/moment/moment/blob/develop/src/lib/units/week.js#L46)
                // here, but this shouldn't affect us either way as we don't care about week numbers.
                doy: 6,
            },
        })

        moment.locale('en')

        let prototypeMonth = moment()

        if (props.date && moment(props.date).isValid()) {
            prototypeMonth = moment(props.date)
        }

        this.state = {
            month: prototypeMonth.startOf('month'),
        }
    }

    componentWillReceiveProps(nextProps) {
        // If any of the date, min or max dates change, we need to recaulcate a new valid date
        // (within min and max) and if that's different to the date we have, we need to "set" it in
        // order to tell the parent about the new date we wish to use.
        if (
            isDateDifferent(this.props.min, nextProps.min) ||
            isDateDifferent(this.props.max, nextProps.max) ||
            isDateDifferent(this.props.date, nextProps.date)
        ) {
            const validDate = this.getValidDate(nextProps.date, nextProps.min, nextProps.max)

            if (validDate !== nextProps.date) {
                this.setDate(validDate)
            }
        }
    }

    getValidDate(date, min, max) {
        // Note: because any invalid date will return `false` when compared to any other date
        // (valid or not), we can avoid any `isValid` checks in this function and simply assume
        // validity, because all our conditions and comparisons only return something other than
        // the original date if the comparisons return `true`.

        // First just ensure that we have a usable date, because without one it's going to be
        // difficult to do any comparisons. If we don't, just return null as we don't understand the
        // date we have been given.
        if (date && date instanceof Date) {
            date = moment(date)
        } else if (! (date && date instanceof moment)) {
            return null
        }

        // Ensure min and max are given and actual dates. This saves a lot of `instanceof` later on
        // too.
        if (min && min instanceof Date) {
            min = moment(min)
        } else {
            min = null
        }

        if (max && max instanceof Date) {
            max = moment(max)
        } else {
            max = null
        }

        // If we have a usable min and max and they're in the nonstandard order (i.e. disallow a
        // given range, but all history and future is valid):
        if (min && max && max.isBefore(min, 'day') && date.isBetween(min, max, 'day', '()')) {
            // In this case, we set date to its closest out of min and max, with min winning a tie.

            const maxDiff = date.diff(max, 'days', true)
            const minDiff = min.diff(date, 'days', true)

            if (maxDiff < minDiff) {
                return max
            }

            return min
        }

        // Okay if we got here, it's a normal date range where min is before max (though either may
        // be unspecified).

        // In this case, just set date to min if before min, max if after max.
        if (min && date.isBefore(min, 'day')) {
            return min
        } else if (max && date.isAfter(max, 'day')) {
            return max
        }

        // If we got here, the date is a normal date in between min and max 😱 so just return it
        return date
    }

    isValidDate(date, min, max) {
        // See above for the basis of the logic here. This function only has to determine if the
        // date is out of bounds, so doesn't have quite as much code, but uses the same basic
        // checks.
        if (date && date instanceof Date) {
            date = moment(date)
        } else if (! (date && date instanceof moment)) {
            return false
        }

        // Ensure min and max are given and actual dates. This saves a lot of `instanceof` later on
        // too.
        if (min && min instanceof Date) {
            min = moment(min)
        } else {
            min = null
        }

        if (max && max instanceof Date) {
            max = moment(max)
        } else {
            max = null
        }

        // Inverted min/max (window of invalid as opposed to window of valid). Check if date is in
        // that invalid window.
        if (min && max && max.isBefore(min, 'day')) {
            return ! date.isBetween(min, max, 'day', '()')
        }

        // Normal date range with optional min/max

        if (min && date.isBefore(min, 'day')) {
            return false
        } else if (max && date.isAfter(max, 'day')) {
            return false
        }

        // Normal date range, date in range.
        return true
    }

    getCalendar(month) {
        // Calendar will be our list of week ranges,
        const calendar = []

        // We need to ensure that the calendar will include the entire month, so we need to know when it ends.
        const lastDayOfMonth = month.clone().endOf('month')

        // curDay is just a temporary stepping variable, and is initialised to the first day of the
        // first week of the month (most probably a date before the 1st of the month).
        // Realistically, becasue we want at least six weeks, this is not really required, but
        // let's be as correct as we can.
        const curDay = month.clone().startOf('month').startOf('week')

        // We do array length check first as it'll be faster and will shortcut the date check if true.
        while (calendar.length < WEEKS_TO_DISPLAY || curDay.isBefore(lastDayOfMonth, 'day')) {
            calendar.push(
                moment.range(
                    curDay.clone().startOf('week'),
                    curDay.clone().endOf('week')
                )
            )

            curDay.add(1, 'week')
        }

        return calendar
    }

    selectDate(date, e) {
        e && e.preventDefault()

        const validDate = this.getValidDate(date, this.props.min, this.props.max)

        this.setDate(validDate)
    }

    setDate(date) {
        this.props.onChange(date && date.toDate())
    }

    nextMonth = (e) => {
        e && e.preventDefault()

        this.setState({ month: this.state.month.clone().add(1, 'month') })
    }

    previousMonth = (e) => {
        e && e.preventDefault()

        this.setState({ month: this.state.month.clone().subtract(1, 'month') })
    }

    render() {
        const { month } = this.state
        const { date, min, max } = this.props

        const calendar = this.getCalendar(month)

        const today = moment().startOf('day')

        // Generate week days
        let weekDays = null

        if (calendar.length) {
            const dayList = Array.from(calendar[0].by('day'))

            weekDays = (
                <tr>
                    { dayList.map((day) => (
                        <td className="datepicker__weekday" key={ day.format('dd') }>
                            { day.format('dd') }
                        </td>
                    )) }
                </tr>
            )
        }

        // Generate month days
        const weeks = calendar.map((week, weekIndex) => {
            const days = Array.from(week.by('day')).map((day) => {
                const isCurrentMonth = day.isSame(month, 'month')
                const isSelected = day.isSame(date, 'day')
                const isToday = day.isSame(today, 'day')
                const isValid = this.isValidDate(day, min, max)

                const dayClasses = [ 'datepicker__day' ]

                if (! isCurrentMonth) {
                    dayClasses.push('datepicker__day--muted')
                }

                if (isSelected) {
                    dayClasses.push('datepicker__day--selected')
                }

                if (isToday) {
                    dayClasses.push('datepicker__day--today')
                }

                if (! isValid) {
                    dayClasses.push('datepicker__day--invalid')
                }

                const dayProps = {
                    role: 'button',
                    className: dayClasses.join(' '),
                }

                if (isValid) {
                    dayProps.onClick = this.selectDate.bind(this, day)
                }

                return (
                    <td key={ day.format('D-MM') }>
                        <span { ...dayProps }>
                            { day.format('D') }
                        </span>
                    </td>
                )
            })

            return <tr key={ weekIndex }>{ days }</tr>
        })

        return (
            <div className="datepicker">
                <table>
                    <thead>
                        <tr>
                            <td>
                                <a
                                    className="datepicker__nav datepicker__nav--previous"
                                    href="#"
                                    onClick={ this.previousMonth }
                                />
                            </td>
                            <td colSpan="5">
                                <span className="datepicker__selected-date">
                                    { month.format('MMMM') }
                                    { ' ' }
                                    { month.format('YYYY') }
                                </span>
                            </td>
                            <td>
                                <a
                                    className="datepicker__nav datepicker__nav--next"
                                    href="#"
                                    onClick={ this.nextMonth }
                                />
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        { weekDays }
                        { weeks }
                    </tbody>
                </table>
            </div>
        )
    }
}
