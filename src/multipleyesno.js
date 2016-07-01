import React, { Component } from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'

/*
 * A list of Yes/No options
 */
class MultipleYesNo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {}
        }

        if (props.value) {
            this.state.data = props.value
        } else {
            this.state.data = {}
        }

        this._onOptionSelect = this._onOptionSelect.bind(this)
        this._getCurrentValue = this._getCurrentValue.bind(this)
    }

    _onOptionSelect(key, value) {
        let data = Object.assign({}, this.state.data)
        data[key] = value

        this.setState({ data }, () => {
            this.props.updateValue(this.props.name, this.state.data)
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
            optionList = this.props.options.map((option) => {
                return (
                    <Option
                        option={ option }
                        key={ option.value }
                        onSelect={ this._onOptionSelect }
                        currentValue={ this._getCurrentValue(option.value) }
                    />
                )
            })
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
                {error}
                <table className="table table--multipleyesno"><tbody>{ optionList }</tbody></table>
            </div>
        )
    }
}

class Option extends Component {
    constructor(props) {
        super(props)
    }

    _handleChange = (e) => {
        let value = e.target.value
        this.props.onSelect(this.props.option.value, value)
    }

    render() {
        return (
            <tr className="table-row">
                <td className="table-cell">{ this.props.option.label }</td>
                <td className="table-cell">
                    <label htmlFor={ `${this.props.option.value}-YES` }>
                        <input
                            type="radio"
                            value="1"
                            id={ `${this.props.option.value}-YES` }
                            name={ `${this.props.option.value}` }
                            onChange={ this._handleChange }
                            checked={ this.props.currentValue === "1" }
                            />
                        Yes
                    </label>
                </td>
                <td className="table-cell">
                    <label htmlFor={ `${this.props.option.value}-NO` }>
                        <input
                            type="radio"
                            value="2"
                            id={ `${this.props.option.value}-NO` }
                            name={ `${this.props.option.value}` }
                            onChange={ this._handleChange }
                            checked={ this.props.currentValue === "2" }
                            />
                        No
                    </label>
                </td>
            </tr>
        )
    }
}

export default MultipleYesNo
