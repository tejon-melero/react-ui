import React, { Component } from 'react'
import classnames from 'classnames'

import { formControlPropTypes, generateId } from './Utils'

import SubContent from './Utils/SubContent'

import Label from './Label'

export default class Boolean extends Component {
    static propTypes = {
        ...formControlPropTypes,
    }

    static defaultProps = {
        disabled: false,
    }

    _handleChange = (e) => {
        const value = (e.target.value === '1')

        this.props.updateValue({ [this.props.name]: value })
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        }, this.props.extraGroupClasses)

        const controlClasses = classnames(
            'form__control',
            'form__control--radio',
            'form__control--inline',
        )

        const inputId = generateId(this.props.name)

        return (
            <div className={ groupClasses }>
                <Label>{ this.props.label }</Label>

                <div className={ controlClasses }>
                    <ul>
                        <li>
                            <input
                                checked={ this.props.value === true }
                                disabled={ this.props.disabled }
                                id={ `${ inputId }-yes` }
                                name={ this.props.name }
                                onChange={ this._handleChange }
                                type="radio"
                                value="1"
                            />
                            <label className="form__option-label" htmlFor={ `${ inputId }-yes` }>
                                Yes
                            </label>
                        </li>
                        <li>
                            <input
                                checked={ this.props.value === false }
                                disabled={ this.props.disabled }
                                id={ `${ inputId }-no` }
                                name={ this.props.name }
                                onChange={ this._handleChange }
                                type="radio"
                                value="0"
                            />
                            <label className="form__option-label" htmlFor={ `${ inputId }-no` }>
                                No
                            </label>
                        </li>
                    </ul>
                </div>

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
