import React from 'react'
import PropTypes from 'prop-types'

export default function SubContent({ errors, help }) {
    if (errors && errors.length) {
        return (
            <div className="form__error">
                { errors.map((error, index) => <div key={ index }>{ error }</div>) }
            </div>
        )
    }

    if (help) {
        return (
            <div className="form__help">
                { help }
            </div>
        )
    }

    return null
}

SubContent.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.node),
    help: PropTypes.node,
}
