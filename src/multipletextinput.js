import React, { Component } from 'react'
import classnames from 'classnames'
import {
    Button,
    Label,
    SubHelp,
    TextInput,
} from '.'

class MultipleTextInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: props.value,
        }

        this._updateValue = this._updateValue.bind(this)
        this._addNewField = this._addNewField.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
        })
    }

    _updateValue(data) {
        const newData = [ ...this.state.value ]

        for (const field in data) {
            // remove the prefix from the field name
            const index = field.slice(this.props.name.length + 2)

            newData[index] = data[field]
        }

        this.props.updateValue({ [this.props.name]: newData })
    }

    _addNewField() {
        this.setState({ value: [ ...this.state.value, '' ] })
    }

    render() {
        const value = this.state.value
        const inputId = `id_${ this.props.name }`

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        let fields = []

        if (value && value.length) {
            fields = value.map((item, index) => (
                <TextInput
                    handleBlur={ this.props.handleBlur }
                    key={ index }
                    name={ `${ this.props.name }__${ index }` }
                    type={ this.props.type }
                    updateValue={ this._updateValue }
                    value={ item }
                />
            ))
        }

        return (
            <div className={ groupClasses }>
                <Label for={ inputId }>{ this.props.label }</Label>

                { fields }

                <div className="grid grid--break-mobile">
                    <div className="pull-right">
                        <Button
                            buttonOnly
                            onClick={ this._addNewField }
                            status="create"
                        >
                            Add another
                        </Button>
                    </div>
                </div>

                <SubHelp help={ this.props.sub_help } />
            </div>
        )
    }
}

MultipleTextInput.propTypes = {
    updateValue: React.PropTypes.func,
    value: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
}

MultipleTextInput.defaultProps = {
    updateValue: () => {},
}

export default MultipleTextInput
