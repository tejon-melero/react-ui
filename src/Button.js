import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class Button extends Component {
    static propTypes = {
        buttonOnly: PropTypes.bool,
        children: PropTypes.node,
        className: PropTypes.string,
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
        className: '',
        disabled: false,
        fullWidth: false,
        large: false,
        loading: false,
        marginBottom: false,
        onClick: null,
        onMouseDown: null,
        type: 'button',
    }

    render() {
        const buttonClasses = classnames(
            'btn',
            this.props.className,
            {
                [`btn--${ this.props.status }`]: true,
                'btn--full-width': this.props.fullWidth,
                'btn--large': this.props.large,
                'btn--margin-bottom': this.props.marginBottom,
                'btn--loading': this.props.loading,
            }
        )

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
