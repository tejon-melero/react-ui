import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Notify extends Component {
    static propTypes = {
        duration: PropTypes.number,
    }

    static defaultProps = {
        duration: 3000,
    }

    state = {
        notifications: [],
    }

    componentDidMount() {
        document.addEventListener('reactUINotification', this.pushNotification)
    }

    componentDidUpdate() {
        for (const item of Object.values(this.state.notifications)) {
            const elm = this.myRefs[item.id]

            if (elm && (elm.style.opacity === '0')) {
                elm.style.opacity = 1
                elm.style.top = 0
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('reactUINotification', this.pushNotification)
    }

    myRefs = {}

    storeRefCreator = (id) => (ref) => this.myRefs[id] = ref

    pushNotification = (e) => {
        // Generate a unique id using a timestamp and some random for extra fun!
        const newId = `${ Date.now() }-${ Math.floor(Math.random() * 1e6) }`

        // Create new notification object
        const notification = {
            id: newId,
            message: e.detail.message,
        }

        // Update the state, pushing the notification to the end. We use the pass-a-function method
        // in order to update the state in an 'atomic' way. If this function is called multiple
        // times in quick succession then the referece to `this.state.notifications` in the
        // previous code would actually reference an out-of-date copy of the array by the time the
        // batch state transformations are run.
        this.setState(
            (state) => ({
                notifications: [
                    ...state.notifications,
                    notification,
                ],
            }),
            () => {
                setTimeout(() => {
                    this.clearNotification(newId)
                }, e.detail.duration || this.props.duration)
            }
        )
    }

    clearNotification(id) {
        this.setState({
            notifications: this.state.notifications.filter(
                (item) => item.id !== id
            ),
        })
    }

    handleClose(id, e) {
        e.preventDefault()

        this.clearNotification(id)
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
                ref={ this.storeRefCreator(item.id) }
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
                    { '×' }
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
