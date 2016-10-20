import React, { Component, PropTypes } from 'react'

import { formControlPropTypes, hasOptionsPropTypes, focussablePropTypes } from './Utils'

import Select from './select'

export default class MultipleSelect extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,
        ...hasOptionsPropTypes,

        class: PropTypes.string,
        defaultOptions: PropTypes.array,
        getFilteredOptions: PropTypes.func,
        minCharSearch: PropTypes.number,
        noOptionPlaceholder: PropTypes.string,
        noResultsPlaceholder: PropTypes.string,
        placeholder: PropTypes.string,
        searchOptions: PropTypes.func,
        searchingPlaceholder: PropTypes.string,
        type: PropTypes.string,
    }

    state = {
        cachedOptions: [],
    }

    /*
     * Override the update value from "select"
     */
    _updateValue = (data, cb) => {
        for (const key in data) {
            this._updateValueSingle(key, data[key], cb)
        }
    }

    _updateValueSingle(key, value, cb) {
        if (value) {
            // Create a copy of props.value
            const newValue = [ ...this.props.value ]

            // And add the new value to it
            newValue.push(value)

            this.props.updateValue({ [this.props.name]: newValue }, cb)

            // Now add the value as an option to our list of cached options
            const newOption = this._getOption(value)

            if (newOption) {
                this.setState((state) => {
                    return {
                        cachedOptions: [
                            ...state.cachedOptions,
                            newOption,
                        ],
                    }
                })
            }
        }
    }

    /*
     * Get an option given a value
     */
    _getOption(value) {
        for (const option of this.props.options) {
            if (option.value === value) {
                return option
            }
        }

        return null
    }

    /*
     * Create a list of options with or without being tagged
     */
    _getOptions(tagged) {
        const options = []
        const optionValues = []
        const optionList = [ ...this.state.cachedOptions, ...this.props.options ]

        for (const option of optionList) {
            // Add the option if it's tagged
            if (tagged === true && this.props.value.indexOf(option.value) !== -1) {
                // Avoid duplicates
                if (optionValues.indexOf(option.value) === -1) {
                    options.push(option)
                    optionValues.push(option.value)
                }
            } else if (tagged === false && this.props.value.indexOf(option.value) === -1) {
                // Avoid duplicates
                if (optionValues.indexOf(option.value) === -1) {
                    options.push(option)
                    optionValues.push(option.value)
                }
            }
        }

        return options
    }

    /*
     * Clear a new value list without the submitted option
     */
    _clearOption(option, e) {
        e.preventDefault()

        const newValue = []

        for (const opt of this.props.value) {
            if (opt !== option.value) {
                newValue.push(opt)
            }
        }

        this.props.updateValue({ [this.props.name]: newValue })
    }

    render() {
        let selectedItem = null

        if (this.props.value.length) {
            selectedItem = this._getOptions(true).map(
                (option, index) => (
                    <div className="tag" key={ index }>
                        { option.label }
                        <a
                            className="tag__clear"
                            href="#"
                            onClick={ this._clearOption.bind(this, option) }
                        >
                            { '×' }
                        </a>
                    </div>
                )
            )
        }
        return (
            <div className={ this.props.class }>
                <Select
                    class={ this.props.class }
                    defaultOptions={ this.props.defaultOptions }
                    error={ this.props.error }
                    getFilteredOptions={ this.props.getFilteredOptions }
                    handleBlur={ this.props.handleBlur }
                    handleFocus={ this.props.handleFocus }
                    help={ this.props.help }
                    label={ this.props.label }
                    minCharSearch={ this.props.minCharSearch }
                    name={ this.props.name }
                    noOptionPlaceholder={ this.props.noOptionPlaceholder }
                    noResultsPlaceholder={ this.props.noResultsPlaceholder }
                    options={ this._getOptions(false) }
                    placeholder={ this.props.placeholder }
                    searchOptions={ this.props.searchOptions }
                    searchingPlaceholder={ this.props.searchingPlaceholder }
                    type={ this.props.type }
                    updateValue={ this._updateValue }
                    value={ this.props.value }
                />
                { selectedItem }
            </div>
        )
    }
}
