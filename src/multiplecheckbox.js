"use strict";

import React, {Component} from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'
import Checkbox from './checkbox'

/*
 * A list of checkboxes options
 */

class MultipleCheckbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
        if(props.value){
            this.state.data = props.value
        }
        else{
            this.state.data = {}
        }
        this._onOptionSelect = this._onOptionSelect.bind(this)
        this._getCurrentValue = this._getCurrentValue.bind(this)
    }
    _onOptionSelect(key, value, cb){
        let data = this.state.data
        if(value === true){
            if(this.state.data.indexOf(key) === -1){
                data.push(key)
            }
        }else{
            let index = this.state.data.indexOf(key);
            this.state.data.splice(index, 1);
        }
        this.setState({
            data
        }, ()=>{
            this.props.updateValue(this.props.name, this.state.data)
        })
    }
    _getCurrentValue(key){
        if(this.props.value){
            for ( const k of this.props.value){
                if(key === k){
                    return true
                }
            }
        }
        return false
    }
    render(){
        let optionList = null
        if(this.props.options){
            optionList = this.props.options.map((option)=>{
                return <Checkbox 
                    key={option.value}
                    name={option.value}
                    label={option.label}
                    updateValue={this._onOptionSelect} 
                    value={this._getCurrentValue(option.value)}/>
                })

        }
        let error = null
        if(this.props.error){
            error = <div className="alert alert--error">
                    { this.props.error }
                </div>
        }
        return (<div>{error}{optionList}</div>)
    }
}

module.exports = MultipleCheckbox