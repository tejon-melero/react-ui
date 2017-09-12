import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function Button({
    buttonOnly,
    children,
    className,
    disabled,
    fullWidth,
    large,
    loading,
    onClick,
    onMouseDown,
    status,
    type,
}) {
    const buttonClasses = classnames(
        'btn',
        className,
        {
            [`btn--${ status }`]: status,
            'btn--full-width': fullWidth,
            'btn--large': large,
            'btn--loading': loading,
        }
    )

    const button = (
        <button
            className={ buttonClasses }
            disabled={ disabled || loading }
            onClick={ onClick }
            onMouseDown={ onMouseDown }
            type={ type }
        >
            { children }
        </button>
    )

    if (buttonOnly) {
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

Button.propTypes = {
    buttonOnly: PropTypes.bool,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    large: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    status: PropTypes.oneOf([ 'primary', 'create', 'change', 'cancel', 'delete' ]),
    type: PropTypes.oneOf([ 'submit', 'button', 'reset', 'menu' ]),
}

Button.defaultProps = {
    buttonOnly: false,
    className: '',
    disabled: false,
    fullWidth: false,
    large: false,
    loading: false,
    onClick: () => {},
    onMouseDown: () => {},
    status: null,
    type: 'button',
}
