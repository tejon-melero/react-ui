import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, hasOptionsPropTypes } from './Utils'

import GroupError from './Utils/GroupError'

export default class MultipleYesNo extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
    }

    static defaultProps = {
        controlOnly: false,
        disabled: false,
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
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--multiple',
            'form__control--boolean',
        )

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

        const control = (
            <div className={ controlClasses }>
                <table className="table table--multipleyesno">
                    <tbody>
                        { optionList }
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

class Option extends Component {
    static propTypes = {
        currentValue: PropTypes.number.isRequired,
        disabled: PropTypes.bool,
        onSelect: PropTypes.func.isRequired,
        option: PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.node.isRequired,
        }).isRequired,
    }

    static defaultProps = {
        disabled: false,
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
                            disabled={ this.props.disabled }
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
                            disabled={ this.props.disabled }
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
