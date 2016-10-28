import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

export const formControlPropTypes = {
    error: PropTypes.array,
    help: PropTypes.node,
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    subHelp: PropTypes.node,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
}

export const hasOptionsPropTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        richLabel: PropTypes.node,
    })).isRequired,
}

export const focussablePropTypes = {
    handleBlur: PropTypes.func,
    handleFocus: PropTypes.func,
}

/*
 * Handle any data change in a form.
 */
export function updateValue(data) {
    // generate new data by taking a copy of the current state data and
    // overriding keys defined in incoming data
    const newState = {
        data: {
            ...this.state.data,
            ...data,
        },
    }

    this.setState(newState)
}

/**
 * Handle addition of an item in a nested form.
 *
 * @param {string} itemsKey - The key of the field on *this* form, located in `this.state.data` to find the inner
 *     forms.
 * @param {object} defaultData - The default data with which to populate the form.
 *
 * @return {void} Nothing
 *
 * It is worth noting that this a mixin style method, hence uses `this`. As such, another important 'parametr' that
 * this method uses is `this.state.data.{itemsKey}` - this contains an array of the inner forms, each of which is an
 * object.
 */
export function handleAddInnerForm(itemsKey, defaultData) {
    // get a local copy of the item list
    let itemList = [ ...this.state.data[itemsKey] ]

    // Change the state of the component to insert the new form data
    if (itemList) {
        itemList.push(defaultData)
    } else {
        itemList = [ defaultData ]
    }

    // Pass the state data as the new nested form data to be updated by the
    // parent component
    this.props.updateValue({ [itemsKey]: itemList })
}

/**
 * Handle changes to a nested form.
 *
 * @param {string} itemsKey - The key of the field on *this* form, located in `this.state.data` to find the inner
 *     forms.
 * @param {number} index - The (numeric) id of the inner form to work on.
 * @param {object} data - The data that changed on that form.
 * @param {object} errors - Any errors occurring.
 *
 * @return {void} Nothing
 *
 * It is worth noting that this a mixin style method, hence uses `this`. As such, another important 'parametr' that
 * this method uses is `this.state.data.{itemsKey}` - this contains an array of the inner forms, each of which is an
 * object.
 */
export function handleChangeInnerForm(itemsKey, index, data, errors) {
    // Create a new list of items with submitted item
    const itemList = []

    if (this.state.data[itemsKey] && data) {
        for (const item of this.state.data[itemsKey]) {
            if (index === item.index) {
                itemList.push(data)
            } else {
                itemList.push(item)
            }
        }
    }

    // Pass the state data as the new nested form data to be updated by the parent component
    this.props.updateValue({ [itemsKey]: itemList })
}

/**
 * Handle deletion of an item from a nested form.
 *
 * @param {string} itemsKey - The key of the field on *this* form, located in `this.state.data` to find the inner
 *     forms.
 * @param {number} index - The index of the inner form to delete.
 *
 * @return {void} Nothing
 *
 * It is worth noting that this a mixin style method, hence uses `this`. As such, another important 'parametr' that
 * this method uses is `this.state.data.{itemsKey}` - this contains an array of the inner forms, each of which is an
 * object.
 */
export function handleDeleteInnerForm(itemsKey, index) {
    // go through each inner form field and 'filter out' any items that have the same index as to be deleted
    const itemList = this.state.data[itemsKey].filter(
        (item) => item.index !== index
    )

    // Pass the state data as the new nested form data to be updated by the
    // parent component
    this.props.updateValue({ [itemsKey]: itemList })
}

/**
 * @param {Component} Target - The component that defines `onOutsideEvent` handler.
 * @param {String[]} listeners - A list of valid DOM event names to listen for.
 *
 * @return {Component} The target wrapped in a HOC.
 */
export function OutsideEventListener(Target, listeners = []) {
    return class OutsideEventListener extends Component {
        target = null

        componentDidMount() {
            for (const eventName of listeners) {
                window.addEventListener(eventName, this.handleEvent, false)
            }
        }

        componentWillUnmount() {
            for (const eventName of listeners) {
                window.removeEventListener(eventName, this.handleEvent, false)
            }
        }

        handleEvent = (event) => {
            if (this.target) {
                const targetElement = ReactDOM.findDOMNode(this.target)
                const isInside = (targetElement === event.target) || targetElement.contains(event.target)

                if (! isInside) {
                    this.target.onOutsideEvent(event)
                }
            }
        }

        storeTarget = (ref) => {
            if (ref && ! ref.onOutsideEvent) {
                throw new Error('Component does not define "onOutsideEvent" method.')
            }

            this.target = ref
        }

        render() {
            return <Target { ...this.props } ref={ this.storeTarget } />
        }
    }
}
