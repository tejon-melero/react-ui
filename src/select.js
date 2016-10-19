import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'

/*
 * Select box with drop down scrollable, and can be navigated with up/down arrow keys.
 */
export default class Select extends Component {
    static propTypes = {
        defaultOptions: PropTypes.array,
        error: PropTypes.array,
        getFilteredOptions: PropTypes.func,
        handleBlur: PropTypes.func,
        handleFocus: PropTypes.func,
        help: PropTypes.string,
        label: PropTypes.string,
        minCharSearch: PropTypes.number,
        name: PropTypes.string,
        noOptionPlaceholder: PropTypes.string,
        noResultsPlaceholder: PropTypes.string,
        options: PropTypes.array,
        placeholder: PropTypes.string,
        searchOptions: PropTypes.func,
        searchingPlaceholder: PropTypes.string,
        subHelp: PropTypes.string,
        type: PropTypes.string,
        updateValue: PropTypes.func,
        value: PropTypes.any,
    }

    static defaultProps = {
        defaultOptions: null,
        error: null,
        help: null,
        label: null,
        minCharSearch: 3,
        name: 'select',
        noOptionPlaceholder: 'No options available',
        noResultsPlaceholder: 'No results found',
        options: [],
        placeholder: 'Select item',
        searchingPlaceholder: '<span class="loader loader--small"></span> Searching...',
        updateValue: () => {},
        value: null,
    }

    constructor(props) {
        super(props)

        this.state = {
            // Whether the error tooltip should be displayed
            showTooltip: false,

            // The bottom position of the tooltip
            tooltipPosition: null,

            // The value currently inputted by the user in the text field
            inputValue: null,

            // Whether the field is currently in focused due to user interaction
            focused: false,

            // Tnis applies only when a search function is provided
            searching: false,

            // This option currently focussed on the list
            focusedOption: this._getFocusedOption(props.value),
        }
    }

    componentWillReceiveProps(nextProps) {
        const newState = {}

        if (nextProps.options !== this.props.options && this.props.searchOptions) {
            this.setState({
                searching: false,
            })
        }

        if (nextProps.value !== this.props.value) {
            newState.focusedOption = this._getFocusedOption(nextProps.value)

            if (! nextProps.value) {
                newState.inputValue = ''
            }
        }

        if (nextProps.options !== this.props.options) {
            newState.focusedOption = this._getFocusedOption(nextProps.value, nextProps.options)
        }

        this.setState(newState)
    }

