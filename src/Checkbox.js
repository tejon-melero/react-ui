import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, generateId } from './Utils'

import Label from './Label'

export default class Checkbox extends Component {
    static propTypes = {
        disabled: formControlPropTypes.disabled,
        hidden: PropTypes.bool,
        id: PropTypes.string,
        label: formControlPropTypes.label,
        name: formControlPropTypes.name,
        updateValue: formControlPropTypes.updateValue,
        value: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        disabled: false,
        hidden: false,
        value: false,
    }

    inputId = this.props.id || generateId(this.props.name)

    handleChange = () => {
        // Tell parent to update value with whatever the opposite of the current value is.
        this.props.updateValue({ [this.props.name]: ! this.props.value })
    }

    render() {
        const { disabled, hidden, label, name, value } = this.props

        const inputClasses = classnames({
            'form__checkbox': true,
            'sr-only': hidden,
        })

        return (
            <Label htmlFor={ this.inputId }>
                <input
                    checked={ value }
                    className={ inputClasses }
                    disabled={ disabled }
                    id={ this.inputId }
                    name={ name }
                    onChange={ this.handleChange }
                    type="checkbox"
                    value={ 1 }
                />
                { ' ' }
                { label }
            </Label>
        )
    }
}
