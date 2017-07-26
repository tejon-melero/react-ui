import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import moment from 'moment'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import GroupError from './Utils/GroupError'
import SubHelp from './Utils/SubHelp'

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
        controlOnly: false,
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
            tooltipPosition: position.height,
        }

        if ((position.top + position.height / 2) < window.innerHeight / 2) {
            newState.datePickerAlignment = 'bottom'
        } else {
            newState.datePickerAlignment = 'top'
        }

        this.setState(newState)
        this.listenDatePickerClick()
    }

    closeDatePicker = () => {
        this.setState({ datePickerOn: false })
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
        if (! this.state.datePickerOn) {
            this.setState({
                tooltipPosition: null,
            })
        }

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
     * Start listening to click events, if the user click out of the date picker,
     * then hide it.
     */
    listenDatePickerClick() {
        document.addEventListener('click', this.validateMousePosition)
    }

    /*
     * Stop listening to click events
     */

    stopListenDatePickerClick() {
        document.removeEventListener('click', this.validateMousePosition)
    }

    /*
     * Check if the mouse click is within the date picker or form-control area
     * If the mouse click is outside of the area, then we hide the date picker
     */

    validateMousePosition = (e) => {
        if (this.state.datePickerOn) {
            // Get the area covered by the date picker
            const pDP = this.datePicker.getBoundingClientRect()
            const pFC = this.formControl.getBoundingClientRect()

            // Get the position of the mouse
            const mouseX = e.clientX
            const mouseY = e.clientY

            if (pDP.left < mouseX && mouseX < pDP.right && pDP.top < mouseY && mouseY < pDP.bottom) {
                // mouse is within the date picker
                // do nothing, just handy to use the positive test to get our else condition
            } else if (pFC.left < mouseX && mouseX < pFC.right && pFC.top < mouseY && mouseY < pFC.bottom) {
                // mouse is within the form control div
                // also do nothing, but wait for it...
            } else {
                // mouse is both ouside of the date picker and the form control, hide the date picker
                this.closeDatePicker()
            }
        }
    }

    /*
     * Define the HTML for the field
     */
    render() {
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

        const control = (
            <div>
                <Label htmlFor={ inputId }>{ this.props.label }</Label>

                <div className={ controlClasses } ref={ this.storeFormControlRef }>
                    <input
                        className="form__text"
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
                </div>

                <SubHelp help={ this.props.subHelp } />
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <GroupError
                    error={ this.props.error }
                />

                { control }
            </div>
        )
    }
}
