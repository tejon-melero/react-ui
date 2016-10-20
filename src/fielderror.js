import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

// TODO: work this into styles, as padding and margin shouldn't be in the code, see Cotidia/react-ui#1
const BOTTOM_MARGIN = 6

export default class FieldError extends Component {
    static propTypes = {
        error: PropTypes.string,
        on: PropTypes.bool,
        position: PropTypes.number,
    }

    static defaultProps = {
        on: false,
    }

    render() {
        if (! this.props.error) {
            return null
        }

        const errorClasses = classnames({
            'form__error': true,
            'form__error--tooltip': true,
            'form__error--tooltip-on': this.props.on,
        })

        const errorStyle = {}

        if (this.props.position) {
            errorStyle.bottom = this.props.position + BOTTOM_MARGIN
        }

        return (
            <div className={ errorClasses } style={ errorStyle }>
                { this.props.error }
            </div>
        )
    }
}
