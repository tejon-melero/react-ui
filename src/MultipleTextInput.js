import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { formControlPropTypes, focussablePropTypes } from './Utils'

import SubContent from './Utils/SubContent'

import Button from './Button'
import Label from './Label'
import TextInput from './TextInput'

export default class MultipleTextInput extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...focussablePropTypes,

        type: PropTypes.string,
        value: PropTypes.arrayOf(PropTypes.string).isRequired,
    }

    static defaultProps = {
        disabled: false,
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
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        }, this.props.extraGroupClasses)

        let fields = null

        const { value } = this.state.value

        if (value && value.length) {
            fields = value.map((item, index) => (
                <TextInput
                    controlOnly
                    disabled={ this.props.disabled }
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
                <Label>{ this.props.label }</Label>

                <div className="form__control">
                    { fields }
                </div>

                <div className="grid grid--break-mobile">
                    <div className="pull-right">
                        <Button
                            buttonOnly
                            disabled={ this.props.disabled }
                            onClick={ this._addNewField }
                            status="create"
                        >
                            { 'Add another' }
                        </Button>
                    </div>
                </div>

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
