import React, { Component } from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import SubHelp from './subhelp'

class Checkbox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: props.value,
        }

        this._handleChange = this._handleChange.bind(this)
        this._handleFocus = this._handleFocus.bind(this)
        this._handleBlur = this._handleBlur.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
        })
    }

    _handleChange(e) {
        let value = true

        if (e.target.value === 'true') {
            value = false
        }

        this.setState({
            value,
        })

        this.props.updateValue({ [this.props.name]: value })
    }

    _handleFocus() {
        this.props.handleFocus && this.props.handleFocus()
    }

    _handleBlur() {
        this.props.handleBlur && this.props.handleBlur()
    }

    render() {
        const value = this.state.value
        const input_id = `id_${ this.props.name }`

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames({
            'form__control': true,
            'form__control--checkbox': true,
        })

        const field = (
            <input
                checked={ value === true }
                className="form__checkbox"
                id={ input_id }
                name={ this.props.name }
                onBlur={ this._handleBlur }
                onChange={ this._handleChange }
                onFocus={ this._handleFocus }
                ref="input"
                type="checkbox"
                value={ value }
            />
        )

        return (
            <div className={ groupClasses }>
                <FieldError error={ this.props.error }
                    on={ this.state.showTooltip }
                    position={ this.state.tooltipPosition }
                />
                <div className={ controlClasses } ref="form-control">
                    <Label for={ input_id }>
                        { field }
                        { this.props.label }
                    </Label>
                    <SubHelp help={ this.props.help }/>
                </div>
            </div>
        )
    }
}

Checkbox.defaultProps = {
    error: null,
    help: null,
    initial: '',
    label: null,
    name: null,
    updateValue: () => {},
    value: false,
}

export default Checkbox
