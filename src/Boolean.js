import React, { Component } from 'react'
import classnames from 'classnames'

import { formControlPropTypes, generateId } from './Utils'

import SubContent from './Utils/SubContent'

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
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--boolean',
        )

        const inputId = generateId(this.props.name)

        return (
            <div className={ groupClasses }>
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

                    <SubContent errors={ this.props.errors } help={ this.props.help } />
                </div>
            </div>
        )
    }
}
