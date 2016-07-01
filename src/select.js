"use strict";

import React, {Component} from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'



/*
 * Select box with drop down scrollable, and can be navigated with top and
 * button arrow keys
 */

class Select extends Component {

    constructor(props) {
        super(props)
        this.state = {}

        // Whether the error tooltip should be displayed
        this.state.showTooltip = false

        // The bottom position of the tooltip
        this.state.tooltipPosition = null

        // The value currently inputted by the user in the text field
        this.state.inputValue = null

        // Whether the field is currently in focused due to user interaction
        this.state.focused = false

        // Tnis applies only when a search function is provided
        this.state.searching = false

        // Tnis option currently focussed on the list
        this.state.focusedOption = this._getFocusedOption(props.value)

        // this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
    }

    componentWillReceiveProps(nextProps){

        let newState = {}

        if(nextProps.options !== this.props.options && this.props.searchOptions){
            this.setState({
                searching: false
            })
        }

        if(nextProps.value !== this.props.value){
             newState.focusedOption = this._getFocusedOption(nextProps.value)
             if(!nextProps.value)
                newState.inputValue = ""
        }
        if(nextProps.options !== this.props.options){
            newState.focusedOption = this._getFocusedOption(nextProps.value, nextProps.options)
        }

        this.setState(newState)
    }

    shouldComponentUpdate(nextProps, nextState){

        if (nextProps.value !== this.props.value)
            return true

        if (nextProps.options !== this.props.options)
            return true

        if (nextState !== this.state)
            return true

        return false
    }

    render(){
        let inputId = "id_#{this.props.name}"
        let inputValue = null
        if(typeof this.state.inputValue === "string")
            inputValue = this.state.inputValue
        else
            inputValue = this._getOptionLabel(this.props.value)

        /*
         * Define the classes for the form group
         */
        let groupClasses = classnames({
            'form__group':true,
            'form__group--error':this.props.error
            })

        /*
         * Define the classes for the form control
         */
        let controlClasses = classnames({
            'form__control': true,
            'form__control--select': true,
            'form__control--select-success': this.props.success,
            'form__control--select-error': this.props.error,
            'control-select': true,
            'control-select--focus': this.state.focused
            })

        /*
         * Define the position of the option list
         */
        let optionsStyle = {}
        if (this.state.tooltipPosition)
            optionsStyle['top'] = this.state.tooltipPosition

        /*
         * Define the list of options available to choose from
         */

        let optionList = null
        if (this.state.focused){
            let options = this._filterOptions(this.state.inputValue)
            if (options.length > 0){
                let inc = 0
                optionList = options.map((item)=>{
                    inc++
                    let classes = {
                        'control-select__option': true,
                        'control-select__option--focused': this.state.focusedOption && item.value === this.state.focusedOption.value,
                        'control-select__option--selected': this.props.value == item.value
                        }
                    if (item.classes)
                        classes[item.classes] = true

                    let optionClasses = classnames(classes)

                    return (<div
                                key={ `item-${inc}` }
                                className={ optionClasses }
                                onMouseDown={ this._assignValue.bind(this, item) }>
                                <span dangerouslySetInnerHTML={this._insertHTML(item.label)} />
                            </div>)
                })
            }else{
                optionList = (<div className="control-select__option">
                            <span dangerouslySetInnerHTML={
                                this._insertHTML(this._getNoOptionPlaceholder())
                            } />
                        </div>)
            }
        }

        return (<div className={ groupClasses }>
            <Label for={ inputId }>
                { this.props.label }
            </Label>
            <div className={ controlClasses } ref="form-control">
                <input
                    type="hidden"
                    value={ this.props.value || "" }
                    name={ this.props.name }
                />
                <input
                    id={ inputId }
                    className="form__select"
                    type={ this.props.type }
                    value={ inputValue || "" }
                    name={ this.props.name + 'selector' }
                    placeholder={ this.props.placeholder }
                    onChange={ this._handleChange }
                    onKeyDown={ this._handleKeyDown }
                    onFocus={ this._handleFocus }
                    onBlur={ this._handleBlur }
                    onClick={ this._handleFocus }
                    onTouchStart={ this._handleFocus }
                />
                <div className="control-select__options" style={ optionsStyle } ref="option-list">
                    { optionList }
                </div>
                <FieldError error={ this.props.error } on={ this.state.showTooltip } position={ this.state.tooltipPosition } />
                <Help help={ this.props.help } on={ this.state.showTooltip && !this.props.error } position={ this.state.tooltipPosition } />
            </div>
            <SubHelp help={ this.props.sub_help }/>
        </div>)
    }

