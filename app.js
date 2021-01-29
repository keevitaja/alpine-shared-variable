import 'alpinejs'
import { emit } from 'process'
import op from 'object-path'
import { v4 } from 'uuid'

import Emitter from './emitter'

const emitter = new Emitter()

const share = (that, key, event)=> {
    const name = 'sharedEvents.' + event + '.' + key
    const uid = v4()

    let emitting = false

    emitter.on(name, (key, value, src)=> {
        if (src !== uid) {
            op.set(that, key, value)
        }
    })

    that.$watch(key, value => {
        emitter.emit(name, key, value, uid)
    })
}

window.parent = ()=> {
    return {
        data: {
            form: {
                name: null
            }
        },

        init() {
            share(this, 'data.form.name', 'somethingUnique')
        }
    }
}

window.child = ()=> {
    return {
        data: {
            form: {
                name: null
            }
        },

        init() {
            share(this, 'data.form.name', 'somethingUnique')
        }
    }
}

window.sibling = ()=> {
    return {
        data: {
            form: {
                name: null
            }
        },

        init() {
            share(this, 'data.form.name', 'somethingUnique')
        }
    }
}
