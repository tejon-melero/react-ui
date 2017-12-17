import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function Button({
    buttonOnly,
    children,
    className,
    disabled,
    display,
    fullWidth,
    loading,
    size,
    status,
    ...props
}) {
    const buttonClasses = classnames(
        'btn',
        className,
        {
            [`btn--${ display }`]: display,
            [`btn--${ status }`]: status,
            [`btn--${ size }`]: size,
            'btn--full-width': fullWidth,
            'btn--loading': loading,
        }
    )

    const button = (
        <button
            { ...props }
            className={ buttonClasses }
            disabled={ disabled || loading }
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
    display: PropTypes.oneOf([ 'outline', 'link' ]),
    fullWidth: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseDown: PropTypes.func,
    size: PropTypes.oneOf([ 'small', 'large' ]),
    status: PropTypes.oneOf([ 'primary', 'create', 'change', 'cancel', 'link' ]),
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
    type: 'button',
}
