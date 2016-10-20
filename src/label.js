import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

export default class Label extends Component {
    static propTypes = {
        children: PropTypes.arrayOf(PropTypes.node),
        inline: PropTypes.bool,
    }

    static defaultProps = {
        inline: false,
    }

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
