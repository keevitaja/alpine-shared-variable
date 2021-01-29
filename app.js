import 'alpinejs'
import { emit } from 'process'
import op from 'object-path'
import { v4 } from 'uuid'
import flat from 'flat'

import Emitter from './emitter'

const emitter = new Emitter()

const share = (that, parent, event, set = null)=> {
    const keys = Object.keys(flat(JSON.parse(JSON.stringify(that[parent]))))
    const name = 'sharedEvents.' + event
    const uid = v4()

    console.log(keys)

    for (const key of keys) {
        const event = name + '.' + key

        key = parent + '.' + key

        emitter.on(event, (key, value, src)=> {
            if (src !== uid) {
                op.set(that, key, value)
            }
        })

        that.$watch(key, value => {
            emitter.emit(event, key, value, uid)
        })
    }

    if (set !== null) {
        that.$nextTick(()=> setTimeout(()=> set(that)))
    }
}

window.parent = ()=> {
    return {
        data: {
            form: {
                name: null,
                items: [],
            },

            test: null,
        },

        init() {
            share(this, 'data', 'somethingUnique', that=> {
                that.add()
            })
        },

        add() {
            this.data.form.items = this.data.form.items.concat([v4()])
        }
    }
}

window.child = ()=> {
    return {
        data: {
            form: {
                name: null,
                items: [],
            },

            test: null,
        },

        init() {
            share(this, 'data', 'somethingUnique')
        }
    }
}

window.sibling = ()=> {
    return {
        data: {
            form: {
                name: null,
                items: [],
            },

            test: null,
        },

        init() {
            share(this, 'data', 'somethingUnique')
        },

        add() {
            this.data.form.items = this.data.form.items.concat([v4()])
        }
    }
}
