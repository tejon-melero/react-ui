import React, { Component } from 'react'
import classnames from 'classnames'

class Label extends Component {
    render() {
        if (! this.props.children) {
            return null
        }

        const labelClasses = classnames({
            'form__label': true,
            'form__label--inline': this.props.inline,
        })

        return (
            <label className={ labelClasses }>
                { this.props.children }
            </label>
        )
    }
}

export default Label
