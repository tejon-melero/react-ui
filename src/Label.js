import React from 'react'
import PropTypes from 'prop-types'

export default function Label({ children, className, ...labelProps }) {
    if (! children) {
        return null
    }

    return (
        <label { ...labelProps } className={ `form__label ${ className || '' }` }>
            { children }
        </label>
    )
}

Label.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
}
