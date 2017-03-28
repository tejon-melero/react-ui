import React, { Component, PropTypes } from 'react'

import { formControlPropTypes, hasOptionsPropTypes } from './Utils'

import Checkbox from './Checkbox'

export default class MultipleCheckbox extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,

        columns: PropTypes.number,
    }

    static defaultProps = {
        columns: 1,
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
        const columnisedOptionsList = []

        let optionList = []

        if (this.props.options) {
            optionList = this.props.options.map(
                (option) => (
                    <Checkbox
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

        let error = null

        if (this.props.error) {
            error = (
                <div className="alert alert--error">
                    { this.props.error }
                </div>
            )
        }

        return (
            <div>
                { error }

                <table width="100%">
                    <tbody>
                        <tr>
                            { columnisedOptionsList.map((column, index) => (
                                <td key={ `column-${ index }` }>{ column }</td>
                            )) }
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
