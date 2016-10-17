import React, { Component } from 'react'
import moment from 'moment'

import 'moment-range'

const LAST_MONTH_IN_YEAR = 11
const VERTICAL_PADDING_PX = 6
const WEEKS_TO_DISPLAY = 6

export default class DatePicker extends Component {
    defaultProps = {
        date: moment(),
        weekDayStart: 0,
    }

    constructor(props) {
        super(props)

        if (this.props.weekDayStart === 1) {
            //  Set locale to start week on Monday
            moment.locale('en', {
                week: {
                    dow: 1, // In UK, Monday is the first day of the week.
                    doy: 4, // In UK, The week that contains Jan 4th is the first week of the year.
                },
            })
        } else {
            moment.locale('en')
        }

        const month = moment().month()
        const year = moment().year()

        this.state = {
            date: this.props.date,
            month,
            year,
            calendar: this.getCalendar(year, month),
        }
    }

    getCalendar(year, month) {
        // Get a date in the given month and year
        const startDate = moment([ year, month ])

        // Get the first and last date of the month
        const firstDay = moment(startDate).startOf('month')
        const endDay = moment(startDate).endOf('month')

        // Create a month range we can iterate through
        const monthRange = moment.range(firstDay, endDay)

        // Create an empty list of weeks IDs and calendar (list of week ranges)
        const weeks = []
        const calendar = []

        // Look through each day and add the week to the range if not added
        // already
        monthRange.by('days', (day) => {
            if (! weeks.includes(day.week())) {
                // Create a range for the week of that day
                const weekRange = moment.range(
                    moment(day).startOf('week'),
                    moment(day).endOf('week')
                )

                calendar.push(weekRange)
                weeks.push(day.week())
            }
        })

        // Add an extra week if we only have five, to maintain picker height
        if (weeks.length < WEEKS_TO_DISPLAY) {
            // Add an extra day
            const extraDay = moment(calendar[calendar.length - 1].end).add(1, 'day')
            const weekRange = moment.range(
                moment(extraDay).startOf('week'),
                moment(extraDay).endOf('week')
            )

            calendar.push(weekRange)
            weeks.push(extraDay.week())
        }

        return calendar
    }

    setDate(day, e) {
        e.preventDefault()

        this.setState({ date: day })

        this.props.onChange && this.props.onChange(day.format(this.props.dateFormat || 'YYYY-MM-DD'))
    }

    nextMonth = (e) => {
        e.preventDefault()

        let month = this.state.month + 1
        let year = this.state.year

        if (this.state.month === LAST_MONTH_IN_YEAR) {
            month = 0
            year = this.state.year + 1
        }

        this.setState({
            month,
            year,
            calendar: this.getCalendar(year, month),
        })
    }

    previousMonth = (e) => {
        e.preventDefault()

        let month = this.state.month - 1
        let year = this.state.year

        if (this.state.month === 0) {
            month = LAST_MONTH_IN_YEAR
            year = this.state.year - 1
        }

        this.setState({
            month,
            year,
            calendar: this.getCalendar(year, month),
        })
    }

    render() {
        const state = this.state
        const setDate = this.setDate

        // Generate week days
        let weekDays = null

        if (state.calendar.length) {
            const dayList = []

            state.calendar[0].by('days', (day) => dayList.push(day))

            weekDays = dayList.map((day) => (
                <td className="datepicker__weekday" key={ day.format('dd') }>
                    { day.format('dd') }
                </td>
            ))

            weekDays = (
                <tr>
                    { weekDays }
                </tr>
            )
        }

        // Generate month days
        let weekCount = 0

        const weeks = state.calendar.map((week) => {
            weekCount++

            const dayList = []

            week.by('days', (day) => dayList.push(day))

            const days = dayList.map((day) => {
                const isCurrentMonth = day.month() === state.month
                const isToday = day.format('DD-MM-YYYY') === moment().format('DD-MM-YYYY')
                const isSelected = day.format('DD-MM-YYYY') === state.date.format('DD-MM-YYYY')
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

                return (
                    <td key={ day.format('D-MM') }>
                        <a
                            className={ dayClasses.join(' ') }
                            href="#"
                            onClick={ setDate.bind(this, day) }
                        >
                            { day.format('D') }
                        </a>
                    </td>
                )
            })

            return <tr key={ weekCount }>{ days }</tr>
        })

        // Date Picker styles
        const datePickerStyles = {
            position: 'absolute',
            display: 'none',
            zIndex: '10000',
        }

        if (this.props.position) {
            if (this.props.alignment === 'bottom') {
                datePickerStyles.top = this.props.position.height + VERTICAL_PADDING_PX
            } else {
                datePickerStyles.bottom = this.props.position.height + VERTICAL_PADDING_PX
            }

            datePickerStyles.display = 'block'
        }

        return (
            <div style={ datePickerStyles }>
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
                                        { moment().month(this.state.month).format('MMMM') }
                                        { this.state.year }
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
            </div>
        )
    }
}
