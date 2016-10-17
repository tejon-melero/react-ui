import React, { Component } from 'react'
import classnames from 'classnames'
import Label from './label'
import FieldError from './fielderror'
import Help from './help'
import SubHelp from './subhelp'

class RadioInput extends Component {
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

        this._handleChange = this._handleChange.bind(this)
        this._handleFocus = this._handleFocus.bind(this)
        this._handleBlur = this._handleBlur.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        let newState = {}

        if (nextProps.value !== this.state.value) {
            newState = {
                value: nextProps.value,
            }
        }

        if (this.props.options.length !== nextProps.options.length) {
            newState.options = nextProps.options
        }

        if (newState !== {}) {
            this.setState(newState)
        }
    }

    /*
     * Handle a radio value choice
     */
    _handleChange(value) {
        this.setState(
            { value },
            () => { this.props.updateValue({ [this.props.name]: value }) }
        )
    }

    /*
     * Handle focus
     */
    _handleFocus(e) {
        this.props.handleFocus && this.props.handleFocus(e)
    }

    /*
     * Handle focus
     */
    _handleBlur(e) {
        this.props.handleBlur && this.props.handleBlur(e)
    }

    render() {
        const input_id = `id_${ this.props.name }`

        const groupClasses = classnames({
            'form__group': true,
            'form__group--error': this.props.error,
        })

        const controlClasses = classnames({
            'form__control': true,
        })

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

        return (
            <div className={ groupClasses }>
                <Label>{ this.props.label }</Label>
                <FieldError
                    error={ this.props.error }
                    on={ this.state.showTooltip }
                    position={ this.state.tooltipPosition }
                />
                <div className={ controlClasses } ref="form-control">
                    <ul className="control-radio__options" >{ optionList }</ul>
                    <Help
                        help={ this.props.help }
                        on={ this.state.showTooltip && !this.props.error }
                        position={ this.state.tooltipPosition }
                    />
                    <SubHelp help={ this.props.sub_help }/>
                </div>
            </div>
        )
    }
}

RadioInput.defaultProps = {
    error: null,
    help: null,
    label: null,
    name: 'select',
    options: [],
    updateValue: () => {},
    value: null,
}

export default RadioInput
