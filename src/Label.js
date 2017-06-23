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
        const { children, className, inline, ...labelProps } = this.props

        if (! children) {
            return null
        }

        const labelClasses = classnames(
            className,
            'form__label',
            { 'form__label--inline': inline }
        )

        return (
            <label { ...labelProps } className={ labelClasses }>
                { children }
            </label>
        )
    }
}
