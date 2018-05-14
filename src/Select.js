import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import {
    formControlPropTypes,
    hasOptionsPropTypes,
    focussablePropTypes,
    getProperty,
    generateId,
} from './Utils'

import SubContent from './Utils/SubContent'

import Label from './Label'

const KEY_BACKSPACE = 8
const KEY_TAB = 9
const KEY_ENTER = 13
const KEY_UP = 38
const KEY_DOWN = 40
const KEY_ESCAPE = 27

function createHighlightNode(text, highlight) {
    const index = text.toLowerCase().indexOf(highlight)

    // Extract the prematch, match and postmatch from the plain label
    const prematch = text.slice(0, index)
    const match = text.slice(index, index + highlight.length)
    const postmatch = text.slice(index + highlight.length)

    // Create some JSX markup to wrap the match in a highlighting span
    return (
        <span>
            <span>{ prematch }</span>
            <span className="control-select__option--highlighted">{ match }</span>
            <span>{ postmatch }</span>
        </span>
    )
}

/**
 * Determine if two options arrays are the same (deep-style equality).
 *
 * As this function is meant to check options arrays, the measure of equality is the following.
 *
 * If:
 *
 * - Both are arrays
 * - And are referentially the same, or:
 *     - Have the same length
 *     - And the same value for `[].value` at each index
 *
 * They are equal. Otherwise they are not.
 *
 * @param {array} a The first array to compare.
 * @param {array} b The second array to compare.
 *
 * @returns {bool} Whether all options are equal in the two arrays.
 */
function areOptionsEqual(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a === b) {
            return true
        }

        if (a.length !== b.length) {
            return false
        }

        for (let i = 0; i < a.length; i++) {
            if (a[i].value !== b[i].value) {
                return false
            }
        }

        return true
    }

    return false
}

/*
 * Select box with drop down scrollable, and can be navigated with up/down arrow keys.
 */
