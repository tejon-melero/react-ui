import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import moment from 'moment'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import FieldError from './Utils/FieldError'
import Help from './Utils/Help'
import SubHelp from './Utils/SubHelp'

import Label from './Label'

const emailRegex = /^\w+@\w+\.[a-z.]+$/

export default class TextInput extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        max: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        min: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        onKeyPress: PropTypes.func,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        rows: PropTypes.number,
        step: PropTypes.number,
        success: PropTypes.bool,
        type: PropTypes.string, // oneOf?
        updateValueOnBlur: PropTypes.bool,
    }

    static defaultProps = {
        controlOnly: false,
        disabled: false,
        placeholder: '',
        rows: 6,
        type: 'text',
        updateValueOnBlur: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            showTooltip: false,
            tooltipPosition: null,
            value: props.value || '',
        }
    }

    /*
     * If props gets updated we change the state value
     */
    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value || '',
            })
        }
    }

    textInput = null

    storeTextInputRef = (ref) => {
        this.textInput = ref

        if (this.props.innerRef) {
            this.props.innerRef(ref)
        }
    }

    updateValue(value) {
        if (value !== this.props.value) {
            this.props.updateValue({ [this.props.name]: value })
        }
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

        this.setState({ value })

        if (! this.props.updateValueOnBlur) {
            this.updateValue(value)
        }
    }

    /*
     * Handle focus
     */
    handleFocus = () => {
        const position = this.refs.formControl.getBoundingClientRect()
        const tooltipPosition = position.height

        this.setState({
            showTooltip: true,
            tooltipPosition,
        })

        this.props.handleFocus && this.props.handleFocus()
    }

    /*
     * Handle blur
     */
    handleBlur = () => {
        if (this.props.updateValueOnBlur) {
            this.updateValue(this.state.value)
        }

        this.props.handleBlur && this.props.handleBlur()
    }

    /*
     * Validate email
     */
    _isEmailValid(value) {
        return emailRegex.test(value)
    }

    /*
     * Define the HTML for the field
     */
    render() {
        const value = this.state.value
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
                    ref={ this.storeTextInputRef }
                    required={ this.props.required }
                    rows={ this.props.rows }
                    type={ this.props.type }
                    value={ value }
                />
            )
        } else {
            let type = this.props.type

            field = (
                <input
                    className="form__text"
                    disabled={ this.props.disabled }
                    id={ inputId }
                    max={ this.props.max }
                    min={ this.props.min }
                    name={ this.props.name }
                    onBlur={ this.handleBlur }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onKeyPress={ this.props.onKeyPress }
                    placeholder={ this.props.placeholder }
                    ref={ this.storeTextInputRef }
                    required={ this.props.required }
                    step={ this.props.step }
                    type={ type }
                    value={ value }
                />
            )
        }

        helpUI = (
            <Help
                help={ this.props.help }
                on={ this.state.showTooltip && ! this.props.error }
                position={ this.state.tooltipPosition }
            />
        )

        const control = (
            <div>
                <Label for={ inputId }>{ this.props.label }</Label>

                <div className={ controlClasses } ref="formControl">
                    <FieldError
                        error={ this.props.error }
                        on={ this.state.showTooltip }
                        position={ this.state.tooltipPosition }
                    />
                    { field }
                    { helpUI }
                </div>

                <SubHelp help={ this.props.subHelp } />
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                { control }
            </div>
        )
    }
}
