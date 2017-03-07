/* globals it */
import { expect } from 'chai';
import Store from '..';

let store = new Store();

it('should be in store shape', () => {
	expect(store.middlewares).to.be.an('array');
	expect(store.queued).to.be.a('promise');
	expect(store.state).to.be.an('object');
	expect(store.state.get).to.be.a('function');
	expect(store.collectionNames).to.be.an('array');
	expect(store.collections).to.be.an('array');
	expect(store.collectionEntries).to.be.an('array');
	expect(store.use).to.be.a('function');
	expect(store.dispatch).to.be.a('function');
	expect(store.subscribe).to.be.a('function');
	expect(store.unsubscribe).to.be.a('function');
	expect(store.queue).to.be.a('function');
});
