<h1>
    <img
        src="https://cdn.rawgit.com/aniddan/delux/master/assets/delux.svg"
        style="height: 2em; margin-right: 5px;"
    />
    Delux
</h1>

Beautiful, light and simple state manager inspired by Redux

```JavaScript
import Store from 'delux';

let store = new Store ();
store.tasks = new Store.Collection ({tasks: []});

store.on('addTask', (action, state) => state.tasks.push(action.payload));

store.observe('tasks', state => console.log(state));

store.dispatch({
    type: 'addTask',
    payload: {
        name: 'Try Redux'
    }
})

```
## Features

- [Immutable][Immutability in JavaScript]
- [Promise Based][Promise]
- [Extendible classes][Subclassing]
- [Flux Standard Actions][FSA]
- [Ordered middlewares][Express Middlewares]
- [No switches nor returns required][Redux Reducers]


## API Reference

### Store

The Store holds the whole application state and it's mutation logic.

##### Create a Store

```JavaScript
let store = new Store();
```

#### Description

Stores are objects whose prototype has methods to mutate there state. The Store's state is hold in [Collections](#Collection) assigned to it.

#### Store instances methods

##### Store.prototype.dispatch()

Dispatches a [Flux Standard Action][FSA] on the state

```JavaScript
store.dispatch({
    type: <string | symbol>,
    payload: <object>
    error: <boolean>,
    meta: <any>
});
```

##### Store.prototype.observe()

Adds an observer for mutations in the store's collections

```JavaScript
store.observe(['collectionName'], (state) => {

});
```

**Parameters**

- **collectionNames** - array of collection names to observe their state mutation
- **observer** - a function that with a given state mutation receives the name of the changed collection and it's new state. The arguments to the function are as follows:

| Name       | Supplied Value               |
|------------|----------------------------- |
| name       | The changed collection name  |
| state      | The changed collection state |

##### Store.prototype.use()

Adds a middlware to the action resolution process

```JavaScript
store.use((action) => {

});
```

**Parameters**

- **middlware** - a function that mutates a given action. If it returns a Promise the store will wait for the promise to complete before passing it to the next middleware and the reducers.

### Collection

Collections holds a sub-state (similar to [Flux Stores][Flux Stores]) and it's mutation logic

#### Assign a Collection

```JavaScript
store.collectionName = new Collection (init);
```

**Parameters**

- **init** - The initial state of the collection

#### Collection instances

##### Properties

###### Collection.prototype.state

Returns a new mutation of the collections's state

###### Collection.prototype.reducers

Reflects the collections's reducers

##### Methods

###### Collection.prototype.on()

Attach a reducer to received actions ([Node style][Node EventEmitter On])

```JavaScript
store.collectionName.on(['actionType'], (action, state) => {

});
```

**Parameters**

- **types** - array of action types to apply the reducer on
- **reducer** - a function that with a given action mutates the collection state. The arguments to the function are as follows:


| Name   | Supplied Value        |
|--------|-----------------------|
| action | The dispatched action |
| state  | The collection state  |

[Delux Logo]: https://cdn.rawgit.com/aniddan/delux/master/assets/delux.svg
[Immutability in JavaScript]: https://www.sitepoint.com/immutability-javascript/
[FSA]: https://github.com/acdlite/flux-standard-action
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Subclassing]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
[Flux Stores]: https://facebook.github.io/flux/docs/overview.html#stores
[Redux Reducers]: http://redux.js.org/docs/basics/Reducers.html
[Express Middlewares]: https://www.safaribooksonline.com/blog/2014/03/10/express-js-middleware-demystified/
[Node EventEmitter On]: https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
