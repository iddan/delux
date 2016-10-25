/* globals it */
const {expect} = require('chai');
const Store = require('..');

let store = new Store();

it('should add a middleware', () => {
    expect(store.middlewares.length).to.equal(0);
    store.use((action) => {
        action.passedMiddleware = true;
    });
    expect(store.middlewares.length).to.equal(1);
});

it('should apply middlewares', () => {
    store.use((action) => expect(action.passedMiddleware).to.be.true);
    store.dispatch({type: 'test'});
});
