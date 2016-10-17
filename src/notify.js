import React, { Component } from 'react'
import reactUpdate from 'react-addons-update'

export default class Notify extends Component {
    defaultProps = {
        duration: 3000,
    }

    state = {
        notifications: [],
    }

    componentDidMount() {
        document.addEventListener('reactUINotification', this.pushNotification)
    }

    componentDidUpdate() {
        for (const item in this.state.notifications) {
            const elm = this.refs[`item-${ item.id }`]

            if (elm.style.opacity === '0') {
                elm.style.opacity = 1
                elm.style.top = 0
            }
        }
    }

    pushNotification = (e) => {
        // Create new notification object

        // Generate a unique id using a timestamp
        const newId = new Date().getTime()

        const notification = {
            id: newId,
            message: e.detail.message,
        }

        // Push the notification to the state
        const newState = reactUpdate(
            this.state,
            {
                notifications: { $push: [ notification ] },
            }
        )

        // Update the state
        this.setState(
            newState,
            () => {
                setTimeout(() => {
                    this.clearNotification(newId)
                }, this.props.duration)
            }
        )
    }

    clearNotification(id) {
        const newList = []

        for (const item in this.state.notifications) {
            if (item.id !== id) {
                newList.push(item)
            }
        }

        const newState = reactUpdate(
            this.state,
            {
                notifications: { $set: newList },
            }
        )

        this.setState(newState)
    }

    handleClose(item_id, e) {
        e.preventDefault()

        this.clearNotification(item_id)
    }

    handleCloseOver(e) {
        e.target.style.color = 'rgba(255,255,255,1)'
    }

    handleCloseOut(e) {
        e.target.style.color = 'rgba(255,255,255,0.7)'
    }

    render() {
        const listStyle = {
            position: 'fixed',
            zIndex: '9999',
            top: '0',
            left: '0',
            width: '100%',
            pointerEvents: 'none',
        }

        const itemStyle = {
            width: '100%',
            maxWidth: '320px',
            margin: '1em auto',
            padding: '0.5em 1em',
            position: 'relative',
            top: '-1em',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: '#ffffff',
            opacity: 0,
            WebkitTransition: 'all 0.3s',
            msTransition: 'all 0.3s',
        }

        const closeStyle = {
            position: 'absolute',
            top: '0.25em',
            right: '0.5em',
            fontSize: '1.25em',
            color: 'rgba(255,255,255,0.7)',
        }

        const items = this.state.notifications.map((item) => (
            <div
                className="react-ui-notification__item"
                key={ item.id }
                ref={ `item-${ item.id }` }
                style={ itemStyle }
            >
                <a
                    className="react-ui-notification__close"
                    href="#"
                    onClick={ this.handleClose.bind(this, item.id) }
                    onMouseOut={ this.handleCloseOut }
                    onMouseOver={ this.handleCloseOver }
                    style={ closeStyle }
                >
                    &times;
                </a>

                { item.message }
            </div>
        ))

        return (
            <div className="react-ui-notification" style={ listStyle }>
                { items }
            </div>
        )
    }
}
