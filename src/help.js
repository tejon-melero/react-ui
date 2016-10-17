import React, { Component } from 'react'
import classnames from 'classnames'

class Help extends Component {
    render() {
        if (! this.props.help) {
            return null
        }

        // TODO: work this into styles, as padding and margin shouldn't be in the code, see Cotidia/react-ui#1
        const BOTTOM_MARGIN = 6

        const helpClasses = classnames({
            'form__help': true,
            'form__help--tooltip': true,
            'form__help--tooltip-on': this.props.on,
        })

        let helpStyle = null

        if (this.props.position) {
            helpStyle = {
                bottom: this.props.position + BOTTOM_MARGIN,
            }
        }

        return (
            <div className={ helpClasses } style={ helpStyle }>
                { this.props.help }
            </div>
        )
    }
}

export default Help
