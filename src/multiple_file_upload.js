import React, { Component } from 'react'
import FileUpload from './file_upload'

class MultipleFileUpload extends Component {
    static propTypes = {
        appendValue: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
        errorAction: React.PropTypes.func.isRequired,
        errors: React.PropTypes.array,
        helpText: React.PropTypes.node,
        name: React.PropTypes.string.isRequired,
        uploadAction: React.PropTypes.func.isRequired,
        value: React.PropTypes.array,
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

export default MultipleFileUpload
