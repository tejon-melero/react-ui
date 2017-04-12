import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class Label extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        inline: PropTypes.bool,
    }

    static defaultProps = {
        inline: false,
    }

    render() {
        if (! this.props.children) {
            return null
        }

        const labelClasses = classnames(
            this.props.className,
            'form__label',
            { 'form__label--inline': this.props.inline }
        )

        return (
            <label className={ labelClasses }>
                { this.props.children }
            </label>
        )
    }
}
