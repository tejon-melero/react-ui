import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import Label from './Label'
import SubHelp from './SubHelp'

export default class Checkbox extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        hidden: PropTypes.bool,
        value: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        hidden: false,
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
                style={
                    this.props.hidden ?
                        { position: 'absolute', top: '-9999px', left: '-9999px' } :
                        null
                }
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
