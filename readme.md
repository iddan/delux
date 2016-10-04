<h1>
    <img
        src="https://cdn.rawgit.com/aniddan/delux/master/assets/delux.svg"
        height="32"
    />
    Delux
</h1>

Beautiful, light and simple state manager inspired by Redux

```JavaScript
import Store from 'delux';

let store = new Store ();

store.tasks = new Store.Collection ({tasks: []});

store.tasks.on('addTask', (tasks, action) => tasks.concat({
    name: action.payload,
    completed: false
}));

store.observe('tasks', (state) => console.log(state.tasks));

store.dispatch({
    type: 'addTask',
    payload: 'Try Delux'
});
```
## Motivation

- In Flux there's a design flaw: it's hard to manage several stores.
- So came Redux with one store.
- But: Redux lacks a defined API

## Features

- [Immutable][Immutability in JavaScript]
- [Promise Based][Promise]
- [Extendible classes][Subclassing]
- [Flux Standard Actions][FSA]
- [Ordered middlewares][Express Middlewares]
- [No switches or combinations required][Redux Reducers]

## API Reference

### Store

The Store holds the whole application state and it's mutation logic.

##### Create a Store

```JavaScript
let store = new Store();
```

#### Description

Stores are objects whose prototype has methods to mutate there state. The Store's state is hold in [Collections](#Collection) assigned to it.

#### Store instances

##### Properties

###### Store.prototype.state

Returns an object with mutations of the collections' states

##### Methods

###### Store.prototype.dispatch()

Dispatches a [Flux Standard Action][FSA] on the state

```JavaScript
store.dispatch({
    type: <string | symbol>,
    payload: <object>
    error: <boolean>,
    meta: <any>
});
```

**Returns**

The mutated store state

###### Store.prototype.observe()

Adds an observer for mutations in the store's collections

```JavaScript
store.observe(['collectionName'], (state) => {

});
```

**Parameters**

- **names | name** - array of collection names or a single name to observe for state mutation
- **observer** - a function that with a given state mutation receives the name of the changed collection and it's new state. The arguments to the function are as follows:

| Name       | Supplied Value               |
|------------|----------------------------- |
| state      | Store.prototype.state alias  |

##### Store.prototype.use()

Adds a middlware to the action resolution process

```JavaScript
store.use((action) => {

});
```

**Parameters**

- **middlware** - a function that mutates a given action. If it returns a Promise the store will wait for the promise to complete before passing it to the next middleware and the reducers.

##### Store.prototype.queue()

Adds a function to the store's execute queue

```JavaScript
store.queue(() => callback());
```

##### Store.prototype.state.get()

Get specific collection's state from the store's state

```JavaScript
let partialState = store.state.get(collectionNames);
```

###### Parameters

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

Reflects the collections's state

###### Collection.prototype.reducers

Reflects the collections's reducers

###### Collection.prototype.observers

Reflects the collections's observers

##### Methods

###### Collection.prototype.on()

Attach a reducer to received actions ([Node style][Node EventEmitter On])

```JavaScript
store.collectionName.on(['actionType'], (state, action) => {

});
```

**Parameters**

- **types | type** - array of action types or a single type to apply the reducer on
- **reducer** - a function that with a given action mutates the collection state and returns the new state. The arguments to the function are as follows:


| Name   | Supplied Value        |
|--------|-----------------------|
| state  | The collection state  |
| action | The dispatched action |

[Delux Logo]: https://cdn.rawgit.com/aniddan/delux/master/assets/delux.svg
[Immutability in JavaScript]: https://www.sitepoint.com/immutability-javascript/
[FSA]: https://github.com/acdlite/flux-standard-action
[Promise]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
[Subclassing]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Sub_classing_with_extends
[Flux Stores]: https://facebook.github.io/flux/docs/overview.html#stores
[Redux Reducers]: http://redux.js.org/docs/basics/Reducers.html
[Express Middlewares]: https://www.safaribooksonline.com/blog/2014/03/10/express-js-middleware-demystified/
[Node EventEmitter On]: https://nodejs.org/api/events.html#events_emitter_on_eventname_listener
