import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'

import { formControlPropTypes, focussablePropTypes, generateId } from './Utils'

import SubContent from './Utils/SubContent'

import DatePicker from './DatePicker'
import Label from './Label'

export default class DatePickerInput extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        dateFormat: PropTypes.string,
        max: PropTypes.string, // date string, optional
        min: PropTypes.string, // date string, optional
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        success: PropTypes.bool,
        value: PropTypes.string, // make sure value is specifically a string, as it should be a date string
        weekDayStart: PropTypes.number,
    }

    static defaultProps = {
        disabled: false,
        placeholder: '',
        weekDayStart: 1,
    }

    state = {
        datePickerAlignment: 'bottom',
        datePickerOn: false,
        tooltipPosition: null,
    }

    textInput = null
    formControl = null
    datePicker = null

    storeTextInputRef = (ref) => {
        this.textInput = ref

        if (this.props.innerRef) {
            this.props.innerRef(ref)
        }
    }

    storeFormControlRef = (ref) => this.formControl = ref

    storeDatePickerRef = (ref) => this.datePicker = ref

    updateValue(value) {
        if (value !== this.props.value) {
            this.props.updateValue({ [this.props.name]: value })
        }
    }

    openDatePicker = () => {
        const position = this.formControl.getBoundingClientRect()

        const newState = {
            datePickerOn: true,
        }

        // If the middle of the form control is in the upper half of the window, hang the date
        // picker down to the bottom.
        if ((position.top + position.height / 2) < window.innerHeight / 2) {
            newState.datePickerAlignment = 'bottom'
            newState.tooltipPosition = `calc(${ this.formControl.offsetTop + this.formControl.offsetHeight }px + 0.25rem)`
        } else {
            newState.datePickerAlignment = 'top'
            newState.tooltipPosition = `calc(100% - ${ this.formControl.offsetTop }px + 0.25rem)`
        }

        this.setState(newState)
        this.listenDatePickerClick()
    }

    closeDatePicker = () => {
        this.setState({ datePickerOn: false, tooltipPosition: null })
        this.stopListenDatePickerClick()
        this.handleBlur()
    }

    /*
     * Handle focus
     */
    handleFocus = () => {
        this.openDatePicker()
        this.props.handleFocus && this.props.handleFocus()
    }

    /*
     * Handle blur
     */
    handleBlur = () => {
        this.props.handleBlur && this.props.handleBlur()
    }

    /*
     * Handle value change from the date picker
     */
    handleDateChange = (value) => {
        this.updateValue(value)
        this.closeDatePicker()
    }

    /*
     * Start listening to click events, if the user clicks out of the date picker, then hide it.
     */
    listenDatePickerClick() {
        document.addEventListener('click', this.validateMousePosition)
    }

    /*
     * Stop listening to click events.
     */
    stopListenDatePickerClick() {
        document.removeEventListener('click', this.validateMousePosition)
    }

    /*
     * Check if the mouse click is within the date picker or form-control area
     * If the mouse click is outside of the area, then we hide the date picker
     */
    validateMousePosition = (e) => {
        if (this.state.datePickerOn && this.formControl && this.datePicker) {
            // Get the area covered by the date picker
            const pDP = this.datePicker.getBoundingClientRect()
            const pFC = this.formControl.getBoundingClientRect()

            // Get the position of the mouse
            const mouseX = e.clientX
            const mouseY = e.clientY

            if (pDP.left < mouseX && mouseX < pDP.right && pDP.top < mouseY && mouseY < pDP.bottom) {
                // Mouse is within the date picker.
                // Do nothing, just handy to use the positive test to get our else condition.
            } else if (pFC.left < mouseX && mouseX < pFC.right && pFC.top < mouseY && mouseY < pFC.bottom) {
                // Mouse is within the form control div.
                // Also do nothing, but wait for it...
            } else {
                // Mouse is both ouside of the date picker and the form control, hide the date picker.
                this.closeDatePicker()
            }
        }
    }

    render() {
        const inputId = generateId(this.props.name)

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        }, this.props.extraGroupClasses)

        const controlClasses = classnames({
            'form__control': true,
            'form__control--input': true,
            'form__control--input-addon': this.props.prefix || this.props.suffix,
            'form__control--date': true,
        })

        return (
            <div className={ groupClasses }>
                <Label htmlFor={ inputId }>{ this.props.label }</Label>

                <div className={ controlClasses } ref={ this.storeFormControlRef }>
                    <input
                        disabled={ this.props.disabled }
                        id={ inputId }
                        name={ this.props.name }
                        onBlur={ this.handleBlur }
                        onFocus={ this.handleFocus }
                        placeholder={ this.props.placeholder }
                        readOnly
                        ref={ this.storeTextInputRef }
                        required={ this.props.required }
                        type="text"
                        value={ this.props.value || '' }
                    />

                    { this.state.datePickerOn &&
                        <DatePicker
                            alignment={ this.state.datePickerAlignment }
                            date={ this.props.value && moment(this.props.value) }
                            dateFormat={ this.props.dateFormat || null }
                            innerRef={ this.storeDatePickerRef }
                            max={ this.props.max && moment(this.props.max) }
                            min={ this.props.min && moment(this.props.min) }
                            onChange={ this.handleDateChange }
                            position={ this.state.tooltipPosition }
                            weekDayStart={ this.props.weekDayStart || null }
                        />
                    }

                    { this.props.prefix && (
                        <div className="input-addon input-addon--prefix">
                            { this.props.prefix }
                        </div>
                    )}
                    { this.props.suffix && (
                        <div className="input-addon input-addon--suffix">
                            { this.props.suffix }
                        </div>
                    )}
                </div>

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
