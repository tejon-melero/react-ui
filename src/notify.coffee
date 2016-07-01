# Copyright (c) 2015 Guillaume Piot (@guillaume piot)

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

#------------------#
# Notify component #
#------------------#

React = require 'react'
ReactUpdate = require 'react-addons-update'
classnames = require 'classnames'

Notify = React.createClass({

    getDefaultProps: ->
        return {
            duration: 3000
        }

    getInitialState: ->
        return {
            notifications:[]
        }

    componentDidMount: ->
        document.addEventListener('reactUINotification', @pushNotification)

    componentDidUpdate: ->

        for item in @state.notifications
            elm = @refs["item-#{item.id}"]
            if elm.style.opacity == "0"
                window.getComputedStyle(elm).opacity
                window.getComputedStyle(elm).top
                elm.style.opacity = 1
                elm.style.top = 0

    pushNotification: (e)->

        #
        # Create new notification object
        # Generate a unique id using a timestamp
        #
        newId = new Date().getTime()

        notification =
            id: newId
            message: e.detail.message

        #
        # Push the notification to the state
        #
        newState = ReactUpdate(@state, {
            notifications: {$push: [notification]}
            })

        #
        # Update the state
        #
        @setState(newState, =>
                setTimeout(=>
                    @clearNotification(newId)
                , @props.duration)
            )

    clearNotification: (id)->
        newList = []
        for item in @state.notifications
            if item.id != id
                newList.push(item)

        newState = ReactUpdate(@state, {
            notifications: {$set: newList}
            })

        @setState(newState)

    handleClose: (item_id, e)->
        e.preventDefault()
        @clearNotification(item_id)

    handleCloseOver: (e)->
        e.target.style.color = "rgba(255,255,255,1)"

    handleCloseOut: (e)->
        e.target.style.color = "rgba(255,255,255,0.7)"

    render: ->

        listStyle =
            position: "fixed"
            zIndex: "9999"
            top: "0"
            left: "0"
            width: "100%"
            pointerEvents: "none"

        itemStyle =
            width: "100%"
            maxWidth: "320px"
            margin: "1em auto"
            padding: "0.5em 1em"
            position: "relative"
            top: "-1em"
            backgroundColor: "rgba(0,0,0,0.7)"
            color: "#ffffff"
            opacity: 0
            WebkitTransition: 'all 0.3s'
            msTransition: 'all 0.3s'

        closeStyle =
            position: "absolute"
            top: "0.25em"
            right: "0.5em"
            fontSize: "1.25em"
            color: "rgba(255,255,255,0.7)"

        items = @state.notifications.map (item)=>
            ref = "item-#{item.id}"
            return (<div
                        key={ item.id }
                        style={ itemStyle }
                        ref={ ref }
                        className="react-ui-notification__item"
                    >
                    <a
                        href="#"
                        onClick={ @handleClose.bind(@, item.id) }
                        style={ closeStyle }
                        className="react-ui-notification__close"
                        onMouseOver={ @handleCloseOver }
                        onMouseOut={ @handleCloseOut }>
                        &times;
                    </a>
                    { item.message }
                </div>)
        return (<div
                style={ listStyle }
                className="react-ui-notification">
                    { items }
                </div>)
    })

module.exports = Notify
