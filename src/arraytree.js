class ArrayTree {
    constructor (settings = {multiple: true}) {
        Object.defineProperty(this, 'settings', {
            value: settings
        });
    }
    static toImmutable (arraytree) {
        return new ImmutableArrayTree(arraytree);
    }
    get (key) {
        return this[key] || (this.settings.multiple ? [] : null);
    }
}

class ImmutableArrayTree extends ArrayTree {
    constructor (init) {
        super(init.settings);
        Object.assign(this, init);
        Object.freeze(this);
    }
}

module.exports = class MutableArrayTree extends ArrayTree {
    set (keys, value) {
        for (let key of keys) {
            if (this.settings.multiple) {
                let array = this[key];
                if (array) {
                    array.push(value);
                }
                else {
                    this[key] = [value];
                }
            }
            else {
                this[key] = value;
            }
        }
    }
};
