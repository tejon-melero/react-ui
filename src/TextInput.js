import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, focussablePropTypes, generateId } from './Utils'

import SubContent from './Utils/SubContent'

import Label from './Label'

export default class TextInput extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        autoFocus: PropTypes.bool,
        controlClassName: PropTypes.string,
        controlOnly: PropTypes.bool,
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
        placeholder: '',
        rows: 6,
        type: 'text',
        updateValueOnBlur: true,
    }

    state = {
        focussed: false,
        tooltipPosition: null,
        value: this.props.value || '',
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                value: nextProps.value || '',
            })
        }
    }

    handleChange = (e) => {
        const value = e.target.value

        this.setState({ value })

        if (! this.props.updateValueOnBlur) {
            this.updateValue(value)
        }
    }

    updateValue(value) {
        if (value !== this.props.value) {
            this.props.updateValue({ [this.props.name]: value })
        }
    }

    handleFocus = () => {
        this.setState({ focussed: true })

        this.props.handleFocus && this.props.handleFocus()
    }

    handleBlur = () => {
        this.setState({ focussed: false })

        if (this.props.updateValueOnBlur) {
            this.updateValue(this.state.value)
        }

        this.props.handleBlur && this.props.handleBlur()
    }

    render() {
        const {
            autoFocus,
            disabled,
            controlClassName,
            controlOnly,
            errors,
            help,
            label,
            max,
            min,
            name,
            onKeyPress,
            placeholder,
            required,
            rows,
            step,
            success,
            type,
        } = this.props

        const { value } = this.state

        const inputId = generateId(name)

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': errors && errors.length,
            'form__group--success': success,
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--input',
            controlClassName,
            {
                'form__control--input-addon': this.props.prefix || this.props.suffix,
            }
        )

        let field = null

        if (type === 'textarea') {
            field = (
                <textarea
                    autoFocus={ autoFocus }
                    className="form__text form__textarea"
                    disabled={ disabled }
                    id={ inputId }
                    name={ name }
                    onBlur={ this.handleBlur }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onKeyPress={ onKeyPress }
                    placeholder={ placeholder }
                    ref={ this.storeTextInputRef }
                    required={ required }
                    rows={ rows }
                    type={ type }
                    value={ value }
                />
            )
        } else {
            field = (
                <input
                    autoFocus={ autoFocus }
                    className="form__text"
                    disabled={ disabled }
                    id={ inputId }
                    max={ max }
                    min={ min }
                    name={ name }
                    onBlur={ this.handleBlur }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onKeyPress={ onKeyPress }
                    placeholder={ placeholder }
                    ref={ this.storeTextInputRef }
                    required={ required }
                    step={ step }
                    type={ type }
                    value={ value }
                />
            )
        }

        const control = (
            <div className={ controlClasses }>
                { field }

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
        )

        if (controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <Label htmlFor={ inputId }>{ label }</Label>

                { control }

                <SubContent errors={ errors } help={ help } />
            </div>
        )
    }
}
