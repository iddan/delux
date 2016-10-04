/* eslint-disable no-console */
/* globals describe, it, expect */

const Store = require('.');

let store = new Store;

describe('use', () => {
    it('adds one middleware', () => {
        store.use(() => console.log('cool'));
        expect(store.middlewares.length).toBe(1);
    });
    it('adds another middleware', () => {
        store.use('beCool', () => console.log('beCool'));
        expect(store.middlewares.length).toBe(2);
    });
    it('adds one more middleware', () => {
        store.use({
            beCooler: () => console.log('coolesr'),
            beCoolest: () => console.log('coolset')
        });
        expect(store.middlewares.length).toBe(3);
    });
});
