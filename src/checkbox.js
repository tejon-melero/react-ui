import React, { Component } from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'

class Checkbox extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: props.value
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value
        })
    }

    render() {
        let value = this.state.value
        let input_id = `id_${this.props.name}`

        let groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        let controlClasses = classnames({
            'form__control': true,
            'form__control--checkbox': true
        })

        let field = (
            <input
                ref="input"
                id={ input_id }
                className="form__checkbox"
                type="checkbox"
                value={ value }
                checked={ value == true }
                name={ this.props.name }
                onChange={ this.handleChange }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
            />
        )

        return (
            <div className={ groupClasses }>
                <FieldError error={ this.props.error }
                    on={ this.state.showTooltip }
                    position={ this.state.tooltipPosition } />
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

    handleChange(e) {
        let value = true

        if (e.target.value === 'true') {
            value = false
        }

        this.setState({
            value: value
        })

        this.props.updateValue(this.props.name, value)
    }

    handleFocus(e) {
        if (this.props.handleFocus) {
            this.props.handleFocus()
        }
    }

    handleBlur(e) {
        if (this.props.handleBlur) {
            this.props.handleBlur()
        }
    }

}

Checkbox.defaultProps = {
    name: null,
    label: null,
    value: false,
    help: null,
    error: null,
    initial: '',
    updateValue: (name, value) => { return }
}

export default Checkbox
