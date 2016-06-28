"use strict";

import React, { Component } from 'react'
import classnames from 'classnames'

class FieldError extends Component {
    render(){

        let errorClasses = classnames({
            'form__error': true,
            'form__error--tooltip': true,
            'form__error--tooltip-on': this.props.on
            })

        var errorStyle = null

        if(this.props.position)
            errorStyle = {
                bottom: this.props.position + 6
            }

        if(this.props.error)
            return (<div className={ errorClasses } style={ errorStyle }>
                { this.props.error }
                </div>)
        else
            return null
    }
}

module.exports = FieldError
