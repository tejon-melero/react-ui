import React, { Component } from 'react'
import classnames from 'classnames'

class FieldError extends Component {
    render() {
        if (! this.props.error) {
            return null
        }

        // TODO: work this into styles, as padding and margin shouldn't be in the code, see Cotidia/react-ui#1
        const BOTTOM_MARGIN = 6

        const errorClasses = classnames({
            'form__error': true,
            'form__error--tooltip': true,
            'form__error--tooltip-on': this.props.on,
        })

        let errorStyle = null

        if (this.props.position) {
            errorStyle = {
                bottom: this.props.position + BOTTOM_MARGIN,
            }
        }

        return (
            <div className={ errorClasses } style={ errorStyle }>
                { this.props.error }
            </div>
        )
    }
}

export default FieldError
