import React, { Component } from 'react'
import classnames from 'classnames'

import { formControlPropTypes } from './Utils'

export default class Boolean extends Component {
    static propTypes = {
        ...formControlPropTypes,
    }

    _handleChange = (e) => {
        const value = (e.target.value === '1')

        this.props.updateValue({ [this.props.name]: value })
    }

    render() {
        let error = null

        if (this.props.error) {
            error = (
                <div className="alert alert--error">
                    { this.props.error }
                </div>
            )
        }

        return (
            <div
                className={ classnames({
                    'form__group': true,
                    'form__group--error': this.props.error,
                }) }
            >
                { error }

                <table className="table table--multipleyesno table--boolean">
                    <tbody>
                        <tr className="table-row">
                            <td className="table-cell"><label>{ this.props.label }</label></td>
                            <td className="table-cell" width="80">
                                <label htmlFor={ `${ this.props.name }-yes` }>
                                    <input
                                        checked={ this.props.value === true }
                                        id={ `${ this.props.name }-yes` }
                                        name={ `${ this.props.name }` }
                                        onChange={ this._handleChange }
                                        type="radio"
                                        value="1"
                                    />
                                    { 'Yes' }
                                </label>
                            </td>
                            <td className="table-cell" width="80">
                                <label htmlFor={ `${ this.props.name }-no` }>
                                    <input
                                        checked={ this.props.value === false }
                                        id={ `${ this.props.name }-no` }
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
    }
}
