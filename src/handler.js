export default {

    /*
     * Handle any data change in the form
     */

    updateValue: function(key, value, cb){

        let data = {}

        if (typeof key === 'object' && typeof value === 'object'){
            i=0
            for (k in key){
                data[k] = value[i]
                i++
            }
        }
        else {
            data[key] = value
        }

        let newData = Object.assign(this.state.data, data)
        let newState = Object.assign(this.state, {
            data: newData
            })

        this.setState(newState)

        if (cb)
            this.setState(newState, function(){
                cb(newState)
            })
        else
            this.setState(newState)

    },

    _validateFields: function(errors){

        let validFields = {}

        for (let [key, value] of this.state.data){
            if (errors[field])
                validFields[field] = false
            else
                validFields[field] = true
        }

        return validFields
    },

    hasErrors: function(errors){
        window.errorFound = false
        window.errorChecker(errors)
    },

    /*
     * Handle add a nested form
     */

    handleAddInnerForm: function(itemsKey, defaultData, cb){

        // Change the state of the component to insert the new form data
        if(this.state.data[itemsKey]){
            this.state.data[itemsKey].push(defaultData)
        }else{
            this.state.data[itemsKey] = [defaultData]
        }

        // Pass the state data as the new nested form data to be updated by the
        // parent component
        this.props.updateValue(itemsKey, this.state.data[itemsKey], cb)

    },

    /*
     * Handle changes from a nested form
     */

    handleChangeInnerForm: function(itemsKey, tempId, data, errors, cb){

        // Create a new list of items with submitted item
        let itemList = []

        if (this.state.data[itemsKey] && data){
            for (let item of this.state.data[itemsKey]){
                if (tempId === item.tempId)
                    itemList.push(data)
                else
                    itemList.push(item)
            }
        }

        this.state.data[itemsKey] = itemList

        // Pass the state data as the new nested form data to be updated by the
        // parent component
        this.props.updateValue(itemsKey, this.state.data[itemsKey], cb)

    },

    /*
     * Handle delete a nested form
     */

    handleDeleteInnerForm: function(itemsKey, tempId, cb){

        let itemList = []
        let i = 0
        for (let item of this.state.data[itemsKey]){
            i++
            if (tempId !== i)
                itemList.push(item)
        }
        this.state.data[itemsKey] = itemList

        // Pass the state data as the new nested form data to be updated by the
        // parent component
        this.props.updateValue(itemsKey, this.state.data[itemsKey], cb)

    }

}

/*
 * Self invocating function to detect errors in nested objects
 */
window.errorChecker = function(errors){
    if (!window.errorFound)
        window.errorFound = false
    for (let [key, value] of errors){
        if (typeof value === 'object')
            errorChecker(value)
        else if (value !== null)
            window.errorFound = true
    }
    return window.errorFound
}
