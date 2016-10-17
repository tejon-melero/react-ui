import React, { Component } from 'react'
import classnames from 'classnames'

class Button extends Component {
    render() {
        const buttonClasses = classnames({
            'btn': true,
            'btn--primary': this.props.status === 'primary',
            'btn--create': this.props.status === 'create',
            'btn--change': this.props.status === 'change',
            'btn--cancel': this.props.status === 'cancel',
            'btn--delete': this.props.status === 'delete',
            'btn--full-width': Boolean(this.props.fullWidth),
            'btn--large': Boolean(this.props.large),
            'btn--margin-bottom': Boolean(this.props.marginBottom),
            'btn--loading': this.props.loading,
        })

        const button = (
            <button
                className={ buttonClasses }
                disabled={ this.props.disabled || this.props.loading }
                onClick={ (e) => this.props.onClick(e) }
                onMouseDown={ (e) => this.props.onMouseDown(e) }
                type={ this.props.type }
            >
                <span className="btn__text">{ this.props.children || 'Submit' }</span>
            </button>
        )

        if (this.props.buttonOnly) {
            return button
        }

        return (
            <div className="form__group">
                <div className="form__control">
                    { button }
                </div>
            </div>
        )
    }
}

Button.defaultProps = {
    disabled: false,
    loading: false,
    onClick: (e) => e.preventDefault(),
    onMouseDown: (e) => e.preventDefault(),
    type: 'submit',
}

export default Button
