import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes } from './Utils'

import SubContent from './Utils/SubContent'

import FileUpload from './FileUpload'

export default class MultipleFileUpload extends Component {
    static propTypes = {
        appendValue: PropTypes.func.isRequired,
        data: PropTypes.object,
        disabled: formControlPropTypes.disabled,
        errorAction: PropTypes.func.isRequired,
        errors: formControlPropTypes.errors,
        help: formControlPropTypes.help,
        name: formControlPropTypes.name,
        uploadAction: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.string),
    }

    static defaultProps = {
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
            'form__group--error': this.props.errors && this.props.errors.length,
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

        return (
            <div className={ groupClasses }>
                <div className="form__control">
                    { existingFiles }

                    <FileUpload
                        controlOnly
                        data={ this.props.data }
                        disabled={ this.props.disabled }
                        errorAction={ this.props.errorAction }
                        name={ this.props.name }
                        updateValue={ this._updateValue }
                        uploadAction={ this.props.uploadAction }
                    />
                </div>

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
