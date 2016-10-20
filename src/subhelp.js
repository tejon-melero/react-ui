import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

export default class SubHelp extends Component {
    static propTypes = {
        help: PropTypes.node,
    }

    render() {
        const helpClasses = classnames({
            'form__help': true,
            'form__help--sub': true,
        })

        if (this.props.help) {
            return <div className={ helpClasses }>{ this.props.help }</div>
        }

        return null
    }
}
