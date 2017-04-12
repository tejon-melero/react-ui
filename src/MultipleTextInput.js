import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import Button from './Button'
import Label from './Label'
import SubHelp from './SubHelp'
import TextInput from './TextInput'

export default class MultipleTextInput extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        type: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    static defaultProps = {
        type: 'text',
    }

    constructor(props) {
        super(props)

        this.state = {
            value: props.value,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.value,
        })
    }

    _updateValue = (data) => {
        const newData = [ ...this.state.value ]

        for (const field in data) {
            // Remove the prefix from the field name
            const index = field.slice(this.props.name.length + 2)

            newData[index] = data[field]
        }

        this.props.updateValue({ [this.props.name]: newData })
    }

    _addNewField = () => {
        this.setState((state) => {
            return { value: [ ...state.value, '' ] }
        })
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
                    handleFocus={ this.props.handleFocus }
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
                            { 'Add another' }
                        </Button>
                    </div>
                </div>

                <SubHelp help={ this.props.subHelp } />
            </div>
        )
    }
}
