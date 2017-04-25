import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes } from './Utils'

import Label from './Label'
import SubHelp from './Utils/SubHelp'

export default class Checkbox extends Component {
    static propTypes = {
        ...formControlPropTypes,

        hidden: PropTypes.bool,
        value: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        disabled: false,
        hidden: false,
        value: false,
    }

    _handleChange = () => {
        this.props.updateValue({ [this.props.name]: ! this.props.value })
    }

    render() {
        const inputId = `${ this.props.name }-${ Math.floor(Math.random() * 10000) }`

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
                disabled={ this.props.disabled }
                id={ inputId }
                name={ this.props.name }
                onChange={ this._handleChange }
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
                    <Label for={ inputId }>
                        { field }
                        { this.props.label }
                    </Label>
                    <SubHelp help={ this.props.subHelp }/>
                </div>
            </div>
        )
    }
}
