/* globals it */

import { expect } from 'chai';

import Store, { Collection } from '..';

// it ('mutates the store state', () => {

const store = new Store();

// collections are sub classes with init
store.images = new Store.Collection({});
store.people = new Collection({});

// FETCH MIDDLEWARE

store.use(action => {
	return fetch(action.payload.request)
		.then(response => {
			action.payload.response = response;
		});
});

// MIDDLEWARES ACCURE IN ORDER

store.use(action => {
	return action.payload.response.json().then(response => {
		action.payload.response = response;
	});
});

// gets state from a getter
store.images.on('getAllImages', (state, action) => {
	for (let image of action.payload.response) {
		state = state.set({
			[image.id]: image
		});
	}
	return state;
});

// don't worry you can do this
store.images.on(['removeAllImages'], (state) => {
	for (let key in state) {
		state = state.set({
			[key]: undefined
		});
	}
	return state;
});

// flux actions, so pretty
store.dispatch({
	type: 'getAllImages',
	payload: {
		request: {
			url: 'kjfkdjfkjdf',
			method: 'get'
		},
	}
});

// look at these results!
store.subscribe('images', (state) => expect(state.images.foo).to.deep.equal({
	id: 'foo',
	image_url: 'http://bar.com'
}));

store.subscribe('images', (state) => expect(state.get('images')).to.deep.equal({ images: state.images }));
// });

const fetch = () => Promise.resolve({
	json: () => Promise.resolve([{
		id: 'foo',
		image_url: 'http://bar.com'
	}])
});
