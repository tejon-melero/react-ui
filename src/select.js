import React, { Component, PropTypes } from 'react'

import classnames from 'classnames'

import { formControlPropTypes, hasOptionsPropTypes, focussablePropTypes } from './Utils'

import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'

/*
 * Select box with drop down scrollable, and can be navigated with up/down arrow keys.
 */
export default class Select extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
        ...focussablePropTypes,

        blurOnSelect: PropTypes.bool,
        defaultOptions: PropTypes.array,
        getFilteredOptions: PropTypes.func,
        minCharSearch: PropTypes.number,
        noOptionPlaceholder: PropTypes.node,
        noResultsPlaceholder: PropTypes.node,
        placeholder: PropTypes.string,
        searchOptions: PropTypes.func,
        searchingPlaceholder: PropTypes.node,
        type: PropTypes.string,
    }

    static defaultProps = {
        blurOnSelect: true,
        minCharSearch: 3,
        noOptionPlaceholder: 'No options available',
        noResultsPlaceholder: 'No results found',
        placeholder: 'Select item',
        searchingPlaceholder: (
            <span>
                <span className="loader loader--small" />
                { ' Searching...' }
            </span>
        ),
    }

    constructor(props) {
        super(props)

        this.state = {
            // The bottom position of the tooltip
            tooltipPosition: null,

            // The value currently inputted by the user in the text field
            inputValue: null,

            // Whether the field is currently focussed due to user interaction
            focussed: false,

            // Tnis applies only when a search function is provided
            searching: false,

            // This option currently focussed on the list
            focussedOption: this._getFocussedOption(props.value),
        }
    }

    componentWillReceiveProps(nextProps) {
        const newState = {}

        // If we have different options coming in and there is a searchOptions callback specified,
        // then we can assume that we were searching and these new props have ended the search (by
        // returning results).
        if (nextProps.options !== this.props.options && this.props.searchOptions) {
            newState.searching = false
        }

        // If the value has changed, refresh our idea of which option should be focussed.
        if (nextProps.value !== this.props.value) {
            newState.focussedOption = this._getFocussedOption(nextProps.value)

            if (! nextProps.value) {
                newState.inputValue = ''
            }
        }

        // If we have different options coming in, refresh our idea of which option should be
        // focussed based on the new value and new options.
        if (nextProps.options !== this.props.options) {
            newState.focussedOption = this._getFocussedOption(nextProps.value, nextProps.options)
        }

        this.setState(newState)
    }

    shouldComponentUpdate(nextProps, nextState) {
        // TODO: work out whether this is premature optimisation and whether we can remove it for
        // code-cleanliness reasons.

        if (nextProps.value !== this.props.value) {
            return true
        }

        if (nextProps.options !== this.props.options) {
            return true
        }

        if (nextState !== this.state) {
            return true
        }

        return false
    }

    /*
     * Handles the change of value from the input field
     */
    _handleInputChanged = (e) => {
        const inputValue = e.target.value

        this.setState({ inputValue })

        // If a search function is provided then we need to call it with the value as a query argument
        if (this.props.searchOptions) {
            if (inputValue && (inputValue.length >= this.props.minCharSearch)) {
                this.setState({ searching: true })

                // the following debounces the search function with a 250ms timeout
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout)
                }

                this.searchTimeout = setTimeout(() => {
                    this.props.searchOptions(inputValue)
                }, 250)
            }
        }
    }

    _handleInputClicked = (e) => {
        if (this.state.focussed) {
            this._handleBlur()
        } else {
            this._handleFocus()
        }
    }

    /*
     * Handles field focus
     */
    _handleFocus = (e) => {
        const position = this.formControl.getBoundingClientRect()
        const tooltipPosition = position.height

        // Set the scroll top position to should the selected item in the list
        if (this.props.value) {
            this._setOptionScrollValue()
        }

        this.textInput.select()

        this.setState({
            tooltipPosition,
            focussed: true,
        })

        this.props.handleFocus && this.props.handleFocus(e)
    }

    /*
     * Handles field blur
     */
    _handleBlur = (e) => {
        this.setState({
            inputValue: '',
            focussed: false,
        })

        this.textInput.blur()

        this.props.handleBlur && this.props.handleBlur(e)
    }

    /*
     * Handles user enter key up
     */
    _handleInputKeyDown = (e) => {
        const KEY_BACKSPACE = 8
        const KEY_TAB = 9
        const KEY_ENTER = 13
        const KEY_UP = 38
        const KEY_DOWN = 40

        switch (e.keyCode) {
            case KEY_BACKSPACE:
                if (this.props.value) {
                    this.props.updateValue({ [this.props.name]: null })

                    this._handleFocus()

                    this.setState({ inputValue: '' })
                }
                break
            case KEY_TAB:
                break
            case KEY_ENTER:
                this._selectFocussedOption()
                break
            case KEY_UP:
                this._focusPreviousOption()
                break
            case KEY_DOWN:
                this._focusNextOption()
                break
            default:
                break
        }
    }

    _handleOptionClicked(option) {
        return this._assignValue(option)
    }

    /*
     * Assigned the value upstream
     */
    _assignValue(option) {
        this.setState({
            focussed: ! this.props.blurOnSelect,
            focussedOptions: null,
            inputValue: null,
            searching: false,
            value: option.value,
        })

        this.props.updateValue({ [this.props.name]: option.value })
    }

    /*
     * Get an option label from its value
     */
    _getOptionLabel = (value) => {
        let label = null
        let options = []

        if (this.props.defaultOptions) {
            options = options.concat(this.props.defaultOptions)
        }

        if (this.props.options) {
            options = options.concat(this.props.options)
        }

        for (const option of options) {
            if (option.value === value) {
                label = option.label
            }
        }

        return label

    }

    /*
     * Filter options when typing
     */
    _filterOptions = (value) => {
        if (value) {
            return this._getFilteredOptions(value)
        }

        return this._getFilteredOptions()
    }

    /*
     * Compile a list of all options filtered by a value
     */
    _getFilteredOptions = (value) => {
        const _value = value || ''
        let options = []

        // Allow search function override
        if (this.props.getFilteredOptions) {
            options = this.props.getFilteredOptions(value)
        } else {
            for (const option of this.props.options) {
                const _label = option.label
                const index = _label.toLowerCase().indexOf(_value.toString().toLowerCase())

                if (index !== -1) {
                    let label = option.richLabel

                    if (! label) {
                        // Extract the prematch, match and postmatch from the plain label
                        const prematch = _label.slice(0, index)
                        const match = _label.slice(index, index + _value.length)
                        const postmatch = _label.slice(index + _value.length)

                        // Create some JSX markup to wrp the match in a highlighting span
                        label = (
                            <span>
                                <span>{ prematch }</span>
                                <span className="control-select__option--highlighted">{ match }</span>
                                <span>{ postmatch }</span>
                            </span>
                        )
                    }

                    // Create a new option dict with highlighted match
                    options.push({
                        classes: option.classes,
                        label,
                        value: option.value,
                    })
                }
            }
        }

        this.filteredOptions = options

        return options
    }

    /*
     * Focus on the next option or first one if none
     */
    _focusNextOption = () => {
        let options = this.props.options

        if (this.filteredOptions) {
            options = this.filteredOptions
        }

        const index = this._getFocussedOptionIndex('down', options)
        let focussedOption = null

        if (index < options.length - 1 || index === null) {
            let i = 0

            for (const option of options) {
                if (index === null && i === 0) {
                    focussedOption = option
                    break
                } else if (index !== null && index + 1 === i) {
                    focussedOption = option
                    break
                }

                i++
            }

            this.setState({ focussedOption })
        }
    }

    /*
     * Focus on the previous option
     */
    _focusPreviousOption = () => {
        let options = this.props.options

        if (this.filteredOptions) {
            options = this.filteredOptions
        }

        const index = this._getFocussedOptionIndex('up', options)
        let focussedOption = null

        if (index > 0) {
            let i = 0

            for (const option of options) {
                if (index !== null && index - 1 === i) {
                    focussedOption = option
                    break
                }

                i++
            }

            this.setState({ focussedOption })
        }
    }

    /*
     * Returns the index of the focussed option or null if there is none.
     */
    _getFocussedOptionIndex = (direction, options) => {
        if (! options) {
            options = this.props.options
        }

        if (! this.state.focussedOption) {
            return null
        }

        let i = 0

        for (const option of options) {
            if (option.value === this.state.focussedOption.value) {
                this._setOptionScrollValue(option.value, direction, options)
                return i
            }

            i++
        }

        return null
    }

    /*
     * Submit the value that is currently focussed
     */
    _selectFocussedOption = () => {
        if (!this.state.focussedOption) {
            return
        }

        for (const option of this.props.options) {
            if (option.value === this.state.focussedOption.value) {
                this._assignValue(option)
            }
        }
    }

    /*
     * Find the focussed option from the current value
     */
    _getFocussedOption = (value, options) => {
        if (! options) {
            options = this.props.options
        }

        for (const option of options) {
            if (option.value === value) {
                return option
            }
        }

        return null
    }

    /*
     * Adjust the scroll value of the option list to show the selected item
     */
    _setOptionScrollValue = (value, direction, options) => {
        if (! value) {
            value = this.props.value
        }

        if (this.optionList.children.length) {
            const firstChild = this.optionList.children[0]
            const rect = firstChild.getBoundingClientRect()
            const optionHeight = rect.height
            const index = this._getOptionIndex(value, options)

            let scrollTo = (index * optionHeight)

            if (direction === 'up') {
                scrollTo = (index * optionHeight) - optionHeight
            }

            this.optionList.scrollTop = scrollTo
        }
    }

    /*
     * Find the index of the selected value
     */
    _getOptionIndex = (value, options) => {
        if (! options) {
            options = this.props.options
        }

        let index = 0

        if (options.length > 0) {
            for (const option of options) {
                if (option.value === value) {
                    return index
                }

                index++
            }
        }

        // not found, go for -1
        return -1
    }

    /*
     * Get the placeholder when there's no options, depending on whether
     * it's a search select or standard fixed list
     */
    _getNoOptionPlaceholder = () => {
        // If we have an option search function, then we will be either "type in" or no search results
        if (this.state.searching === true) {
            return this.props.searchingPlaceholder
        }

        if (this.props.searchOptions && this.state.inputValue === '') {
            return this.props.noOptionPlaceholder
        }

        if (this.props.searchOptions && typeof this.state.inputValue === 'string') {
            return this.props.noResultsPlaceholder
        }

        return this.props.noOptionPlaceholder
    }

    render() {
        const inputId = `id_${ this.props.name }`

        // displayValue is just concerned with what should be displayed, not what we should be
        // using to search on, also we don't care about the inputValue if it is empty - in that
        // case we prefer the currently selected value (if it exists)
        let displayValue = ''
        let actualValue = this.props.value

        if (this.state.inputValue && this.state.inputValue.length) {
            displayValue = this.state.inputValue
        } else {
            displayValue = this._getOptionLabel(this.props.value)
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
            'form__group--error': this.props.error,
        })

        // Define the classes for the form control
        const controlClasses = classnames({
            'form__control': true,
            'form__control--select': true,
            'form__control--select-error': this.props.error,
            'control-select': true,
            'control-select--focus': this.state.focussed,
        })

        // Define the position of the option list
        const optionsStyle = {}

        if (this.state.tooltipPosition) {
            optionsStyle.top = this.state.tooltipPosition
        }

        // Define the list of options available to choose from
        let optionList = null

        if (this.state.focussed) {
            const options = this._filterOptions(this.state.inputValue)

            if (options.length > 0) {
                optionList = options.map((item) => {
                    const classes = {
                        'control-select__option': true,
                        'control-select__option--focused':
                            this.state.focussedOption && (item.value === this.state.focussedOption.value),
                        'control-select__option--selected': this.props.value === item.value,
                    }

                    if (item.classes) {
                        classes[item.classes] = true
                    }

                    const optionClasses = classnames(classes)

                    return (
                        <div
                            className={ optionClasses }
                            key={ item.value }
                            onClick={ this._handleOptionClicked.bind(this, item) }
                        >
                            { item.label }
                        </div>
                    )
                })
            } else {
                optionList = (
                    <div className="control-select__option">
                        { this._getNoOptionPlaceholder() }
                    </div>
                )
            }
        }

        return (
            <div className={ groupClasses }>
                <Label for={ inputId }>
                    { this.props.label }
                </Label>
                <div className={ controlClasses } ref={ (ref) => { this.formControl = ref } }>
                    <input
                        name={ this.props.name }
                        type="hidden"
                        value={ actualValue }
                    />
                    <input
                        className="form__select"
                        id={ inputId }
                        name={ `${ this.props.name }_selector` }
                        onChange={ this._handleInputChanged }
                        onClick={ this._handleInputClicked }
                        onKeyDown={ this._handleInputKeyDown }
                        placeholder={ this.props.placeholder }
                        ref={ (ref) => { this.textInput = ref } }
                        type={ this.props.type || 'text' }
                        value={ displayValue }
                    />
                    <div
                        className="control-select__options"
                        ref={ (ref) => { this.optionList = ref } }
                        style={ optionsStyle }
                    >
                        { optionList }
                    </div>
                    <FieldError
                        error={ this.props.error }
                        on={ this.state.focussed }
                        position={ this.state.tooltipPosition }
                    />
                    <Help
                        help={ this.props.help }
                        on={ this.state.focussed && !this.props.error }
                        position={ this.state.tooltipPosition }
                    />
                </div>
                <SubHelp help={ this.props.subHelp }/>
            </div>
        )
    }
}
