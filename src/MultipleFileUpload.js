import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import GroupError from './Utils/GroupError'

import FileUpload from './FileUpload'

export default class MultipleFileUpload extends Component {
    static propTypes = {
        appendValue: PropTypes.func.isRequired,
        controlOnly: PropTypes.bool,
        data: PropTypes.object,
        disabled: PropTypes.bool,
        error: PropTypes.string,
        errorAction: PropTypes.func.isRequired,
        helpText: PropTypes.node,
        name: PropTypes.string.isRequired,
        uploadAction: PropTypes.func.isRequired,
        value: PropTypes.array,
    }

    static defaultProps = {
        controlOnly: false,
        data: {},
        disabled: false,
        errors: [],
        helpText: null,
        value: [],
    }

    _updateValue = (data) => {
        // tell the composing component to add this file to its internal structure
        this.props.appendValue(data[this.props.name])
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        let existingFiles = null

        if (this.props.value && this.props.value.length) {
            existingFiles = (
                <ul>
                    { this.props.value.map((item, index) => (
                        <li key={ index }>
                            <a href={ item.file } target="_blank">
                                { item.name }
                            </a>
                        </li>
                    )) }
                </ul>
            )
        }

        const control = (
            <div>
                { existingFiles }

                <FileUpload
                    controlOnly
                    data={ this.props.data }
                    disabled={ this.props.disabled }
                    errorAction={ this.props.errorAction }
                    helpText={ this.props.helpText }
                    name={ this.props.name }
                    updateValue={ this._updateValue }
                    uploadAction={ this.props.uploadAction }
                />
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <GroupError error={ this.props.error } />

                { control }
            </div>
        )
    }
}