    shouldComponentUpdate(nextProps, nextState) {
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
    _handleChange = (e) => {
        const inputValue = e.target.value

        this.setState({ inputValue })

        // If a search function is provided then we need to call it with the value as a query argument
        if (this.props.searchOptions) {
            if (inputValue && inputValue.length >= this.props.minCharSearch) {
                this.setState({ searching: true })

                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout)
                }

                this.searchTimeout = setTimeout(() => {
                    this.props.searchOptions(inputValue)
                }, 250)
            }
        }
    }

    /*
     * Handles field focus
     */
    _handleFocus = (e) => {
        const position = this.refs['form-control'].getBoundingClientRect()
        const tooltipPosition = position.height

        // Set the scroll top position to should the selected item in the list
        if (this.props.value) {
            this._setOptionScrollValue()
        }

        this.refs.text_input.select()

        this.setState({
            showTooltip: true,
            tooltipPosition,
            focused: true,
        })

        this.props.handleFocus && this.props.handleFocus(e)
    }

    /*
     * Handles field blur
     */
    _handleBlur = (e) => {
        this.setState({
            showTooltip: false,
            inputValue: '',
            focused: false,
        })

        this.refs.text_input.blur()

        this.props.handleBlur && this.props.handleBlur(e)
    }

    /*
     * Handles user enter key up
     */
    _handleKeyDown = (e) => {
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

                    this.setState({
                        inputValue: '',
                    })
                }
                break
            case KEY_TAB:
                break
            case KEY_ENTER:
                this._selectFocusedOption()
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

    _handleMouseDown(option, e) {
        e.preventDefault()

        return this._assignValue(option)
    }

    /*
     * Assigned the value upstream
     */
    _assignValue(option) {
        this.setState({
            value: option.value,
            inputValue: null,
            tooltipPosition: null,
            showTooltip: false,
            focused: false,
        })

        this.props.updateValue({ [this.props.name]: option.value })
    }

    /*
     * Insert raw HTML inside a node
     */
    _insertHTML(html) {
        return { __html: html }
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
     * Check the click target and close options if clicked outside
     */
    closeSelectOptions = (e) => {
        if (e.target.className !== 'form__select') {
            this.setState({
                tooltipPosition: null,
                focused: false,
            })
        }
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
                const _label = option.label.toString()
                const index = _label.toLowerCase().indexOf(_value.toString().toLowerCase())

                if (index !== -1) {
                    /*
                     * Get the string of the matched value (in original case)
                     */
                    const match = _label.slice(index, index + _value.length)

                    // Create a new option dict with highlighted match
                    options.push({
                        classes: option.classes,
                        label: _label.replace(
                            match,
                            `<span class="control-select__option--highlighted">${ match }</span>`
                        ),
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

        const index = this._getFocusedOptionIndex('down', options)
        let focusedOption = null

        if (index < options.length - 1 || index === null) {
            let i = 0

            for (const option of options) {
                if (index === null && i === 0) {
                    focusedOption = option
                    break
                } else if (index !== null && index + 1 === i) {
                    focusedOption = option
                    break
                }

                i++
            }

            this.setState({
                focusedOption,
            })
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

        const index = this._getFocusedOptionIndex('up', options)
        let focusedOption = null

        if (index > 0) {
            let i = 0

            for (const option of options) {
                if (index !== null && index - 1 === i) {
                    focusedOption = option
                    break
                }

                i++
            }

            this.setState({
                focusedOption,
            })
        }
    }

    /*
     * Returns the index of the focused option, || null if none
     */
    _getFocusedOptionIndex = (direction, options) => {
        if (! options) {
            options = this.props.options
        }

        if (! this.state.focusedOption) {
            return null
        }

        let i = 0

        for (const option of options) {
            if (option.value === this.state.focusedOption.value) {
                this._setOptionScrollValue(option.value, direction, options)
                return i
            }

            i++
        }

        return null
    }

    /*
     * Submit the value that is currently focused
     */
    _selectFocusedOption = () => {
        if (!this.state.focusedOption) {
            return
        }

        for (const option of this.props.options) {
            if (option.value === this.state.focusedOption.value) {
                this._assignValue(option)
            }
        }
    }

    /*
     * Find the focused option from the current value
     */
    _getFocusedOption = (value, options) => {
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

        if (this.refs['option-list'].children.length) {
            const firstChild = this.refs['option-list'].children[0]
            const rect = firstChild.getBoundingClientRect()
            const optionHeight = rect.height
            const index = this._getOptionIndex(value, options)

            let scrollTo = (index * optionHeight)

            if (direction === 'up') {
                scrollTo = (index * optionHeight) - optionHeight
            }

            this.refs['option-list'].scrollTop = scrollTo
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
            'control-select--focus': this.state.focused,
        })

        // Define the position of the option list
        const optionsStyle = {}

        if (this.state.tooltipPosition) {
            optionsStyle.top = this.state.tooltipPosition
        }

        // Define the list of options available to choose from
        let optionList = null

        if (this.state.focused) {
            const options = this._filterOptions(this.state.inputValue)

            if (options.length > 0) {
                optionList = options.map((item) => {
                    const classes = {
                        'control-select__option': true,
                        'control-select__option--focused':
                            this.state.focusedOption && (item.value === this.state.focusedOption.value),
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
                            onMouseDown={ this._handleMouseDown.bind(this, item) }
                        >
                            <span dangerouslySetInnerHTML={ this._insertHTML(item.label) } />
                        </div>
                    )
                })
            } else {
                optionList = (
                    <div className="control-select__option">
                        <span
                            dangerouslySetInnerHTML={
                                this._insertHTML(this._getNoOptionPlaceholder())
                            }
                        />
                    </div>
                )
            }
        }

        return (
            <div className={ groupClasses }>
                <Label for={ inputId }>
                    { this.props.label }
                </Label>
                <div className={ controlClasses } ref="form-control">
                    <input
                        name={ this.props.name }
                        type="hidden"
                        value={ actualValue }
                    />
                    <input
                        className="form__select"
                        id={ inputId }
                        name={ `${ this.props.name } selector` }
                        onBlur={ this._handleBlur }
                        onChange={ this._handleChange }
                        onClick={ this._handleFocus }
                        onFocus={ this._handleFocus }
                        onKeyDown={ this._handleKeyDown }
                        onTouchStart={ this._handleFocus }
                        placeholder={ this.props.placeholder }
                        ref="text_input"
                        type={ this.props.type }
                        value={ displayValue }
                    />
                    <div className="control-select__options" ref="option-list" style={ optionsStyle }>
                        { optionList }
                    </div>
                    <FieldError
                        error={ this.props.error }
                        on={ this.state.showTooltip }
                        position={ this.state.tooltipPosition }
                    />
                    <Help
                        help={ this.props.help }
                        on={ this.state.showTooltip && !this.props.error }
                        position={ this.state.tooltipPosition }
                    />
                </div>
                <SubHelp help={ this.props.subHelp }/>
            </div>
        )
    }
}
