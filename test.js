const Store = require('.');
const {Collection} = Store;

let fetch = () => Promise.resolve({
    json: () => Promise.resolve([{
        id: 'foo',
        image_url: 'http://bar.com'
    }])
});

let store = new Store;

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
store.images.on('getAllImages', (action, state) => {
    for (let image of action.payload.response) {
        state[image.id] = image;
    }
});

// don't worry you can do this
store.images.on(['removeAllImages'], (action, state) => {
    for (let key in state) {
        delete state[key];
    }
});

// React anybody?
store.observe('images', (state) => console.log(state.images));
store.observe(['images'], (state) => console.log(state.images));

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
