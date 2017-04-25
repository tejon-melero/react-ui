import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

export const formControlPropTypes = {
    controlOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    help: PropTypes.node,
    innerRef: PropTypes.func,
    label: PropTypes.node,
    name: PropTypes.string.isRequired,
    subHelp: PropTypes.node,
    updateValue: PropTypes.func.isRequired,
    value: PropTypes.any,
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
 * Get a property from an object optionally following a path and also providing a default.
 *
 * The `key` parameter can take a dot-separated path to a deeply-nested key.
 *
 * `null` values are considered 'empty' for the purposes of this function, and the value of
 * `defaultValue` will be returned in the case that `null` is found. Of course, the default default
 * is `null` anyway, so there you go. This is only true of `null`: `0`, `''` and `false` are all
 * considered to be 'filled' values and will be returned as-is.
 *
 * Example calling:
 *
 *     let obj = { defined: 'string', empty: null }
 *
 *     getProperty(obj, 'defined') => 'string'
 *     getProperty(obj, 'undefined') => null
 *
 *     getProperty(obj, 'defined', 'default') => 'string'
 *     getProperty(obj, 'undefined', 'default') => 'default'
 *
 *     // while `empty` is defined, it is set to null so is considered 'empty'
 *     getProperty(obj, 'empty') => null // null here being the default return, not the value stored
 *     getProperty(obj, 'empty', 'default') => 'default'
 *
 * @param {Object} object The object to find the key on.
 * @param {string} key The key to search for on the object.
 * @param {mixed} defaultValue The value to return if the key isn't found.
 * @returns {mixed} The value of object.key or defaultValue depending on the rules above.
 */
export function getProperty(object, key, defaultValue = null) {
    if (! object) {
        return defaultValue
    }

    // if no key, we just care about the object itself
    if (! key) {
        return object
    }

    // are we using complex path components (i.e. dot-notation)?
    if (key.indexOf('.') !== -1) {
        // take the first 'path component' from the key
        const path = key.split('.')
        const currentKey = path.shift()

        // now getting the value of the object[first-path-part] to kick off recusion
        const currentValue = getProperty(object, currentKey, defaultValue)

        // rebuild the key leaving out the first part we already used
        const restOfKey = path.join('.')

        // now recurse by getting the value of [rest-of-key] from our
        // [first-path-part] value
        return getProperty(currentValue, restOfKey, defaultValue)
    }

    // now the actual reason for this funciton - does the key exist on object and is it 'filled'?
    if (object.hasOwnProperty(key) && object[key] !== null) {
        return object[key]
    }

    return defaultValue
}

/**
 * Generate a wrapped component where required props can be resolved to a default when null.
 *
 * Take a component, some propType declarations and a map of default props and create a wrapping HOC
 * that will accept the proptypes with nulls and provide the prop's value from the default mapping
 * if null is passed.
 *
 * React, by default, does not use defaultProps when `null` to be pased to a component. But setting
 * the prop to isRequired means that null cannot be passed at all. As such, it sometimes makes sense
 * to be able to have default values when null is passed. That's what this function does.
 *
 * @param {Component} Component - The component to wrap. This component should ahve no propType
 *                                declaration (as it will be overwritten).
 * @param {Object} propTypes - The proptypes for the component (with no `isRequired` attributes
 *                             where you want nullable defalts).
 * @param {Object} defaults - The default values to use for the props that are passed as null.
 *
 * @returns {Function} - The thin wrapping HOC that wraps the main component and applies the
 *                       defaults.
 */
export function ApplyPropTypesAndDefaults(Component, propTypes, defaults) {
    // First, make the passed proptypes required where a key exists in defaults and set the strict
    // propTypes on the passed component.
    const strictPropTypes = { ...propTypes }

    for (const prop in defaults) {
        strictPropTypes[prop] = strictPropTypes[prop].isRequired
    }

    Component.propTypes = strictPropTypes

    // Now create the wrapping component that inspects the pased props, and fills in the defaults
    // where null is passed.
    const Wrapper = (props) => {
        const newProps = { ...props }

        for (const [ prop, defaultValue ] of Object.entries(defaults)) {
            if (props[prop] === null) {
                newProps[prop] = defaultValue
            }
        }

        return <Component { ...newProps } />
    }

    // Now do a little bit of housekeeping with the component name and set the passed in 'loose'
    // propTypes on the wrapping component.

    const componentName = Component.displayName || Component.name || 'Component'

    Wrapper.displayName = `WithDefaults(${ componentName })`
    Wrapper.propTypes = propTypes

    return Wrapper
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
