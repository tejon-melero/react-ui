import React, { Component, PropTypes } from 'react'

import { formControlPropTypes, hasOptionsPropTypes, focussablePropTypes } from './Utils'

import Select from './select'

export default class MultipleSelect extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,
        ...hasOptionsPropTypes,

        className: PropTypes.string,
        defaultOptions: PropTypes.array,
        getFilteredOptions: PropTypes.func,
        minCharSearch: PropTypes.number,
        noOptionPlaceholder: PropTypes.string,
        noResultsPlaceholder: PropTypes.string,
        placeholder: PropTypes.string,
        searchOptions: PropTypes.func,
        searchingPlaceholder: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.any).isRequired,
    }

    /**
     * Add value(s) to the currently-selected values.
     *
     * @returns void
     */
    _updateValue = (data) => {
        let newValue = [ ...this.props.value ]

        for (const key in data) {
            if (newValue.includes(data[key])) {
                newValue = newValue.filter((item) => item !== data[key])
            } else {
                newValue.push(data[key])
            }
        }

        this.props.updateValue({ [this.props.name]: newValue })
    }

    /**
     * Get the list of options we have available for selection.
     *
     * @returns Object[] The options that aren't selected.
     */
    _getAvailableOptions() {
        return this.props.options.filter((item) => (! this.props.value.includes(item.value)))
    }

    /**
     * Get the list of options that are currently selected.
     *
     * @returns Object[] The currently-selected options.
     */
    _getSelectedOptions() {
        return this.props.options.filter((item) => this.props.value.includes(item.value))
    }

    _getFormattedOptions() {
        return this.props.options.map((item) => {
            if (this.props.value.includes(item.value)) {
                item.richLabel = (
                    <span>{ '✓ ' }{ item.label }</span>
                )

                item.classes = `${ item.classes || '' } control-select__option--focused`
            }

            return item
        })
    }

    /**
     * Remove the given option from our selected options.
     *
     * @returns void
     */
    _removeOption(option, e) {
        e.preventDefault()

        this.props.updateValue({
            [this.props.name]: this.props.value.filter((item) => (item !== option.value)),
        })
    }

    render() {
        let selectedItems = null

        if (this.props.value.length) {
            selectedItems = this._getSelectedOptions().map((option) => (
                <div className="tag" key={ option.value }>
                    { option.label }
                    { ' ' }
                    <a
                        className="tag__clear"
                        href="#"
                        onClick={ this._removeOption.bind(this, option) }
                    >
                        { '×' }
                    </a>
                </div>
            ))
        }

        return (
            <div className={ this.props.className }>
                <Select
                    blurOnSelect={ false }
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
                    options={ this._getFormattedOptions() }
                    placeholder={ this.props.placeholder }
                    searchOptions={ this.props.searchOptions }
                    searchingPlaceholder={ this.props.searchingPlaceholder }
                    type={ this.props.type }
                    updateValue={ this._updateValue }
                    value={ this.props.value }
                />

                { selectedItems }
            </div>
        )
    }
}
