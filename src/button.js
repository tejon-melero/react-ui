import React, { Component, PropTypes } from 'react'

import classnames from 'classnames'

export default class Button extends Component {
    static propTypes = {
        buttonOnly: PropTypes.bool,
        children: PropTypes.node,
        disabled: PropTypes.bool,
        fullWidth: PropTypes.bool,
        large: PropTypes.bool,
        loading: PropTypes.bool,
        marginBottom: PropTypes.bool,
        onClick: PropTypes.func,
        onMouseDown: PropTypes.func,
        status: PropTypes.oneOf([ 'primary', 'create', 'change', 'cancel', 'delete' ]),
        type: PropTypes.oneOf([ 'submit', 'button', 'reset', 'menu' ]),
    }

    static defaultProps = {
        buttonOnly: false,
        disabled: false,
        fullWidth: false,
        large: false,
        loading: false,
        marginBottom: false,
        onClick: (e) => e.preventDefault(),
        onMouseDown: (e) => e.preventDefault(),
        type: 'button',
    }

    render() {
        const buttonClasses = classnames({
            'btn': true,
            'btn--primary': this.props.status === 'primary',
            'btn--create': this.props.status === 'create',
            'btn--change': this.props.status === 'change',
            'btn--cancel': this.props.status === 'cancel',
            'btn--delete': this.props.status === 'delete',
            'btn--full-width': this.props.fullWidth,
            'btn--large': this.props.large,
            'btn--margin-bottom': this.props.marginBottom,
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
