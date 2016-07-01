import React, { Component } from 'react'
import Select from './select'

class MultipleSelect extends Component {
    constructor(props) {
        super(props)

        // Add support for options added via search function
        // When a user amends the search criteria in the select component, the
        // option list will change, meaning there wouldn't be an option to match
        // the currently selected value. To avoid that issue, we build a cached
        // list of all the options currently added to the selected list
        this.cachedOptions = []
    }

    /*
     * Override the update value from "select"
     */
    _updateValue = (name, value) => {
        if (value) {
            // Create a copy of props.value
            let newValue = [].concat(this.props.value)
            newValue.push(value)

            this.props.updateValue(this.props.name, newValue)

            let newOption = this._getOption(value)
            if (newOption) {
                this.cachedOptions.push(newOption)
            }
        }
    }

    /*
     * Get an option given a value
     */
    _getOption(value) {
        for (let option of this.props.options) {
            if (option.value === value) {
                return option
            }
        }
    }

    /*
     * Create a list of options with or without being tagged
     */
    _getOptions(tagged) {
        let options = []
        let optionValues = []
        let optionList = this.cachedOptions.concat(this.props.options)

        for (let option of optionList) {
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

        let newValue = []

        for (let opt of this.props.value) {
            if (opt !== option.value) {
                newValue.push(opt)
            }
        }

        this.props.updateValue(this.props.name, newValue)
    }

    render() {
        let selectedItem = null

        if (this.props.value.length) {
            let inc = 0

            selectedItem = this._getOptions(true).map((option) => {
                inc++
                return (
                    <div key={ inc } className="tag">
                        { option.label }
                        <a
                            href="#"
                            className="tag__clear"
                            onClick={ this._clearOption.bind(this, option) }>
                            &times;
                        </a>
                    </div>
                )
            })
        }
        return (
            <div className={ this.props.class }>
                <Select
                    name={ this.props.name }
                    label={ this.props.label }
                    value={ this.props.value }
                    help={ this.props.help }
                    placeholder={ this.props.placeholder }
                    noOptionPlaceholder={ this.props.noOptionPlaceholder }
                    noResultsPlaceholder={ this.props.noResultsPlaceholder }
                    searchingPlaceholder={ this.props.searchingPlaceholder }
                    class={ this.props.class }
                    updateValue={ this._updateValue }
                    error={ this.props.error }
                    options={ this._getOptions(false) }
                    searchOptions={ this.props.searchOptions }
                    defaultOptions={ this.props.defaultOptions }
                    assignValue={ this.props.assignValue }
                    handleFocus={ this.props.handleFocus}
                    handleBlur={ this.props.handleBlur }
                />
                { selectedItem }
            </div>
        )
    }
}

MultipleSelect.propTypes = {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    help: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    noOptionPlaceholder: React.PropTypes.string,
    noResultsPlaceholder: React.PropTypes.string,
    searchingPlaceholder: React.PropTypes.string,
    class: React.PropTypes.string,

    error: React.PropTypes.array,
    options: React.PropTypes.array,
    defaultOptions: React.PropTypes.array,
    value: React.PropTypes.array,

    updateValue: React.PropTypes.func,
    searchOptions: React.PropTypes.func,
    assignValue: React.PropTypes.func,
    handleFocus: React.PropTypes.func,
    handleBlur: React.PropTypes.func
}

export default MultipleSelect
