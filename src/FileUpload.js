import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import GroupError from './Utils/GroupError'

const FIVE_MEBIBYTES = 5242880

class FileUpload extends Component {
    static propTypes = {
        controlOnly: PropTypes.bool,
        data: PropTypes.object,
        disabled: PropTypes.bool,
        error: PropTypes.string,
        errorAction: PropTypes.func.isRequired,
        helpText: PropTypes.node,
        maxFilesize: PropTypes.number,
        maxFilesizeHuman: PropTypes.string,
        name: PropTypes.string.isRequired,
        updateValue: PropTypes.func.isRequired,
        uploadAction: PropTypes.func.isRequired,
        value: PropTypes.string,
    }

    static defaultProps = {
        controlOnly: false,
        data: {},
        disabled: false,
        helpText: (
            <p>
                { 'Please upload the file in PDF format. ' }
                { 'The file size must not exceed 5MB.' }
            </p>
        ),
        maxFilesize: FIVE_MEBIBYTES,
        maxFilesizeHuman: '5MB',
        value: null,
    }

    state = {
        progress: null,
    }

    _onFileChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0]

            if (file.size > this.props.maxFilesize) {
                this.props.errorAction({
                    [ this.props.name ]: [
                        `The file size must be less than ${ this.props.maxFilesizeHuman }`,
                    ],
                })
            } else {
                this.setState({ progress: 0 })

                this.props.uploadAction(
                    e.target.files[0],
                    this.props.data,
                    (value) => {
                        this.props.updateValue({ [this.props.name]: value })
                        this.setState({ progress: null })
                    },
                    (progress) => {
                        this.setState({ progress })
                    }
                )
            }
        }
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--file',
        )

        let content = null

        if (this.props.value) {
            content = (
                <a
                    className="btn btn--primary"
                    href={ this.props.value }
                    target="_blank"
                >
                    { 'Download file' }
                </a>
            )
        } else {
            if (this.state.progress === null) {
                content = (
                    <input
                        accept="application/pdf,image/png"
                        disabled={ this.props.disabled }
                        onChange={ this._onFileChange }
                        type="file"
                    />
                )
            } else {
                const style = {
                    width: `${ Math.min(100, this.state.progress) }%`,
                }

                content = (
                    <div className="progress-bar">
                        <div className="progress-bar__meter" style={ style } />
                    </div>
                )
            }
        }

        const control = (
            <div className={ controlClasses }>
                { content }
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <GroupError error={ this.props.error } />

                { this.props.helpText }

                { control }
            </div>
        )
    }
}

export default FileUpload
