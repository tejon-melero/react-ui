import React, { Component } from 'react'

/*
 * A list of Yes/No options
 */

class MultipleYesNo extends Component {
    constructor(props) {
        super(props)

        let data = {}

        if (props.value) {
            data = props.value
        }

        this.state = { data }

        this._onOptionSelect = this._onOptionSelect.bind(this)
        this._getCurrentValue = this._getCurrentValue.bind(this)
    }

    _onOptionSelect(data) {
        const newData = { ...this.state.data }

        for (const key in data) {
            newData[key] = data[key]
        }

        this.setState({ data: newData }, () => {
            this.props.updateValue({ [this.props.name]: this.state.data })
        })
    }

    _getCurrentValue(key) {
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
                    <label htmlFor={ `${ this.props.option.value }-YES` }>
                        <input
                            checked={ this.props.currentValue === '1' }
                            id={ `${ this.props.option.value }-YES` }
                            name={ `${ this.props.option.value }` }
                            onChange={ this._handleChange }
                            type="radio"
                            value="1"
                        />
                        Yes
                    </label>
                </td>
                <td className="table-cell">
                    <label htmlFor={ `${ this.props.option.value }-NO` }>
                        <input
                            checked={ this.props.currentValue === '2' }
                            id={ `${ this.props.option.value }-NO` }
                            name={ `${ this.props.option.value }` }
                            onChange={ this._handleChange }
                            type="radio"
                            value="2"
                        />
                        No
                    </label>
                </td>
            </tr>)
    }
}

export default MultipleYesNo
