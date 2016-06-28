"use strict";

import React, {Component} from 'react'
import classnames from 'classnames'

class Button extends Component {

    constructor(props) {
        super(props)
    }

    render(){

        let buttonClasses = classnames({
            'btn':true,
            'btn--primary': this.props.status == 'primary',
            'btn--create': this.props.status == 'create',
            'btn--change': this.props.status == 'change',
            'btn--cancel': this.props.status == 'cancel',
            'btn--delete': this.props.status == 'delete',
            'btn--full-width':!!this.props.fullWidth,
            'btn--large':!!this.props.large,
            'btn--margin-bottom':!!this.props.marginBottom,
            'btn--loading': this.props.loading
            })

        let button = <button 
                    type={ this.props.type } 
                    onClick={ this.handleClick } 
                    className={ buttonClasses }
                    disabled={ this.props.disabled || this.props.loading }>
                    <span className="btn__text">{ this.props.children || "submit" }</span>
                </button>
                
        if(this.props.buttonOnly){
            return button
        }

        return (<div className="form__group">
            <div className="form__control">
                {button}
            </div>
        </div>)
    }

    handleClick = (e)=>{
        this.props.onClick(e)
    }
}

Button.defaultProps = {
    type: 'submit',
    loading: false,
    disabled: false,
    onClick: function(e){
        e.preventDefault()
    }
}

module.exports = Button