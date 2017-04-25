import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class GroupError extends Component {
    static propTypes = {
        error: PropTypes.string,
    }

    render() {
        if (! this.props.error) {
            return null
        }

        return (
            <div className="alert alert--error">
                { this.props.error }
            </div>
        )
    }
}
