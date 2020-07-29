



import { createStore } from 'redux'

// Dispatch send signal to store that a change happened
//* store.dispatch({
//   type: 'INCREMENT',
//   incrementBy: 5
// })
store.dispatch(incrementCount({ incrementBy: 5 }))


// ACTION GENERATORS.
// ACTION TAKES INPUT AND RETURN NEW ACTION OBJECT
const incrementCount = (payload = {}) => ({
  type: 'INCREMENT',
  incrementBy: typeof payload.incrementBy === 'number' ? payload.incrementBy : 1
  //* type: INCREMENT,
  // incrementBy: typeof payload.incrementBy === 'number' ? payload.incrementBy : 1
})

const store = createStore((state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + action.incrementBy
      }
    //* const incrementBy = typeof action.incrementBy === 'number' ? action.incrementBy : 1
    // return {
    //   count: state.count + incrementBy }

  }
})


// spread operator
// return state.concat(action.expense)
// return [
//   ...state, action.expense
// ]