    /*
     * Handles the change of value from the input field
     */
    _handleChange = (e)=>{
        let inputValue = e.target.value
        this.setState({
            inputValue
        })
        /*
         * If a search function is provided then we need to call it
         * with the value as a query argument
         */
        if (this.props.searchOptions){
            if(inputValue && inputValue.length >= this.props.minCharSearch){
                this.setState({
                    searching: true
                })
                if(this.searchTimeout){
                    clearTimeout(this.searchTimeout)
                }
                this.searchTimeout = setTimeout(()=>{
                    this.props.searchOptions(inputValue)
                }, 250)
            }
        }
    }

    /*
     * Handles field focus
     */
    _handleFocus = (e)=>{
        let position = this.refs['form-control'].getBoundingClientRect()
        let tooltipPosition = position.height

        // Set the scroll top position to should the selected item in the list
        if (this.props.value)
            this._setOptionScrollValue()

        this.setState({
            showTooltip: true,
            tooltipPosition: tooltipPosition,
            focused: true
            })

        if (this.props.handleFocus)
            this.props.handleFocus(e)

    }

    /*
     * Handles field blur
     */
    _handleBlur = (e)=>{

        this.setState({
            showTooltip: false,
            focused: false
        })

        if (this.props.handleBlur)
            this.props.handleBlur(e)

    }

    /*
     * Handles user enter key up
     */
    _handleKeyDown = (e)=>{
        let value = e.target.value

        switch (e.keyCode) {
            case 8: // backspace
                if (this.props.value){
                    this.props.updateValue(this.props.name, null)
                    this._handleFocus()
                    this.setState({
                        inputValue: ""
                    })
                }
                break
            case 9: // tab
                break
            case 13: // enter
                this._selectFocusedOption()
                break
            case 38: // up
                this._focusPreviousOption()
                break
            case 40: // down
                this._focusNextOption()
                break
            default:
                break
        }
    }

    /*
     * Assigned the value upstream
     */
    _assignValue(option){

        // If we have a custom function, use it instead
        if (this.props.assignValue)
            return this.props.assignValue(option, this)

        this.setState({
            value: option.value,
            inputValue: null,
            tooltipPosition: null,
            showTooltip: false,
            focused: false
            })

        this.props.updateValue(this.props.name, option.value)
    }

    /*
     * Insert raw HTML inside a node
     */
    _insertHTML(html){
        return {__html: html}
    }

    /*
     * Get an option label from its value
     */

    _getOptionLabel = (value)=>{

        let label = null
        let options = []

        if (this.props.defaultOptions){
            options = options.concat(this.props.defaultOptions)
        }

        if (this.props.options){
            options = options.concat(this.props.options)
        }

        for (let option of options){
            if (option.value === value){
                label = option.label
            }
        }

        return label

    }

    /*
     * Check the click target and close options if clicked outside
     */

    closeSelectOptions = (e)=>{
        if (e.target.className !== 'form__select')
            this.setState({
                tooltipPosition: null,
                focused: false
            })
    }

    /*
     * Filter options when typing
     */

    _filterOptions = (value)=>{
        if (value){
            return this._getFilteredOptions(value)
        }
        else {
            return this._getFilteredOptions()
        }
    }

    /*
     * Compile a list of all options filtered by a value
     */

    _getFilteredOptions = (value)=>{

        let _value = value || ""
        let options = []

        // Allow search function override
        if (this.props.getFilteredOptions){
            options = this.props.getFilteredOptions(value)
        }
        else{
            for (let option of this.props.options){
                let _label = option.label.toString()
                let index = _label.toLowerCase().indexOf(_value.toString().toLowerCase())

                if (index !== -1){
                    /*
                     * Get the string of the matched value (in original case)
                     */
                    let match = _label.slice(index, index + _value.length)

                    // Create a new option dict with highlighted match
                    let _option = {
                        value: option.value,
                        label: _label.replace(match, `<span class='control-select__option--highlighted'>${match}</span>`),
                        focused: false,
                        classes: option.classes
                    }
                    options.push(_option)
                }
            }
        }

        this.filteredOptions = options

        return options
    }

    /*
     * Focus on the next option or first one if none
     */

