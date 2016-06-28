"use strict";

import React, {Component} from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'
// DatePicker = require './datepicker.coffee'

class TextInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value,
            showTooltip: false,
            tooltipPosition: null
        }
    }

    /*
     * Define the HTML for the field
     */

    render(){
        let value = this.state.value
        let inputId = "id_#{this.props.name}"

        let groupClasses = classnames({
            'form__group':true,
            'form__group--error':this.props.error
            })

        let controlClasses = classnames({
            'form__control':true,
            'form__control--text':true,
            'form__control--text-success':this.props.success,
            'form__control--text-error':this.props.error
            })

        var field = null
        var helpUI = null

        if (this.props.type === 'textarea')
            field = (<textarea
                    ref="input"
                    id={ inputId }
                    className="form__text form__textarea"
                    type={ this.props.type }
                    value={ value }
                    name={ this.props.name }
                    placeholder={ this.props.placeholder }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }
                />)
        else
            field = (<input
                    ref="input"
                    id={ inputId }
                    className="form__text"
                    type={ this.props.type }
                    value={ value }
                    name={ this.props.name }
                    placeholder={ this.props.placeholder }
                    onChange={ this.handleChange }
                    onFocus={ this.handleFocus }
                    onBlur={ this.handleBlur }
                />)

        if (this.props.datePicker)
            helpUI = (<DatePicker
                ref="datepicker"
                date={ moment(value) }
                onChange={ this.handleDateChange }
                dateFormat={ this.props.dateFormat || null}
                weekDayStart={ this.props.weekDayStart || null}
                position={ this.state.tooltipPosition }
                alignment={ this.state.datePickerAlignment }
                />)
        else
            helpUI = (<Help help={ this.props.help }
                    on={ this.state.showTooltip && !this.props.error }
                    position={ this.state.tooltipPosition } />)

        return (<div className={ groupClasses }>

            <Label for={ inputId }>
                { this.props.label }
            </Label>
            <div className={ controlClasses } ref="form-control">
                <FieldError error={ this.props.error }
                    on={ this.state.showTooltip }
                    position={ this.state.tooltipPosition } />
                { field }
                { helpUI }
            </div>
            <SubHelp help={ this.props.sub_help }/>
        </div>)
    }

    /*
     * If props gets updated we change the state value
     */

    componentWillReceiveProps(nextProps){
        this.setState({
            value: nextProps.value
            })
    }

    /*
     * Assigned the value upstream
     */

    handleChange = (e)=>{
        let value = e.target.value

        if (this.props.type == 'email')
            if (!this.is_email_valid(value))
                this.setState({
                    error: 'Please enter a valid email address.'
                })
            else
                this.setState({
                    error: null
                })

        this.setState({
            value: value
            })

        this.props.updateValue(this.props.name, value)
    }

    /*
     * Handle focus
     */

    handleFocus = (e)=>{

        let position = this.refs['form-control'].getBoundingClientRect()
        let tooltipPosition = position.height

        let newState = {
            showTooltip: true,
            tooltipPosition: tooltipPosition
            }

        if (this.props.datePicker === true){
            if ((position.top + position.height / 2) < window.innerHeight / 2)
                newState.datePickerAlignment = 'bottom'
            else
                newState.datePickerAlignment = 'top'
            this._listenDatePickerClick()
            this._datePickerON = true
        }

        this.setState(newState)

        if (this.props.handleFocus)
            this.props.handleFocus()
    }

    /*
     * Handle blur
     */

    handleBlur = (e)=>{

        if (this._datePickerON !== true)
            this.setState({
                showTooltip: false,
                tooltipPosition: null
                })

            if (this.props.handleBlur)
                this.props.handleBlur()
    }

    /*
     * Handle value change from the date picker
     */

    handleDateChange = (value)=>{

        this._datePickerON = false
        cb = ()=>{
            this.handleBlur()
            this._stopListenDatePickerClick()
        }

        this.props.updateValue(this.props.name, value, cb)
    }

    /*
     * Start listening to click events, if the user click out of the date picker,
     * then hide it.
     */

    _listenDatePickerClick(){
        this._listener = (e)=>
            this.checkDatePickerPosition(e)
        document.addEventListener('click', this._listener, false)
    }

    /*
     * Stop listening to click events
     */

    _stopListenDatePickerClick(){
        document.removeEventListener('click', this._listener, false)
    }

    /*
     * Check if the mouse click is within the datepicker or form-control area
     * If the mouse click is outside of the area, then we hide the date picker
     */

    checkDatePickerPosition = (e)=>{

        if (this._datePickerON === true)

            // Get the area covered by the date picker
            pDP = ReactDOM.findDOMNode(this.refs['datepicker']).getBoundingClientRect()
            pFC = this.refs['form-control'].getBoundingClientRect()

            // Get the position of the mouse
            mouseX = e.clientX
            mouseY = e.clientY

            if (pDP.left < mouseX < pDP.right && pDP.top < mouseY < pDP.bottom){}
            else if (pFC.left < mouseX < pFC.right && pFC.top < mouseY < pFC.bottom){}
            else{
                this._datePickerON = false
                this.handleBlur()
                this._stopListenDatePickerClick()
            }
    }

    /*
     * Validate email
     */

    is_email_valid(value){
        re = /^[\w]+this.[\w]+\.[a-z\.]+$/
        return re.test(value)
    }

}

TextInput.defaultProps = {
    type: 'text',
    name: 'email',
    value: null,
    label: null,
    help: null,
    error: null,
    initial: '',
    placeholder: null,
    updateValue: function(name, value){
        return
    },
    datePicker: false
}

module.exports = TextInput
