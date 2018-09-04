import React, { Component } from 'react'
import classnames from 'classnames'

import {
    focussablePropTypes,
    formControlPropTypes,
    generateId,
    hasOptionsPropTypes,
} from './Utils'

import SubContent from './Utils/SubContent'

import Label from './Label'

export default class Radio extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
        ...focussablePropTypes,
    }

    static defaultProps = {
        disabled: false,
    }

    constructor(props) {
        super(props)

        this.state = {
            value: this.props.value,
            showTooltip: false,
            tooltipPosition: null,
            focused: false,
            options: this.props.options || [],
            available_options: null,
        }
    }

    componentWillReceiveProps(nextProps) {
        const newState = {}

        if (nextProps.value !== this.state.value) {
            newState.value = nextProps.value
        }

        if (this.props.options.length !== nextProps.options.length) {
            newState.options = nextProps.options
        }

        if (newState !== {}) {
            this.setState(newState)
        }
    }

    inputId = this.props.id || generateId(this.props.name)

    _handleChange = (value) => {
        this.setState(
            { value },
            () => { this.props.updateValue({ [this.props.name]: value }) }
        )
    }

    _handleFocus = (e) => {
        this.props.handleFocus && this.props.handleFocus(e)
    }

    _handleBlur = (e) => {
        this.props.handleBlur && this.props.handleBlur(e)
    }

    render() {
        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.errors && this.props.errors.length,
        }, this.props.extraGroupClasses)

        let optionList = null

        if (this.state.options.length > 0) {
            optionList = this.state.options.map((item, index) => {
                const optionId = `${ this.inputId }-${ index }`

                return (
                    <li key={ item.value }>
                        <label htmlFor={ optionId }>
                            <input
                                checked={ item.value === this.state.value }
                                className="form__radio"
                                disabled={ this.props.disabled }
                                id={ optionId }
                                name={ this.props.name }
                                onBlur={ this._handleBlur }
                                onChange={ () => this._handleChange(item.value) }
                                onFocus={ this._handleFocus }
                                type="radio"
                                value={ item.value }
                            />
                            <span className="control-radio__label">{ item.label }</span>
                        </label>
                    </li>
                )
            })
        }

        return (
            <div className={ groupClasses }>
                <Label>{ this.props.label }</Label>

                <div className="form__control">
                    <ul className="control-radio__options" >
                        { optionList }
                    </ul>
                </div>

                <SubContent errors={ this.props.errors } help={ this.props.help } />
            </div>
        )
    }
}
