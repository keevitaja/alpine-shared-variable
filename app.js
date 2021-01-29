import 'alpinejs'
import { emit } from 'process'
import op from 'object-path'
import { v4 } from 'uuid'
import flat from 'flat'

import Emitter from './emitter'

const emitter = new Emitter()

const share = (that, master, event, set = null)=> {
    const keys = Object.keys(flat(JSON.parse(JSON.stringify(that[master]))))
    const name = 'sharedEvents.' + event
    const uid = v4()

    keys.push(master)

    console.log(keys)

    for (const itemKey of keys) {
        const event = name + '.' + itemKey

        const key = master + '.' + itemKey

        emitter.on(event, (key, value, src)=> {
            if (src !== uid) {
                if (master === itemKey) {
                    that[master] = value
                } else {
                    op.set(that, key, value)
                }
            }
        })

        that.$watch(key, value => {
            emitter.emit(event, key, value, uid)
        })
    }

    if (set !== null) {
        that.$nextTick(()=> set(that))
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
                this.data.form.items = [
                    v4(),
                    v4(),
                ]
            })
        },

        add() {
            const items = []

            for (let i = 0; i < 5; i++) {
                items.push(v4())
            }

            this.data.form.items = this.data.form.items.concat(items)
        },

        reset() {
            this.data = {
                form: {
                    name: 'something',
                    items: [1, 2, 3],
                },

                test: 'testing',
            }
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
