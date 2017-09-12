import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, hasOptionsPropTypes } from './Utils'

import SubContent from './Utils/SubContent'

import Checkbox from './Checkbox'
import Label from './Label'

export default class MultipleCheckbox extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,

        columns: PropTypes.number,
    }

    static defaultProps = {
        columns: 1,
        disabled: false,
    }

    _onOptionSelect = (data) => {
        const newData = [ ...this.props.value ]

        for (const key in data) {
            // if we're "setting" the value...
            if (data[key] === true) {
                // if it doesn't exist already, add it in
                if (newData.indexOf(key) === -1) {
                    newData.push(key)
                }
            } else {
                // we're "unsetting" the value...
                const index = newData.indexOf(key)

                // if the item does exist, remove it
                if (index !== -1) {
                    newData.splice(index, 1)
                }
            }
        }

        this.props.updateValue({ [this.props.name]: newData })
    }

    _optionSelected = (value) => {
        return this.props.value.some((item) => item === value)
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        })

        const columnisedOptionsList = []

        let optionList = []

        if (this.props.options) {
            optionList = this.props.options.map(
                (option) => (
                    <Checkbox
                        disabled={ this.props.disabled }
                        key={ option.value }
                        label={ option.label }
                        name={ option.value }
                        updateValue={ this._onOptionSelect }
                        value={ this._optionSelected(option.value) }
                    />
                )
            )
        }

        if (this.props.columns > 1) {
            const minPerColumn = Math.floor(optionList.length / this.props.columns)
            const remainder = optionList.length % this.props.columns
            let extra = 0

            for (let i = 0; i < this.props.columns; i++) {
                const columnExtra = (i < remainder) ? 1 : 0

                columnisedOptionsList.push(optionList.slice(
                    (i * minPerColumn) + extra,
                    ((i + 1) * minPerColumn) + extra + columnExtra)
                )

                extra += columnExtra
            }
        } else {
            columnisedOptionsList.push(optionList)
        }

        return (
            <div className={ groupClasses }>
                <Label>{ this.props.label }</Label>

                <div className="form__control">
                    <table width="100%">
                        <tbody>
                            <tr>
                                { columnisedOptionsList.map((column, index) => (
                                    <td key={ index }>{ column }</td>
                                )) }
                            </tr>
                        </tbody>
                    </table>
                </div>

                <SubContent errors={ this.props.errors } />
            </div>
        )
    }
}
