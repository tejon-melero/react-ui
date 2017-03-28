import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

// TODO: work this into styles, as padding and margin shouldn't be in the code, see Cotidia/react-ui#1
const BOTTOM_MARGIN = 6

export default class Help extends Component {
    static propTypes = {
        help: PropTypes.node,
        on: PropTypes.bool,
        position: PropTypes.number,
    }

    static defaultProps = {
        on: false,
    }

    render() {
        if (! this.props.help) {
            return null
        }

        const helpClasses = classnames({
            'form__help': true,
            'form__help--tooltip': true,
            'form__help--tooltip-on': this.props.on,
        })

        const helpStyle = {}

        if (this.props.position) {
            helpStyle.bottom = this.props.position + BOTTOM_MARGIN
        }

        return (
            <div className={ helpClasses } style={ helpStyle }>
                { this.props.help }
            </div>
        )
    }
}
