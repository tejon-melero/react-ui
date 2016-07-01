import React, { Component } from 'react'
import classnames from 'classnames'

class Help extends Component {
    render() {
        let helpClasses = classnames({
            'form__help': true,
            'form__help--tooltip': true,
            'form__help--tooltip-on': this.props.on
        })

        var helpStyle = null

        if (this.props.position) {
            helpStyle = {
                bottom: this.props.position + 6
            }
        }

        if (this.props.help) {
            return (
                <div className={ helpClasses } style={ helpStyle }>
                    { this.props.help }
                </div>
            )
        } else {
            return null
        }
    }
}

export default Help
