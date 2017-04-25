import React, { Component } from 'react'
import classnames from 'classnames'

import { formControlPropTypes } from './Utils'

import GroupError from './Utils/GroupError'

export default class Boolean extends Component {
    static propTypes = {
        ...formControlPropTypes,
    }

    static defaultProps = {
        controlOnly: false,
        disabled: false,
    }

    _handleChange = (e) => {
        const value = (e.target.value === '1')

        this.props.updateValue({ [this.props.name]: value })
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--boolean',
        )

        const inputId = `${ this.props.name }-${ Math.floor(Math.random() * 10000) }`

        const control = (
            <div className={ controlClasses }>
                <table className="table table--boolean">
                    <tbody>
                        <tr className="table-row">
                            { this.props.label &&
                                <td className="table-cell">
                                    <label>{ this.props.label }</label>
                                </td>
                            }
                            <td className="table-cell" width="80">
                                <label htmlFor={ `${ inputId }-yes` }>
                                    <input
                                        checked={ this.props.value === true }
                                        disabled={ this.props.disabled }
                                        id={ `${ inputId }-yes` }
                                        name={ `${ this.props.name }` }
                                        onChange={ this._handleChange }
                                        type="radio"
                                        value="1"
                                    />
                                    { 'Yes' }
                                </label>
                            </td>
                            <td className="table-cell" width="80">
                                <label htmlFor={ `${ inputId }-no` }>
                                    <input
                                        checked={ this.props.value === false }
                                        disabled={ this.props.disabled }
                                        id={ `${ inputId }-no` }
                                        name={ `${ this.props.name }` }
                                        onChange={ this._handleChange }
                                        type="radio"
                                        value="0"
                                    />
                                    { 'No' }
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
