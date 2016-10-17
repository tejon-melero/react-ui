import React, { Component } from 'react'
import Select from './select'

class MultipleSelect extends Component {
    constructor(props) {
        super(props)

        // Add support for options added via search function
        // When a user amend the search criteria in the select component, the
        // option list will change, meaning there wouldn't be an option to match
        // the currently selected value. To avoid that issue, we build a cached
        // list of all the options currently added to the selected list
        this.cachedOptions = []
        this._updateValue = this._updateValue.bind(this)
    }

    /*
     * Override the update value from "select"
     */
    _updateValue(data, cb) {
        for (const key in data) {
            this._updateValueSingle(key, data[key], cb)
        }
    }

    _updateValueSingle(key, value, cb) {
        if (value) {
            // Create a copy of props.value
            const newValue = [ ...this.props.value ]

            newValue.push(value)

            this.props.updateValue({ [this.props.name]: newValue }, cb)

            const newOption = this._getOption(value)

            if (newOption) {
                this.cachedOptions.push(newOption)
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
        const optionList = [ ...this.cachedOptions, ...this.props.options ]

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
                            &times;
                        </a>
                    </div>
                )
            )
        }
        return (
            <div className={ this.props.class }>
                <Select
                    assignValue={ this.props.assignValue }
                    class={ this.props.class }
                    defaultOptions={ this.props.defaultOptions }
                    error={ this.props.error }
                    handleBlur={ this.props.handleBlur }
                    handleFocus={ this.props.handleFocus }
                    help={ this.props.help }
                    label={ this.props.label }
                    name={ this.props.name }
                    noOptionPlaceholder={ this.props.noOptionPlaceholder }
                    noResultsPlaceholder={ this.props.noResultsPlaceholder }
                    options={ this._getOptions(false) }
                    placeholder={ this.props.placeholder }
                    searchOptions={ this.props.searchOptions }
                    searchingPlaceholder={ this.props.searchingPlaceholder }
                    updateValue={ this._updateValue }
                    value={ this.props.value }
                />
                { selectedItem }
            </div>
        )
    }
}

MultipleSelect.propTypes = {
    assignValue: React.PropTypes.func,
    class: React.PropTypes.string,
    defaultOptions: React.PropTypes.array,
    error: React.PropTypes.array,
    handleBlur: React.PropTypes.func,
    handleFocus: React.PropTypes.func,
    help: React.PropTypes.string,
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    noOptionPlaceholder: React.PropTypes.string,
    noResultsPlaceholder: React.PropTypes.string,
    options: React.PropTypes.array,
    placeholder: React.PropTypes.string,
    searchOptions: React.PropTypes.func,
    searchingPlaceholder: React.PropTypes.string,
    updateValue: React.PropTypes.func,
    value: React.PropTypes.array,
}

export default MultipleSelect
