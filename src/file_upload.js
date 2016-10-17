import React, { Component } from 'react'

const FIVE_MEBIBYTES = 5242880

class FileUpload extends Component {
    static propTypes = {
        data: React.PropTypes.object,
        errorAction: React.PropTypes.func.isRequired,
        errors: React.PropTypes.array,
        helpText: React.PropTypes.node,
        name: React.PropTypes.string.isRequired,
        updateValue: React.PropTypes.func.isRequired,
        uploadAction: React.PropTypes.func.isRequired,
        value: React.PropTypes.string,
    }

    static defaultProps = {
        data: {},
        errors: [],
        helpText: (
            <p>
                Please upload the file in PDF format.
                The file size must not exceed 5MB.
            </p>
        ),
        value: null,
    }

    constructor(props) {
        super(props)

        this.state = {
            progress: null,
        }
    }

    _onFileChange = (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0]

            if (file.size > FIVE_MEBIBYTES) {
                this.props.errorAction({ [ this.props.name ]: [ 'The file size must be less than 5MB' ] })
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
        let errors = null

        if (this.props.errors && this.props.errors.length) {
            errors = (
                <div className="alert alert--error">
                    { this.props.errors.map(
                        (error, index) => <span key={ index }>{ error }<br /></span>
                    ) }
                </div>
            )
        }

        let content = null

        if (this.props.value) {
            content = (
                <a
                    className="btn btn--primary"
                    href={ this.props.value }
                    target="_blank"
                >
                    Download file
                </a>
            )
        } else {
            if (this.state.progress === null) {
                content = (
                    <input
                        accept="application/pdf,image/png"
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
            <div>
                { errors }
                { this.props.helpText }
                { content }
            </div>
        )
    }
}

export default FileUpload
