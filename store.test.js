/* globals it, expect */

const Store = require('.');
const {Collection} = Store;

const store = new Store;

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
        state[image.id] = image;
    }
    return Object.assign({}, state);
});

// don't worry you can do this
store.images.on(['removeAllImages'], (state) => {
    for (let key in state) {
        delete state[key];
    }
    return Object.assign({}, state);
});

// flux actions, so pretty
it ('returns the new store state', () => store.dispatch({
    type: 'getAllImages',
    payload: {
        request: {
            url: 'kjfkdjfkjdf',
            method: 'get'
        },
    }
})
.then(({images}) => expect(images).toEqual({
    foo: {
        id: 'foo',
        image_url: 'http://bar.com'
    }
})));

// look at these results!

store.observe('images', ({images}) => console.log('observed a change in images: ', images));

const fetch = () => Promise.resolve({
    json: () => Promise.resolve([{
        id: 'foo',
        image_url: 'http://bar.com'
    }])
});
