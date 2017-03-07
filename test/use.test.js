/* eslint-disable no-console */
/* globals it */

import Store from '..';
import { expect } from 'chai';

let store = new Store();

it('adds one middleware', () => {
	store.use((action) => {
		console.log(action);
		action.general = true;
	});
	expect(store.middlewares.length).to.equal(1);
});

it('adds another middleware', () => {
	store.use('hop', (action) => {
		action.hip = true;
	});
	expect(store.middlewares.length).to.equal(2);
});

it('adds one more middleware', () => {
	store.use({
		addLove(action) {
			action.love = 1;
		}
	});
	expect(store.middlewares.length).to.equal(3);
});

it('applies middlewares', () => {
	store.use(action => {
		if (action.type === 'hop') {
			expect(action.hip).to.be.true;
			expect(action.general).to.be.true;
		} else if (action.type === 'addLove') {
			expect(action.addLove).to.be.equal(1);
			expect(action.general).to.be.true;
		}
	});
	store.dispatch({
		type: 'hop'
	});
	store.dispatch({
		type: 'addLove'
	});
});
