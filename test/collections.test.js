/* globals it */
import { expect } from 'chai';
import Store, { Collection } from '..';

let store = new Store();
let images = new Collection([]);
let people = new Collection({});

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
