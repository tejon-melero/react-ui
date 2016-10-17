import React, { Component } from 'react'
import classnames from 'classnames'

class SubHelp extends Component {
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

export default SubHelp
