export default {
    /*
     * Handle any data change in the form.
     */
    updateValue(data, cb) {
        // generate new data by taking a copy of the current state data and
        // overriding keys defined in incoming data
        const newData = {
            ...this.state.data,
            ...data,
        }

        // generate new state by taking a copy of the current state and
        // overwriting data with our new data
        const newState = {
            ...this.state,
            data: newData,
        }

        if (cb) {
            this.setState(newState, () => cb(newState))
        } else {
            this.setState(newState)
        }
    },

    /**
     * Handle addition of an item in a nested form.
     *
     * @param {string} itemsKey - The key of the field on *this* form, located in `this.state.data` to find the inner
     *     forms.
     * @param {object} defaultData - The default data with which to populate the form.
     * @param {function} cb - A callback to execute when the state is updated.
     *
     * @return {void} Nothing
     *
     * It is worth noting that this a mixin style method, hence uses `this`. As such, another important 'parametr' that
     * this method uses is `this.state.data.{itemsKey}` - this contains an array of the inner forms, each of which is an
     * object.
     */
    handleAddInnerForm(itemsKey, defaultData, cb) {
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
        this.props.updateValue({ [itemsKey]: itemList }, cb)
    },

    /**
     * Handle changes to a nested form.
     *
     * @param {string} itemsKey - The key of the field on *this* form, located in `this.state.data` to find the inner
     *     forms.
     * @param {number} index - The (numeric) id of the inner form to work on.
     * @param {object} data - The data that changed on that form.
     * @param {object} errors - Any errors occurring.
     * @param {function} cb - A callback to execute when the state is updated.
     *
     * @return {void} Nothing
     *
     * It is worth noting that this a mixin style method, hence uses `this`. As such, another important 'parametr' that
     * this method uses is `this.state.data.{itemsKey}` - this contains an array of the inner forms, each of which is an
     * object.
     */
    handleChangeInnerForm(itemsKey, index, data, errors, cb) {
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
        this.props.updateValue({ [itemsKey]: itemList }, cb)
    },

    /**
     * Handle deletion of an item from a nested form.
     *
     * @param {string} itemsKey - The key of the field on *this* form, located in `this.state.data` to find the inner
     *     forms.
     * @param {number} index - The index of the inner form to delete.
     * @param {function} cb - A callback to execute when the state is updated.
     *
     * @return {void} Nothing
     *
     * It is worth noting that this a mixin style method, hence uses `this`. As such, another important 'parametr' that
     * this method uses is `this.state.data.{itemsKey}` - this contains an array of the inner forms, each of which is an
     * object.
     */
    handleDeleteInnerForm(itemsKey, index, cb) {
        // go through each inner form field and 'filter out' any items that have the same index as to be deleted
        const itemList = this.state.data[itemsKey].filter(
            (item) => item.index !== index
        )

        // Pass the state data as the new nested form data to be updated by the
        // parent component
        this.props.updateValue({ [itemsKey]: itemList }, cb)
    },
}
