import { createStore, combineReducers } from 'redux'
import menuDate from './common/menu'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

const initialState = {
  refresh: 0
}

function render(state = initialState, action) {
  switch (action.type) {
    case 'REFRESH':
      return {
        ...state,
        refresh: state.refresh + 1
      }
    default:
      return state
  }
}

function menu() {
  return menuDate
}

function to(state = initialState, action) {
  if (action.type !== 'to' && action.owner !== 'list') return { ...state, path: '/' }
  history.replace(action.path)

  return { ...state, path: action.path }
}

export const storeInstance = createStore(combineReducers({ namespace: () => 'list', menu, render, to }))
export { history }
