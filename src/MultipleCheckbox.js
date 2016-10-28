import React, { Component } from 'react'

import { formControlPropTypes, hasOptionsPropTypes } from './Utils'

import Checkbox from './Checkbox'

export default class MultipleCheckbox extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
    }

    static defaultProps = {
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

    _getCurrentValue = (key) => {
        if (this.props.value) {
            for (const k of this.props.value) {
                if (key === k) {
                    return true
                }
            }
        }

        return false
    }

    render() {
        let optionList = null

        if (this.props.options) {
            optionList = this.props.options.map(
                (option) => (
                    <Checkbox
                        key={ option.value }
                        label={ option.label }
                        name={ option.value }
                        updateValue={ this._onOptionSelect }
                        value={ this._getCurrentValue(option.value) }
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

        return (<div>{ error }{ optionList }</div>)
    }
}
