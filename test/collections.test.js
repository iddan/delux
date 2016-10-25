/* globals it */
const {expect} = require('chai');
const Store = require('..');

let store = new Store();
let images = new Store.Collection([]);
let people = new Store.Collection({});

it('should detect added collections', () => {
    expect(store.collections.length).to.equal(0);
    store.images = images;
    expect(store.collections.length).to.equal(1);
    store.people = people;
    expect(store.collections.length).to.equal(2);
});

it('should have frozen state', () => {
    expect(Object.isFrozen(images.state)).to.be.true;
});
