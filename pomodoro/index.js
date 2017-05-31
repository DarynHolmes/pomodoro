window.onload = function () {

const POMODORO_STATES = {
    WORK: 'work',
    REST: 'rest'
}

const PLAYER_STATES = {
    STARTED: 'started',
    STOPPED: 'stopped',
    PAUSED: 'paused'
}

const WORKING_TIME_LENGTH_IN_SECONDS = 10
const RESTING_TIME_LENGTH_IN_SECONDS = 10

Vue.component('pomodoro-time', {
    template: '#pomodoro-time',
    props: [ 'timeLeft' ],
    computed: {
        displayTime: function () {
            return moment.utc(this.timeLeft.as('milliseconds')).format('HH:mm:ss')
        }
    }
})

Vue.component('controls', {
    template: '#controls',
    props: [ 'state' ],
    methods: {
        stateChanged: function (newState) {
            console.log('controls state', this.state, newState)
            this.$emit('state-changed', newState)
        }
    }
})

new Vue({
    el: '#app',
    data: {
        countdown: moment.duration(WORKING_TIME_LENGTH_IN_SECONDS, 'seconds'),
        playerState: PLAYER_STATES.STOPPED,
        pomodoroState: POMODORO_STATES.WORK
    },
    computed: {
        time: function () {
            return moment.utc(this.countdown.as('milliseconds')).format('HH:mm:ss')
        }
    },
    methods: {
        stateChanged: function(state) {
            console.log('app state', this.playerState, state)
            switch(state) {
                case 'started':
                    this.start()
                    break
                case 'paused':
                    this.pause()
                    break
                case 'stopped':
                    this.stop()
                    break
            }
        },
        start: function() {
            this.playerState = PLAYER_STATES.STARTED
            this._tick()
            this.interval = setInterval(this._tick, 1000)
        },
        pause: function() {
            this.playerState = PLAYER_STATES.PAUSED
            clearInterval(this.interval)
        },
        stop: function() {
            this.playerState = PLAYER_STATES.STOPPED
            clearInterval(this.interval)
            this.countdown = moment.duration(WORKING_TIME_LENGTH_IN_SECONDS, 'seconds')
        },
        _tick: function() {
            this.countdown.subtract(1, 's')
            if (this.countdown <= moment.duration(0,'s')) {
                this.pomodoroState = this.pomodoroState == POMODORO_STATES.WORK ? POMODORO_STATES.REST : POMODORO_STATES.WORK
                this.countdown = moment.duration(WORKING_TIME_LENGTH_IN_SECONDS, 'seconds')
            }
        }

    }
})

}