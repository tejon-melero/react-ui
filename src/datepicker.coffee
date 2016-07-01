React = require 'react'
classnames = require 'classnames'
moment = require 'moment'
require 'moment-range'

DatePicker = React.createClass({

    getDefaultProps: ->
        return {
            date: moment()
            weekDayStart: 0
        }

    getInitialState: ->

        if @props.weekDayStart == 1
            # Set locale to start week on Monday
            moment.locale('en', {
                week : {
                    dow : 1 # In UK, Monday is the first day of the week.
                    doy : 4 # In UK, The week that contains Jan 4th is the first week of the year.
                }
            })
        else
            moment.locale('en')

        month = moment().month()
        year = moment().year()
        return {
            date: this.props.date
            month: month
            year: year
            calendar: @getCalendar(year, month)
        }

    getCalendar: (year, month) ->

        # Get a date in the given month and year
        startDate = moment([year, month])

        # Get the first and last date of the month
        firstDay = moment(startDate).startOf('month')
        endDay = moment(startDate).endOf('month')

        # Create a month range we can iterate through
        monthRange = moment.range(firstDay, endDay)

        # Create an empty list of weeks IDs and calendar (list of week ranges)
        weeks = []
        calendar = []

        # Look through each day and add the week to the range if not added
        # already
        monthRange.by 'days', (day) ->
            if day.week() not in weeks
                # Create a range for the week of that day
                weekRange = moment.range(moment(day).startOf('week'), moment(day).endOf('week'))
                calendar.push weekRange
                weeks.push(day.week())

        # Add an extra week if we only have five, to maintain picker height
        if weeks.length == 5
            # Add an extra day
            extraDay = moment(calendar[calendar.length - 1].end).add(1, 'day')
            weekRange = moment.range(moment(extraDay).startOf('week'), moment(extraDay).endOf('week'))
            calendar.push weekRange
            weeks.push(extraDay.week())

        return calendar

    setDate: (day, e)->
        e.preventDefault()
        @setState({
            date: day
        })
        if @props.onChange
            @props.onChange(day.format(@props.dateFormat or "YYYY-MM-DD"))

    nextMonth: (e)->
        e.preventDefault()
        if @state.month == 11
            month = 0
            year = this.state.year + 1
        else
            month = this.state.month + 1
            year = this.state.year

        @setState({
            month: month
            year: year
            calendar: @getCalendar(year, month)
        })

    previousMonth: (e)->
        e.preventDefault();
        if @state.month == 0
            month = 11
            year = this.state.year - 1
        else
            month = this.state.month - 1
            year = this.state.year

        @setState({
            month: month
            year: year
            calendar: @getCalendar(year, month)
        })

    render: ->

        context = this
        state = this.state;
        setDate = this.setDate;

        #
        # Generate week days
        #
        weekDays = null
        if state.calendar.length
            dayList = []
            state.calendar[0].by('days', (day)->
                dayList.push(day)
            )
            weekDays = dayList.map (day)->
                dayFormatted = day.format('dd')
                return (<td className="datepicker__weekday" key={ dayFormatted }>{ dayFormatted }</td>)

            weekDays = (<tr>{weekDays}</tr>)

        #
        # Generate month days
        #
        weekCount = 0
        weeks = state.calendar.map (week)->
            weekCount++
            dayList = []
            week.by('days', (day)->
                dayList.push(day)
            )
            days = dayList.map (day)->
                isCurrentMonth = day.month() == state.month
                isToday = day.format('DD-MM-YYYY') == moment().format('DD-MM-YYYY')
                isSelected = day.format('DD-MM-YYYY') == state.date.format('DD-MM-YYYY')
                dayClasses = "datepicker__day";

                if !isCurrentMonth
                    dayClasses += " datepicker__day--muted";

                if isSelected
                    dayClasses += " datepicker__day--selected";

                if isToday
                    dayClasses += " datepicker__day--today";

                return <td key={day.format('D-MM')}>
                    <a href="#" className={ dayClasses } onClick={ setDate.bind(context, day) }>{ day.format('D') }</a></td>

            return <tr key={ weekCount }>{ days }</tr>

        #
        # Date Picker styles
        #
        datePickerStyles =
            position: "absolute"
            display: "none"
            zIndex: "10000"

        if @props.position
            if @props.alignment == 'bottom'
                datePickerStyles['top'] = @props.position.height + 6
            else
                datePickerStyles['bottom'] = @props.position.height + 6
            datePickerStyles['display'] = "block"

        return (<div style={ datePickerStyles }>
            <div className="datepicker">
                <table>
                    <thead>
                        <tr>
                            <td>
                                <a href="#" className="datepicker__nav datepicker__nav--previous" onClick={ this.previousMonth }></a>
                            </td>
                            <td colSpan="5"><span className="datepicker__selected-date">{ moment().month(this.state.month).format("MMMM") } { this.state.year }</span></td>
                            <td>
                                <a href="#" className="datepicker__nav datepicker__nav--next" onClick={ this.nextMonth }></a>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {weekDays}
                        {weeks}
                    </tbody>
                </table>
            </div>
            </div>)

})

module.exports = DatePicker
