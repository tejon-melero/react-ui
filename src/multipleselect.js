"use strict"

import React, {Component} from 'react'
import Select from './select'

class MultipleSelect extends Component{
    constructor(props) {
        super(props)
        this.state = {
            value: null,
            selectedList: []
        }
        this._updateValue = this._updateValue.bind(this)
    }
    _updateValue(name, value){
        console.log("updateValue", name, value)
        console.log("Current options", this.props.options)
        let selected = this._getSelectedOption(value)
        this._addSelected(selected)
        console.log("selected", selected)
    }
    _getSelectedOption(value){
        for(let option of this.props.options){
            if(option.value === value){
                return option
            }
        }
        return null
    }
    _addSelected(option){
        let currentList = this.state.selectedList
        currentList.push(option)
        this.setState({
            selectedList: currentList
        }, ()=>{
            this.props.updateValue(this.props.name, this._makeValueList())
        })
    }
    _clearOption(option, e){
        e.preventDefault()
        let newList = []
        for(let opt of this.state.selectedList){
            console.log(opt.value, option.value, opt.value !== option.value)
            if(opt.value !== option.value){
                newList.push(opt)
            }
        }
        this.setState({
            selectedList: newList
        }, ()=>{
            this.props.updateValue(this.props.name, this._makeValueList())
        })
    }
    _makeValueList(){
        let valueList = []
        for(let opt of this.state.selectedList){
            valueList.push(opt.value)
        }
        return valueList
    }
    render(){
        let selectedItem = null
        if(this.state.selectedList.length){
            let inc = 0
            selectedItem = this.state.selectedList.map((option)=>{
                inc++
                return (<div key={ inc } className="label">
                    { option.label }
                    <a href="#" onClick={ this._clearOption.bind(this, option) }>&times;</a>
                    </div>)
            })
        }
        return (<div>
                <Select
                    name={ this.props.name }
                    value={ this.state.value }
                    updateValue={ this._updateValue }
                    error={ this.props.error }
                    options={ this.props.options }
                    searchOptions={ this.props.searchOptions }
                    />
                { selectedItem }
            </div>)
    }
}

module.exports = MultipleSelect
