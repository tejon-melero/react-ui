import React, { Component, PropTypes } from 'react'

import classnames from 'classnames'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import Label from './label'
import SubHelp from './subhelp'

export default class Checkbox extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        value: PropTypes.bool.isRequired,
    }

    _handleChange = () => {
        this.props.updateValue({ [this.props.name]: ! this.props.value })
    }

    _handleFocus = () => {
        this.props.handleFocus && this.props.handleFocus()
    }

    _handleBlur = () => {
        this.props.handleBlur && this.props.handleBlur()
    }

    render() {
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
                checked={ this.props.value }
                className="form__checkbox"
                id={ input_id }
                name={ this.props.name }
                onBlur={ this._handleBlur }
                onChange={ this._handleChange }
                onFocus={ this._handleFocus }
                type="checkbox"
                value={ 1 }
            />
        )

        return (
            <div className={ groupClasses }>
                <div className={ controlClasses }>
                    <Label for={ input_id }>
                        { field }
                        { this.props.label }
                    </Label>
                    <SubHelp help={ this.props.subHelp }/>
                </div>
            </div>
        )
    }
}
