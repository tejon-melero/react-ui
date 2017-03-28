import React, { Component, PropTypes } from 'react'

import { formControlPropTypes, hasOptionsPropTypes } from './Utils'

export default class MultipleYesNo extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
    }

    constructor(props) {
        super(props)

        this.state = { data: props.value }
    }

    _onOptionSelect = (data) => {
        const newData = { ...this.state.data }

        for (const key in data) {
            newData[key] = data[key]
        }

        this.setState({ data: newData }, () => {
            this.props.updateValue({ [this.props.name]: newData })
        })
    }

    _getCurrentValue = (key) => {
        if (this.props.value) {
            for (const k in this.props.value) {
                if (key === k) {
                    return this.props.value[k]
                }
            }
        }

        return null
    }

    render() {
        let optionList = null

        if (this.props.options) {
            optionList = this.props.options.map(
                (option) => (
                    <Option
                        currentValue={ this._getCurrentValue(option.value) }
                        key={ option.value }
                        onSelect={ this._onOptionSelect }
                        option={ option }
                    />
                )
            )
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

                <table className="table table--multipleyesno"><tbody>{ optionList }</tbody></table>
            </div>
        )
    }
}

class Option extends Component {
    static propTypes = {
        currentValue: PropTypes.number.isRequired,
        onSelect: PropTypes.func.isRequired,
        option: PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.node.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props)

        this._handleChange = this._handleChange.bind(this)
    }

    _handleChange(e) {
        const value = e.target.value

        this.props.onSelect({ [this.props.option.value]: value })
    }

    render() {
        return (
            <tr className="table-row">
                <td className="table-cell">{ this.props.option.label }</td>
                <td className="table-cell">
                    <label>
                        <input
                            checked={ this.props.currentValue === '1' }
                            name={ this.props.option.value }
                            onChange={ this._handleChange }
                            type="radio"
                            value="1"
                        />
                        { 'Yes' }
                    </label>
                </td>
                <td className="table-cell">
                    <label>
                        <input
                            checked={ this.props.currentValue === '2' }
                            name={ this.props.option.value }
                            onChange={ this._handleChange }
                            type="radio"
                            value="2"
                        />
                        { 'No' }
                    </label>
                </td>
            </tr>
        )
    }
}