export default class Select extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
        ...focussablePropTypes,

        categoriseBy: PropTypes.string,
        closeOnSelect: PropTypes.bool,
        controlClassName: PropTypes.string,
        controlOnly: PropTypes.bool,
        defaultOptions: PropTypes.array,
        dropdownTakesSpace: PropTypes.bool,
        filterStartsWithOnly: PropTypes.bool,
        getFilteredOptions: PropTypes.func,
        helpOnFocus: PropTypes.bool,
        innerRef: PropTypes.func,
        minCharSearch: PropTypes.number,
        noOptionPlaceholder: PropTypes.node,
        noResultsPlaceholder: PropTypes.node,
        placeholder: PropTypes.string,
        searchDebounceMs: PropTypes.number,
        searchOptions: PropTypes.func,
        searchingPlaceholder: PropTypes.node,
        type: PropTypes.string,
    }

    static defaultProps = {
        closeOnSelect: true,
        controlOnly: false,
        defaultOptions: [],
        disabled: false,
        dropdownTakesSpace: false,
        filterStartsWithOnly: false,
        helpOnFocus: true,
        minCharSearch: 3,
        noOptionPlaceholder: 'No options available',
        noResultsPlaceholder: 'No results found',
        placeholder: 'Select item',
        searchDebounceMs: 250,
        searchingPlaceholder: (
            <span>
                <span className="loader loader--small" />
                { ' Searching...' }
            </span>
        ),
        value: null,
    }

    state = {
        // The bottom position of the tooltip.
        tooltipPosition: null,

        // The value currently inputted by the user in the text field.
        inputValue: null,

        // Whether the field is currently focussed due to user interaction.
        focussed: false,

        // Tnis applies only when a search function is provided. Stores whether we are currently
        // waiting for an async search response.
        searching: false,

        // Options from props.options pre-categorised by the category key's value.
        categorisedOptions: {},

        // The currently-focussed option.
        focussedOption: null,

        // The number of actual options after applying filtering.
        numFilteredOptions: 0,
    }

    componentDidMount() {
        this._resolveSelectedOption()
        this._resolveFilteredOptions()

        this.mounted = true
    }

    componentWillReceiveProps(nextProps) {
        const newState = {}

        // If there we are currently searching and the new options coming in are different to our
        // existing ones, we can infer that searching is complete. (We can and do also use any
        // promise returned by the call to `props.searchOptions` as a better source of this info.)
        if (this.state.searching && ! areOptionsEqual(nextProps.options, this.props.options)) {
            newState.searching = false
        }

        // If the value has changed, refresh our idea of which option should be focussed.
        if (nextProps.value !== this.props.value) {
            // Also, if the value is empty, we should clear the 'selected text' value.
            if (! nextProps.value) {
                newState.inputValue = null
            }
        }

        this.setState(newState, () => {
            this._resolveSelectedOption()
            this._resolveFilteredOptions()
        })
    }

    componentWillUnmount() {
        this.mounted = false
    }

    mounted = false
    searchTimeout = null

    ignoreNextBlur = false

    // Refs
    textInput = null
    formControl = null
    optionList = null

    storeTextInputRef = (ref) => {
        this.textInput = ref

        if (this.props.innerRef) {
            this.props.innerRef(ref)
        }
    }

    storeFormControlRef = (ref) => {
        this.formControl = ref

        let tooltipPosition = null

        if (ref) {
            tooltipPosition = ref.getBoundingClientRect().height
        }

        this.setState({ tooltipPosition })
    }

    storeOptionListRef = (ref) => this.optionList = ref

    _resolveSelectedOption = () => {
        this.setState({
            focussedOption: this._getSelectedOption(),
            selectedOption: this._getSelectedOption(),
        })
    }

    _resolveFilteredOptions = () => {
        const filteredOptions = this._getFilteredOptions()

        this.setState({
            numFilteredOptions: filteredOptions.length,
            categorisedOptions: this._categoriseOptions(filteredOptions, this.props.categoriseBy),
        })
    }

    /*
     * Find the selected option from the current value
     */
    _getSelectedOption = () => {
        let option = this.props.options.find((option) => option.value === this.props.value)

        if ((! option) && this.props.options.length) {
            option = this.props.options[0]
        }

        return option
    }

    /*
     * Handles the change of value from the input field
     */
    _handleInputChanged = (e) => {
        const inputValue = e.target.value

        this.setState({ inputValue }, this._resolveFilteredOptions)

        // If a search function is provided then we need to call it with the value as a query argument
        if (this.props.searchOptions) {
            if (inputValue && (inputValue.length >= this.props.minCharSearch)) {
                this.setState({ searching: true })

                // the following debounces the search function with the specified timeout (default 250ms)
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout)
                }

                this.searchTimeout = setTimeout(() => {
                    const p = this.props.searchOptions(inputValue)

                    // If we got a promise back from searchOptions, add a finally callback to it
                    // that sets our state's "searching" to false. After all, if the promise
                    // resolves (or rejects), searching is done.
                    if (p && p.finally) {
                        p.finally(() => {
                            // Mounted check just in case the component was unmounted while the
                            // search promise was waiting.
                            if (this.mounted) {
                                this.setState({ searching: false })
                            }
                        })
                    }
                }, this.props.searchDebounceMs)
            }
        }
    }

    _handleInputMousePressedDown = () => {
        if (this.state.focussed) {
            setTimeout(() => {
                this._handleBlur()
            }, 0)
        } else {
            this._handleFocus()
        }
    }

    _handleInputFocussed = () => {
        this._handleFocus()
    }

    _handleInputBlurred = () => {
        if (this.ignoreNextBlur !== true) {
            // The `activeElement` code is to differentiate between blurring caused by actually
            // focussing another element and blurring caused by the window itself losing focus.
            // The `setTimeout` part is to ensure that the browser has correctly set the
            // `activeElement` property, as its value is somewhat undefined during the actual
            // handling of a blur event!
            setTimeout(() => {
                if (document.activeElement !== this.textInput) {
                    this._handleBlur()
                }
            }, 0)
        }

        this.ignoreNextBlur = false
    }

    /*
     * Handles field focus
     */
    _handleFocus = () => {
        this.textInput && this.textInput.select()

        this.setState({
            focussed: true,
            focussedOption: this._getSelectedOption(),
        }, this._setOptionScrollValue)

        this.props.handleFocus && this.props.handleFocus()
    }

    /*
     * Handles field blur
     */
    _handleBlur = () => {
        this.setState({
            inputValue: null,
            focussed: false,
        })

        this.textInput && this.textInput.blur()

        this.props.handleBlur && this.props.handleBlur()
    }

    /*
     * Handles user enter key up
     */
    _handleInputKeyDown = (e) => {
        switch (e.keyCode) {
            case KEY_BACKSPACE:
                if (this.props.value) {
                    this.props.updateValue({ [this.props.name]: null })
                }
                break

            case KEY_TAB:
                this._selectFocussedOption()
                break

            case KEY_ENTER:
                // If the dropdown is currently showing, we don't want pressing enter in the input
                // to actually submit any form that the Select component is part of, but instead
                // just select the focussed option. So let's prevent the default action in that
                // case.
                if (this.state.focussed) {
                    e.preventDefault()
                }

                this._selectFocussedOption()
                break

            case KEY_UP:
                this._focusPreviousOption()
                break

            case KEY_DOWN:
                this._focusNextOption()
                break

            case KEY_ESCAPE:
                this._handleBlur()
                break

            default:
                break
        }
    }

    _handleOptionClicked(option) {
        this._assignValue(option)

        this.ignoreNextBlur = true

        // setTimout because setting the focus as part of the blur process (which clicking on an
        // item will be for the text input) doesn't work. Gah DOM events!
        if (! this.props.closeOnSelect) {
            setTimeout(() => {
                this.textInput && this.textInput.focus()
            }, 0)
        }
    }

    _assignValue(option) {
        if (this.props.closeOnSelect) {
            this.setState({
                focussed: false,
                inputValue: null,
                searching: false,
            })
        }

        this.props.updateValue({ [this.props.name]: option.value })
    }

    /*
     * Given a value, get the label for that value.
     */
    _getOptionLabelForValue = (value) => {
        const allOptions = this.props.options.concat(this.props.defaultOptions)

        const option = allOptions.find((option) => option.value === value)

        if (option) {
            return option.label
        }

        return null
    }

    /*
     * Compile a list of all options filtered by the search text.
     */
    _getFilteredOptions = () => {
        if (this.state.inputValue) {
            let options = []

            const search = this.state.inputValue.toString().toLowerCase()

            if (this.props.getFilteredOptions) {
                options = this.props.getFilteredOptions(search)
            } else {
                options = this.props.options.filter((option) => (
                    this.props.filterStartsWithOnly ?
                    option.label.toLowerCase().indexOf(search) === 0 :
                    option.label.toLowerCase().indexOf(search) !== -1
                )).map((option) => {
                    // Create a new option with highlighted match if no rich label is present
                    return {
                        ...option,
                        label: option.richLabel ?
                            React.cloneElement(option.richLabel, { match: search }) :
                            createHighlightNode(option.label, search),
                    }
                })
            }

            return options
        }

        return this.props.options.map((option) => {
            return {
                ...option,
                label: option.richLabel || option.label,
            }
        })
    }

    _categoriseOptions(options, categoriseBy) {
        if (categoriseBy) {
            // This will store all options in their categories
            const categorisedOptions = {
                __NONE__: [],
            }

            for (const option of options) {
                const category = getProperty(option, categoriseBy)

                if (! (category in categorisedOptions)) {
                    categorisedOptions[category] = []
                }

                categorisedOptions[category].push(option)
            }

            return categorisedOptions
        }

        return {
            __NONE__: [ ...options ],
        }
    }

    _getNextOption() {
        // We store the first option visited so that if the last option is the one that matches the
        // current one, the next option is the first. Or if the option is not found, the first
        // option seems like a sensible 'next' option.
        let first = null

        // As soon as we visit the currently-selected value, we say the next one visited is the one
        // we want. This variable helps us do that.
        let selectNext = false

        // Iterate through all options in category order in order to find the current one and select
        // the next one visited.
        for (const options of Object.values(this.state.categorisedOptions)) {
            for (const option of options) {
                // If no 'first option' exists, set it here.
                if (! first) {
                    first = option
                }

                // If we already found the current one, this will be true telling us to return the
                // 'next' one. So do so.
                if (selectNext) {
                    return option
                }

                // Otherwise, keep searching for the curretly-selected option. If found, set
                // selectNext to true,
                if (this.state.focussedOption && (option.value === this.state.focussedOption.value)) {
                    selectNext = true
                }
            }
        }

        // Nothing matched, or the last one matched, so return the first.
        return first
    }

    _getPreviousOption() {
        // As we iterate through the options, we will constantly be keeping track of the last option
        // visited so that when we find the currently-selected option, we can return the one
        // previous to it.
        let previous = null

        // Iterate through all options in category order in order to find the current one and select
        // the next one hit.
        for (const options of Object.values(this.state.categorisedOptions)) {
            for (const option of options) {
                // if the current option is the currently selected one, return the previous option.
                if (previous && this.state.focussedOption && (option.value === this.state.focussedOption.value)) {
                    return previous
                }

                // Otherwise, store the current option as the previous one and continue iteration.
                previous = option
            }
        }

        // Nothing matched, or the last one matched, so return the last one.
        return previous
    }

    /*
     * Focus on the next option or first one if none
     */
    _focusNextOption = () => {
        this.setState({
            focussedOption: this._getNextOption(),
        }, this._setOptionScrollValue)
    }

    /*
     * Focus on the previous option
     */
    _focusPreviousOption = () => {
        this.setState({
            focussedOption: this._getPreviousOption(),
        }, this._setOptionScrollValue)
    }

    /*
     * Submit the value that is currently focussed
     */
    _selectFocussedOption = () => {
        if (! this.state.focussedOption) {
            return
        }

        // While the state's focussedOption is an option object, it will have been mutated sightly
        // from what was passed in props. So here we make sure to pick the 'original' props option
        // out.
        const option = this.props.options.find((option) => (
            option.value === this.state.focussedOption.value
        ))

        // And just on the offchance we didn't find the option, let's be cautious...
        if (option) {
            this._assignValue(option)
        }
    }

    /*
     * Adjust the scroll value of the option list to show the selected item
     */
    _setOptionScrollValue = () => {
        const option = this.state.focussedOption

        // By default, let's go to the top.
        let scrollTo = 0

        if (option && this.state.numFilteredOptions) {
            // Get all "options" from the descendents of the option list
            const item = this.optionList.querySelector(
                `.control-select__option[data-value="${ option.value }"]`
            )

            if (item) {
                // If item if the first option in a categorisation group, actually set the scroll
                // value to the group itself.

                const prev = item.previousElementSibling

                if (prev && Array.from(prev.classList).includes('control-select__group-heading')) {
                    scrollTo = item.parentNode.offsetTop
                } else {
                    scrollTo = item.offsetTop
                }
            }
        }

        this.optionList.scrollTop = scrollTo
    }

    /*
     * Get the placeholder when there's no options, depending on whether
     * it's a search select or standard fixed list
     */
    _getNoOptionPlaceholder = () => {
        // If we are currently searching, return the "searching..." placeholder.
        if (this.state.searching === true) {
            return this.props.searchingPlaceholder
        }

        // If we have a search function, and some search text, return the "no results" placeholder.
        if (this.props.searchOptions && this.state.inputValue && this.state.inputValue.length) {
            return this.props.noResultsPlaceholder
        }

        // Anythng else can safely have the "no results" placeholder.
        return this.props.noOptionPlaceholder
    }

    render() {
        const inputId = generateId(this.props.name)

        // displayValue is just concerned with what should be displayed, not what we should be
        // using to search on, also we don't care about the inputValue if it is empty - in that
        // case we prefer the currently selected value (if it exists)
        let displayValue = ''
        let actualValue = this.props.value

        if (this.state.inputValue === null) {
            displayValue = this._getOptionLabelForValue(this.props.value)
        } else {
            displayValue = this.state.inputValue
        }

        // Ensure the values we will place in the inputs are usable strings (i.e. not null)
        if (! (displayValue && displayValue.length)) {
            displayValue = ''
        }

        if (! (actualValue && actualValue.length)) {
            actualValue = ''
        }

        // Define the classes for the form group
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        })

        // Define the classes for the form control
        const controlClasses = classnames(
            'form__control',
            'form__control--select',
            this.props.controlClassName,
            'control-select',
            {
                'form__control--select-arrow-suffix': this.props.suffix,
                'form__control--input-addon': this.props.prefix || this.props.suffix,
                'control-select--focus': this.state.focussed,
            }
        )

        // Define the position of the option list
        const optionsStyle = {}

        if (this.state.tooltipPosition) {
            optionsStyle.top = this.state.tooltipPosition
        }

        // If the implementor thinks the dropdown should take up space in the UI, override its
        // position to static (as it is `absolute` by default in order to make it overlay the
        // content).
        if (this.props.dropdownTakesSpace === true) {
            optionsStyle.position = 'static'
        }

        // Define the list of options available to choose from
        let optionList = null

        if (this.state.focussed) {
            if (this.state.numFilteredOptions) {
                optionList = []

                // Now add each category to the optionslist
                for (const [ category, options ] of Object.entries(this.state.categorisedOptions)) {
                    optionList.push(
                        <div key={ category }>
                            { category !== '__NONE__' &&
                                <div className="control-select__group-heading">{ category }</div>
                            }
                            { options.map(
                                (option) => {
                                    const classes = {
                                        'control-select__option': true,
                                        'control-select__option--focused':
                                            this.state.focussedOption && (
                                                option.value === this.state.focussedOption.value
                                            ),
                                        'control-select__option--selected': option.value === this.props.value,
                                    }

                                    if (option.classes) {
                                        classes[option.classes] = true
                                    }

                                    const optionClasses = classnames(classes)

                                    return (
                                        <div
                                            className={ optionClasses }
                                            data-value={ option.value }
                                            key={ option.value }
                                            onMouseDown={ this._handleOptionClicked.bind(this, option) }
                                        >
                                            { option.label }
                                        </div>
                                    )
                                }
                            ) }
                        </div>
                    )
                }
            } else {
                optionList = (
                    <div className="control-select__option">
                        { this._getNoOptionPlaceholder() }
                    </div>
                )
            }
        }

        const control = (
            <div className={ controlClasses } ref={ this.storeFormControlRef }>
                <input
                    name={ this.props.name }
                    type="hidden"
                    value={ actualValue }
                />

                <input
                    autoComplete="off"
                    className="form__select"
                    disabled={ this.props.disabled }
                    id={ inputId }
                    name={ `${ this.props.name }_selector` }
                    onBlur={ this._handleInputBlurred }
                    onChange={ this._handleInputChanged }
                    onFocus={ this._handleInputFocussed }
                    onKeyDown={ this._handleInputKeyDown }
                    onMouseDown={ this._handleInputMousePressedDown }
                    placeholder={ this.props.placeholder }
                    ref={ this.storeTextInputRef }
                    type={ this.props.type || 'text' }
                    value={ displayValue }
                />

                <div
                    className="control-select__options"
                    ref={ this.storeOptionListRef }
                    style={ optionsStyle }
                >
                    { optionList }
                </div>

                { this.props.prefix && (
                    <div className="input-addon input-addon--prefix">
                        { this.props.prefix }
                    </div>
                )}
                { this.props.suffix && (
                    <div className="input-addon input-addon--suffix">
                        { this.props.suffix }
                    </div>
                )}
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <Label htmlFor={ inputId }>{ this.props.label }</Label>

                { control }

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
