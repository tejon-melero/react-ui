import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import {
    formControlPropTypes,
    hasOptionsPropTypes,
    focussablePropTypes,
} from './Utils'

import SubContent from './Utils/SubContent'

import Label from './Label'
import Select from './Select'

const valueMapper = (item) => item.value

export default class MultipleSelect extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,
        ...hasOptionsPropTypes,

        categoriseBy: PropTypes.string,
        className: PropTypes.string,
        defaultOptions: PropTypes.array,
        displaySelections: PropTypes.bool,
        dropdownTakesSpace: PropTypes.bool,
        getFilteredOptions: PropTypes.func,
        minCharSearch: PropTypes.number,
        noOptionPlaceholder: PropTypes.string,
        noResultsPlaceholder: PropTypes.string,
        placeholder: PropTypes.string,
        searchOptions: PropTypes.func,
        searchingPlaceholder: PropTypes.string,
        type: PropTypes.string,
        value: () => {},
        values: PropTypes.arrayOf(PropTypes.any),
    }

    static defaultProps = {
        disabled: false,
        displaySelections: true,
        dropdownTakesSpace: false,
        values: [],
    }

    /**
     * Add or remove a value to the currently-selected values.
     *
     * @param {Object} data - The data on which option was selected.
     *
     * @returns {void}
     */
    _updateValue = (data) => {
        const option = this.props.options.find((item) => (item.value === data[this.props.name]))

        // If user presses backspace, the Select component will send a 'null' as the selected value
        // (as backspace means "clear the selection" to the Select component). As such, it should be
        // safe to just ignore it. So let's check that what came back was a proper object.
        if (Object(option) === option) {
            if (this.props.values.map(valueMapper).includes(option.value)) {
                this._removeOption(option)
            } else {
                this.props.updateValue({ [this.props.name]: [ ...this.props.values, option ] })
            }
        }
    }

    /**
     * Remove the given option from our selected options.
     *
     * @param {Object} option - The option to be removed.
     *
     * @returns {void}
     */
    _removeOption(option) {
        this.props.updateValue({
            [this.props.name]: this.props.values.filter((item) => (item.value !== option.value)),
        })
    }

    /**
     * Get the options to pass into the composed Seelct component, but preformat the options first.
     *
     * @returns {Object[]} The list of options.
     */
    _getFormattedOptions() {
        const values = this.props.values.map(valueMapper)

        return this.props.options.map((item) => {
            // If our values contain the option in question, then create a rich label from the
            // plain label that indicates that it is selected, and also add the focused class to the
            // containing div.
            if (values.includes(item.value)) {
                return {
                    ...item,
                    richLabel: item.richLabel ? (
                      <item.richLabel selected />
                    ) : (
                      <span>{ '✓ ' }{ item.label }</span>
                    ),
                    classes: `${ item.classes || '' } control-select__option--focused`,
                }
            }

            // If the option is not selected, just return it as-is
            return item
        })
    }

    render() {
        // Define the classes for the form group
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        }, this.props.extraGroupClasses)

        let selectedItems = null

        if (this.props.values.length && this.props.displaySelections) {
            selectedItems = this.props.values.map((option) => (
                <div className="tag" key={ option.value }>
                    { option.label }
                    { ' ' }
                    <a
                        className="tag__clear"
                        onClick={ this._removeOption.bind(this, option) }
                    >
                        { '×' }
                    </a>
                </div>
            ))
        }

        const control = (
            <div className={ this.props.className }>
                <Select
                    closeOnSelect={ false }
                    controlOnly
                    defaultOptions={ this.props.defaultOptions }
                    disabled={ this.props.disabled }
                    dropdownTakesSpace={ this.props.dropdownTakesSpace }
                    getFilteredOptions={ this.props.getFilteredOptions }
                    handleBlur={ this.props.handleBlur }
                    handleFocus={ this.props.handleFocus }
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
                    value={ this.props.values.map(valueMapper) }
                />

                { selectedItems }
            </div>
        )

        return (
            <div className={ groupClasses }>
                <Label>{ this.props.label }</Label>

                { control }

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
