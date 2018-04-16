import React from 'react'
import PropTypes from 'prop-types'

export default function SubContent({ errors, help }) {
    return (
        <div className="form__help">
            { errors && errors.map((error, index) => (
                <div key={ index }>{ error }</div>
            )) }

            { ! (errors && errors.length > 0) && help }
        </div>
    )
}

SubContent.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.node),
    help: PropTypes.node,
}
