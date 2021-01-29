export default class {
    constructor() {
        this.listeners = {}
    }

    emit(name, ...payload) {
        if (this.listeners[name] !== undefined) {
            for (const event of this.listeners[name]) {
                setTimeout(()=> event(...payload))
            }
        }
    }

    on(name, callback) {
        if (this.listeners[name] === undefined) {
            this.listeners[name] = []
        }

        this.listeners[name].push(callback)
    }
}
