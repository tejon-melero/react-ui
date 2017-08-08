import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

// TODO: work this into styles, as padding and margin shouldn't be in the code, see Cotidia/react-ui#1
const BOTTOM_MARGIN = 6

const FieldError = ({ error, on, position }) => {
    if (! error) {
        return null
    }

    const errorClasses = classnames({
        'form__error': true,
        'form__error--tooltip': true,
        'form__error--tooltip-on': on,
    })

    const errorStyle = {}

    if (position) {
        errorStyle.bottom = position + BOTTOM_MARGIN
    }

    return (
        <div className={ errorClasses } style={ errorStyle }>
            { error }
        </div>
    )
}

FieldError.propTypes = {
    error: PropTypes.string,
    on: PropTypes.bool,
    position: PropTypes.number,
}

FieldError.defaultProps = {
    on: false,
}

export default FieldError
