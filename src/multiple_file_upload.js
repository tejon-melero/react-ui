import React, { Component, PropTypes } from 'react'
import FileUpload from './file_upload'

export default class MultipleFileUpload extends Component {
    static propTypes = {
        appendValue: PropTypes.func.isRequired,
        data: PropTypes.object,
        errorAction: PropTypes.func.isRequired,
        errors: PropTypes.array,
        helpText: PropTypes.node,
        name: PropTypes.string.isRequired,
        uploadAction: PropTypes.func.isRequired,
        value: PropTypes.array,
    }

    static defaultProps = {
        data: {},
        errors: [],
        helpText: null,
        value: [],
    }

    _updateValue = (data) => {
        // tell the composing component to add this file to its internal structure
        this.props.appendValue(data[this.props.name])
    }

    render() {
        let existingFiles = null

        if (this.props.value && this.props.value.length) {
            existingFiles = (
                <ul>
                    {
                        this.props.value.map((item, index) => (
                            <li key={ index }>
                                <a href={ item.file } target="_blank">
                                    { item.name }
                                </a>
                            </li>
                        ))
                    }
                </ul>
            )
        }

        return (
            <div>
                { existingFiles }

                <FileUpload
                    data={ this.props.data }
                    errorAction={ this.props.errorAction }
                    errors={ this.props.errors }
                    helpText={ this.props.helpText }
                    name={ this.props.name }
                    updateValue={ this._updateValue }
                    uploadAction={ this.props.uploadAction }
                />
            </div>
        )
    }
}
