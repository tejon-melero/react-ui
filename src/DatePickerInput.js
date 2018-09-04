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
        dropdownAnchor: PropTypes.oneOf([ 'left', 'right' ]),
        dropdownDirection: PropTypes.oneOf([ 'down', 'up' ]),
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
        datePickerOn: false,
        datePickerVerticalAlignment: 'bottom',
        datePickerVerticalOffset: null,
    }

    inputId = this.props.id || generateId(this.props.name)

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
            newState.datePickerVerticalAlignment = 'bottom'
            newState.datePickerVerticalOffset = `calc(${ this.formControl.offsetTop + this.formControl.offsetHeight }px + 0.25rem)`
        } else {
            newState.datePickerVerticalAlignment = 'top'
            newState.datePickerVerticalOffset = `calc(100% - ${ this.formControl.offsetTop }px + 0.25rem)`
        }

        this.setState(newState)
        this.listenDatePickerClick()
    }

    closeDatePicker = () => {
        this.setState({ datePickerOn: false, datePickerVerticalOffset: null })
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
        this.updateValue(value && moment(value).format('YYYY-MM-DD'))
        this.closeDatePicker()
    }

    /*
     * Start listening to click events, if the user clicks out of the date picker, then hide it.
     */
    listenDatePickerClick() {
        document.addEventListener('click', this.handleGlobalClick)
    }

    /*
     * Stop listening to click events.
     */
    stopListenDatePickerClick() {
        document.removeEventListener('click', this.handleGlobalClick)
    }

    /*
     * Check if the element clicked on is within the form control's DOM tree. If
     * the mouse click is outside of the tree, then we hide the date picker.
     */
    handleGlobalClick = (e) => {
        if (this.state.datePickerOn && this.formControl) {
            if (! this.formControl.contains(e.target)) {
                this.closeDatePicker()
            }
        }
    }

    render() {
        const {
            dateFormat,
            disabled,
            dropdownAnchor,
            dropdownDirection,
            errors,
            extraGroupClasses,
            help,
            label,
            max,
            min,
            name,
            placeholder,
            prefix,
            required,
            suffix,
            value,
            weekDayStart,
        } = this.props

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': errors && errors.length,
        }, extraGroupClasses)

        const controlClasses = classnames({
            'form__control': true,
            'form__control--input': true,
            'form__control--input-addon': prefix || suffix,
            'form__control--date': true,
        })

        // Date picker container styles
        const datePickerStyles = {
            position: 'absolute',
            zIndex: '10000',
        }

        if (dropdownDirection === 'up') {
            datePickerStyles.bottom = '100%'
        } else {
            datePickerStyles.top = '100%'
        }

        if (dropdownAnchor === 'right') {
            datePickerStyles.right = 0
        } else {
            datePickerStyles.left = 0
        }

        return (
            <div className={ groupClasses }>
                <Label htmlFor={ this.inputId }>{ label }</Label>

                <div className={ controlClasses } ref={ this.storeFormControlRef } style={{ position: 'relative' }}>
                    <input
                        disabled={ disabled }
                        id={ this.inputId }
                        name={ name }
                        onBlur={ this.handleBlur }
                        onFocus={ this.handleFocus }
                        placeholder={ placeholder }
                        readOnly
                        ref={ this.storeTextInputRef }
                        required={ required }
                        type="text"
                        value={ value || '' }
                    />

                    { this.state.datePickerOn &&
                        <div ref={ this.storeDatePickerRef } style={ datePickerStyles }>
                            <DatePicker
                                date={ value && new Date(value) }
                                dateFormat={ dateFormat || null }
                                max={ max && new Date(max) }
                                min={ min && new Date(min) }
                                onChange={ this.handleDateChange }
                                weekDayStart={ weekDayStart || null }
                            />
                        </div>
                    }

                    { prefix && (
                        <div className="input-addon input-addon--prefix">
                            { prefix }
                        </div>
                    )}
                    { suffix && (
                        <div className="input-addon input-addon--suffix">
                            { suffix }
                        </div>
                    )}
                </div>

                <SubContent errors={ errors } help={ help } />
            </div>
        )
    }
}
