import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, generateId } from './Utils'

import SubContent from './Utils/SubContent'

import Label from './Label'

const FIVE_MEBIBYTES = 5242880

export default class FileUpload extends Component {
    static propTypes = {
        accept: PropTypes.string,
        data: PropTypes.object,
        disabled: formControlPropTypes.disabled,
        errorAction: PropTypes.func.isRequired,
        errors: formControlPropTypes.errors,
        help: formControlPropTypes.help,
        label: formControlPropTypes.label,
        maxFilesize: PropTypes.number,
        maxFilesizeHuman: PropTypes.string,
        name: formControlPropTypes.name,
        updateValue: formControlPropTypes.updateValue,
        uploadAction: PropTypes.func.isRequired,
        value: PropTypes.string,
    }

    static defaultProps = {
        accept: 'application/pdf,image/png',
        data: {},
        disabled: false,
        help: (
            <p>
                { 'Please upload a file in PDF/PNG format. ' }
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
        const inputId = generateId(this.props.name)

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        })

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
                        accept={ this.props.accept }
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

        return (
            <div className={ groupClasses }>
                <Label htmlFor={ inputId }>{ this.props.label }</Label>

                <div className="form__control form__control--borderless">
                    { content }
                </div>

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
