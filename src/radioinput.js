"use strict";

import React, {Component} from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'

/*
 * Select box
 * with drop down scrollable, and can be navigated with top and button arrow keys
 */

class RadioInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            showTooltip: false,
            tooltipPosition: null,
            focused: false,
            options: this.props.options || [],
            available_options: null,
        }
    }

    // If props gets updated we change the state value

    componentWillReceiveProps(nextProps){
        let newState = {}

        if(nextProps.value !== this.state.value){
            newState = {
                value: nextProps.value
            }
        }

        if(this.props.options.length !== nextProps.options.length){
            newState.options = nextProps.options
        }

        if(newState !== {}){
            this.setState(newState)
        }
    }



    /*
     * Define the HTML for the field
     */

    render(){

        let value = this.state.value
        let input_id = `id_${this.props.name}`

        let groupClasses = classnames({
            'form__group':true,
            'form__group--error':this.props.error
            })

        let controlClasses = classnames({
            'form__control': true
            })

        /*
         * Add a default option for no selection
         */
        let optionList = null
        if(this.state.options.length > 0){
            let count = 0
            optionList = this.state.options.map((item)=>{
                count++
                let option_id = `${input_id}-${count}`
                return (<li key={ item.value }>
                        <label htmlFor={ option_id }>
                            <input
                                id={ option_id }
                                className="form__radio"
                                type="radio"
                                value={ item.value }
                                name={ this.props.name }
                                onChange={ this.handleChange.bind(this, item.value) }
                                onFocus={ this.handleFocus.bind(this) }
                                onBlur={ this.handleBlur.bind(this) }
                                checked={ item.value == this.state.value }
                            />
                            <span className="control-radio__label">{ item.label }</span>
                        </label>
                    </li>)
                }
            )
        }


        return (<div className={ groupClasses }>
            <Label>{ this.props.label }</Label>
            <FieldError error={ this.props.error } on={ this.state.showTooltip } position={ this.state.tooltipPosition } />
            <div className={ controlClasses } ref="form-control">
                <ul className="control-radio__options" >{ optionList }</ul>
                <Help help={ this.props.help } on={ this.state.showTooltip && !this.props.error } position={ this.state.tooltipPosition } />
                <SubHelp help={ this.props.sub_help }/>
            </div>
        </div>)
    }


    /*
     * Handle a radio value choice
     */

    handleChange(value, e){

        this.setState({
            value: value
            })

        this.props.updateValue(this.props.name, value)
    }


    /*
     * Handle focus
     */
    handleFocus(e){
        if(this.props.handleFocus)
            this.props.handleFocus(e)
    }

    /*
     * Handle focus
     */
    handleBlur(e){
        if(this.props.handleBlur)
            this.props.handleBlur(e)
    }


}

RadioInput.defaultProps = {
    name: 'select',
    value: null,
    label: null,
    help: null,
    error: null,
    updateValue: (name, value)=>{return},
    options: []
}

module.exports = RadioInput
