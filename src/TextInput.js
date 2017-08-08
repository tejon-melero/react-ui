import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

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

        autoFocus: PropTypes.bool,
        helpOnFocus: PropTypes.bool,
        helpOnHover: PropTypes.bool,
        innerRef: PropTypes.func,
        max: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        min: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        onKeyPress: PropTypes.func,
        placeholder: PropTypes.string,
        required: PropTypes.bool,
        rows: PropTypes.number,
        step: PropTypes.number,
        success: PropTypes.bool,
        type: PropTypes.string,
        updateValueOnBlur: PropTypes.bool,
    }

    static defaultProps = {
        autoFocus: false,
        controlOnly: false,
        disabled: false,
        helpOnFocus: true,
        helpOnHover: false,
        placeholder: '',
        rows: 6,
        type: 'text',
        updateValueOnBlur: true,
    }

    constructor(props) {
        super(props)

        this.state = {
            focussed: false,
            hovering: false,
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
    formControl = null

    storeTextInputRef = (ref) => {
        this.textInput = ref

        if (this.props.innerRef) {
            this.props.innerRef(ref)
        }
    }

    storeFormControlRef = (ref) => {
        this.formControl = ref

        let tooltipPosition = null

        if (ref) {
            tooltipPosition = ref.getBoundingClientRect().height
        }

        this.setState({ tooltipPosition })
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
        this.setState({
            focussed: true,
        })

        this.props.handleFocus && this.props.handleFocus()
    }

    /*
     * Handle blur
     */
    handleBlur = () => {
        this.setState({
            focussed: false,
        })

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

    handleMouseOver = () => {
        if (this.props.helpOnHover) {
            this.setState({ hovering: true })
        }
    }

    handleMouseOut = () => {
        if (this.props.helpOnHover) {
            this.setState({ hovering: false })
        }
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
                    autoFocus={ this.props.autoFocus }
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
            field = (
                <input
                    autoFocus={ this.props.autoFocus }
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
                    type={ this.props.type }
                    value={ value }
                />
            )
        }

        helpUI = (
            <Help
                help={ this.props.help }
                on={
                    ! this.props.error &&
                    (
                        (this.props.helpOnFocus && this.state.focussed) ||
                        (this.props.helpOnHover && this.state.hovering)
                    )
                }
                position={ this.state.tooltipPosition }
            />
        )

        const control = (
            <div onMouseOut={ this.handleMouseOut } onMouseOver={ this.handleMouseOver }>
                <Label htmlFor={ inputId }>{ this.props.label }</Label>

                <div className={ controlClasses } ref={ this.storeFormControlRef }>
                    <FieldError
                        error={ this.props.error }
                        on={
                            (this.props.helpOnFocus && this.state.focussed) ||
                            (this.props.helpOnHover && this.state.hovering)
                        }
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
