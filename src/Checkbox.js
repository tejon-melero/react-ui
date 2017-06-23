import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes } from './Utils'

import GroupError from './Utils/GroupError'
import SubHelp from './Utils/SubHelp'

import Label from './Label'

export default class Checkbox extends Component {
    static propTypes = {
        ...formControlPropTypes,

        hidden: PropTypes.bool,
        value: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        controlOnly: false,
        disabled: false,
        hidden: false,
        value: false,
    }

    _handleChange = () => {
        this.props.updateValue({ [this.props.name]: ! this.props.value })
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--checkbox',
        )

        const inputId = `${ this.props.name }-${ Math.floor(Math.random() * 10000) }`

        const control = (
            <div className={ controlClasses }>
                <Label htmlFor={ inputId }>
                    <input
                        checked={ this.props.value }
                        className="form__checkbox"
                        disabled={ this.props.disabled }
                        id={ inputId }
                        name={ this.props.name }
                        onChange={ this._handleChange }
                        style={ (this.props.hidden && ({ position: 'absolute', top: '-9999px', left: '-9999px' }) || null) }
                        type="checkbox"
                        value={ 1 }
                    />
                    { ' ' }
                    { this.props.label }
                </Label>
                <SubHelp help={ this.props.subHelp }/>
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <GroupError error={ this.props.error } />

                { control }
            </div>
        )
    }
}
