import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import moment from 'moment'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import DatePicker from './DatePicker'
import FieldError from './FieldError'
import Help from './Help'
import Label from './Label'
import SubHelp from './SubHelp'

export default class TextInput extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        dateFormat: PropTypes.string,
        datePicker: PropTypes.bool,
        disabled: PropTypes.bool,
        onKeyPress: PropTypes.func,
        placeholder: PropTypes.string,
        rows: PropTypes.number,
        success: PropTypes.bool,
        type: PropTypes.string, // oneOf?
        weekDayStart: PropTypes.number,
    }

    static defaultProps = {
        datePicker: false,
        placeholder: '',
        rows: 6,
        type: 'text',
        weekDayStart: 0,
    }

    state = {
        showTooltip: false,
        tooltipPosition: null,
    }

    /*
     * Assigned the value upstream
     */
    handleChange = (e) => {
        const value = e.target.value

        if (this.props.type === 'email') {
            if (this._isEmailValid(value)) {
                this.setState({ error: null })
            } else {
                this.setState({ error: 'Please enter a valid email address.' })
            }
        }

        this.props.updateValue({ [this.props.name]: value })
    }

    /*
     * Handle focus
     */
    handleFocus = () => {
        const position = this.refs['form-control'].getBoundingClientRect()
        const tooltipPosition = position.height

        const newState = {
            showTooltip: true,
            tooltipPosition,
        }

        if (this.props.datePicker === true) {
            if ((position.top + position.height / 2) < window.innerHeight / 2) {
                newState.datePickerAlignment = 'bottom'
            } else {
                newState.datePickerAlignment = 'top'
            }

            this._listenDatePickerClick()
            this._datePickerOn = true
        }

        this.setState(newState)

        this.props.handleFocus && this.props.handleFocus()
    }

    /*
     * Handle blur
     */
    handleBlur = () => {
        if (this._datePickerOn !== true) {
            this.setState({
                showTooltip: false,
                tooltipPosition: null,
            })
        }

        this.props.handleBlur && this.props.handleBlur()
    }

    /*
     * Handle value change from the date picker
     */
    handleDateChange = (value) => {
        this._datePickerOn = false

        this.props.updateValue({ [this.props.name]: value })

        this.handleBlur()
        this._stopListenDatePickerClick()
    }

    /*
     * Start listening to click events, if the user click out of the date picker,
     * then hide it.
     */
    _listenDatePickerClick() {
        this._listener = (e) => this.checkDatePickerPosition(e)
        document.addEventListener('click', this._listener)
    }

    /*
     * Stop listening to click events
     */

    _stopListenDatePickerClick() {
        document.removeEventListener('click', this._listener)
    }

    /*
     * Check if the mouse click is within the datepicker or form-control area
     * If the mouse click is outside of the area, then we hide the date picker
     */

    checkDatePickerPosition = (e) => {
        if (this._datePickerOn === true) {
            // Get the area covered by the date picker
            const pDP = ReactDOM.findDOMNode(this.refs.datepicker).getBoundingClientRect()
            const pFC = this.refs['form-control'].getBoundingClientRect()

            // Get the position of the mouse
            const mouseX = e.clientX
            const mouseY = e.clientY

            if (pDP.left < mouseX < pDP.right && pDP.top < mouseY < pDP.bottom) {
                // nothing, just handy to use thie positive test to get our else condition
            } else if (pFC.left < mouseX < pFC.right && pFC.top < mouseY < pFC.bottom) {
                // also nothing, wait for it...
            } else {
                this._datePickerOn = false
                this.handleBlur()
                this._stopListenDatePickerClick()
            }
        }
    }

    /*
     * Validate email
     */
    _isEmailValid(value) {
        const re = /^[\w]+@[\w]+\.[a-z\.]+$/

        return re.test(value)
    }

    /*
     * Define the HTML for the field
     */
    render() {
        const value = this.props.value || ''
        const inputId = `id_${ this.props.name }`

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames({
            'form__control': true,
            'form__control--text': true,
            'form__control--text-success': this.props.success,
            'form__control--text-error': this.props.error,
        })

        let field = null
        let helpUI = null

        if (this.props.type === 'textarea') {
            field = (
                <textarea
                    className="form__text form__textarea"
                    disabled={ this.props.disabled }
                    id={ inputId }
                    name={ this.props.name }
                    onBlur={ this.handleBlur }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onKeyPress={ this.props.onKeyPress }
                    placeholder={ this.props.placeholder }
                    ref="input"
                    rows={ this.props.rows }
                    type={ this.props.type }
                    value={ value }
                />
            )
        } else {
            let type = this.props.type

            if (this.props.datePicker) {
                type = 'date'
            }

            field = (
                <input
                    className="form__text"
                    disabled={ this.props.disabled }
                    id={ inputId }
                    name={ this.props.name }
                    onBlur={ this.handleBlur }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onKeyPress={ this.props.onKeyPress }
                    placeholder={ this.props.placeholder }
                    ref="input"
                    type={ type }
                    value={ value }
                />
            )
        }

        if (this.props.datePicker) {
            helpUI = (
                <DatePicker
                    alignment={ this.state.datePickerAlignment }
                    date={ moment(value) }
                    dateFormat={ this.props.dateFormat || null }
                    onChange={ this.handleDateChange }
                    position={ this.state.tooltipPosition }
                    ref="datepicker"
                    weekDayStart={ this.props.weekDayStart || null }
                />
            )
        } else {
            helpUI = (
                <Help
                    help={ this.props.help }
                    on={ this.state.showTooltip && !this.props.error }
                    position={ this.state.tooltipPosition }
                />
            )
        }

        return (
            <div className={ groupClasses }>
                <Label for={ inputId }>
                    { this.props.label }
                </Label>
                <div className={ controlClasses } ref="form-control">
                    <FieldError
                        error={ this.props.error }
                        on={ this.state.showTooltip }
                        position={ this.state.tooltipPosition }
                    />
                    { field }
                    { helpUI }
                </div>
                <SubHelp help={ this.props.subHelp }/>
            </div>
        )
    }
}