    _focusNextOption = ()=>{

        let options = this.props.options

        if(this.filteredOptions)
            options = this.filteredOptions

        let index = this._getFocusedOptionIndex('down', options)
        let focusedOption = null

        if (index < options.length - 1 || index === null){
            let i = 0
            for (let option of options){
                if (index === null && i === 0){
                    focusedOption = option
                    break
                }
                else if (index !== null && index + 1 === i){
                    focusedOption = option
                    break
                }
                i++
            }
            this.setState({
                focusedOption
            })
        }
    }

    /*
     * Focus on the previous option
     */

    _focusPreviousOption = ()=>{

        let options = this.props.options

        if(this.filteredOptions)
            options = this.filteredOptions

        let index = this._getFocusedOptionIndex('up', options)
        let focusedOption = null

        if (index > 0){
            let i = 0
            for (let option of options){
                if (index !== null && index - 1 === i){
                    focusedOption = option
                    break
                }
                i++
            }
            this.setState({
                focusedOption
            })
        }
    }

    /*
     * Returns the index of the focused option, || null if none
     */

    _getFocusedOptionIndex = (direction, options)=>{

        if(!options)
            options = this.props.options

        if(!this.state.focusedOption)
            return null

        let i = 0
        for (let option of options){
            if (option.value === this.state.focusedOption.value){
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

    _selectFocusedOption = ()=>{

        if(!this.state.focusedOption)
            return

        for (let option of this.props.options){
            if (option.value === this.state.focusedOption.value)
                this._assignValue(option)
        }
    }

    /*
     * Find the focused option from the current value
     */

    _getFocusedOption = (value, options)=>{
        if(!options)
            options = this.props.options

        for (let option of options){
            if (option.value === value)
                return option
        }
    }

    /*
     * Adjust the scroll value of the option list to show the selected item
     */

    _setOptionScrollValue = (value, direction, options)=>{
        if(!value){
            value = this.props.value
        }
        if (this.refs['option-list'].children.length){
            let firstChild = this.refs['option-list'].children[0]
            let rect = firstChild.getBoundingClientRect()
            let optionHeight = rect.height
            let index = this._getOptionIndex(value, options)
            let scrollTo = (index * optionHeight)
            if(direction === 'up'){
                scrollTo = (index * optionHeight) - optionHeight
            }
            this.refs['option-list'].scrollTop = scrollTo
        }
    }

    /*
     * Find the index of the selected value
     */

    _getOptionIndex = (value, options)=>{

        if(!options)
            options = this.props.options

        let index = 0
        if (options.length > 0)
            for (let option of options){
                if (option.value === value)
                    return index
                index++
            }
    }

    /*
     * Get the placeholder when there's no options, depending on whether
     * it's a search select or standard fixed list
     */

    _getNoOptionPlaceholder = ()=>{

        /*
         * If we have an option search function, then we will be either
         * "type in" or no search results
         */
        if(this.state.searching === true){
            return this.props.searchingPlaceholder
        }
        else if(this.props.searchOptions && this.state.inputValue === ""){
            return this.props.noOptionPlaceholder
        }
        else if(this.props.searchOptions && typeof this.state.inputValue === "string"){
            return this.props.noResultsPlaceholder
        }
        else{
            return this.props.noOptionPlaceholder
        }

    }


}

Select.propTypes = {
    // String
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    help: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    noOptionPlaceholder: React.PropTypes.string,
    noResultsPlaceholder: React.PropTypes.string,
    searchingPlaceholder: React.PropTypes.string,

    // Array
    error: React.PropTypes.array,
    options: React.PropTypes.array,
    defaultOptions: React.PropTypes.array,

    // Function
    updateValue: React.PropTypes.func,

    searchOptions: React.PropTypes.func,
    minCharSearch: React.PropTypes.number,

    assignValue: React.PropTypes.func,
    handleFocus: React.PropTypes.func,
    handleBlur: React.PropTypes.func,
}

Select.defaultProps = {
    name: 'select',
    label: null,
    help: null,
    error: null,
    placeholder: 'Select item',
    updateValue: function(name, value){return},
    options: [],
    value: null,
    defaultOptions: null,
    noOptionPlaceholder: 'No options available',
    noResultsPlaceholder: 'No results found',
    searchingPlaceholder: '<span class="loader loader--small"></span> Searching...',
    minCharSearch: 2
}


export default Select
