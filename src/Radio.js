import React, { Component } from 'react'
import classnames from 'classnames'

import { formControlPropTypes, hasOptionsPropTypes, focussablePropTypes } from './Utils'

import GroupError from './Utils/GroupError'
import Help from './Utils/Help'
import SubHelp from './Utils/SubHelp'

import Label from './Label'

export default class Radio extends Component {
    static propTypes = {
        ...formControlPropTypes,
        ...hasOptionsPropTypes,
        ...focussablePropTypes,
    }

    static defaultProps = {
        controlOnly: false,
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
        const input_id = `id_${ this.props.name }`

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames(
            'form__control',
            'form__control--radio',
        )

        /*
         * Add a default option for no selection
         */
        let optionList = null

        if (this.state.options.length > 0) {
            optionList = this.state.options.map((item, index) => {
                const option_id = `${ input_id }-${ index }`

                return (
                    <li key={ item.value }>
                        <label htmlFor={ option_id }>
                            <input
                                checked={ item.value === this.state.value }
                                className="form__radio"
                                disabled={ this.props.disabled }
                                id={ option_id }
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

        const control = (
            <div className={ controlClasses }>
                <Label>{ this.props.label }</Label>

                <ul className="control-radio__options" >{ optionList }</ul>

                <Help
                    help={ this.props.help }
                    on={ this.state.showTooltip && ! this.props.error }
                    position={ this.state.tooltipPosition }
                />

                <SubHelp help={ this.props.subHelp }/>
            </div>
        )

        if (this.props.controlOnly) {
            return control
        }

        return (
            <div className={ groupClasses }>
                <GroupError error={ this.props.error } />

                { control }
            </div>
        )
    }
}
