import SearchRoommatePage from './pages/SearchRoommatePage.js'

export const routes = {
  profile: null,
  'search-roommate': SearchRoommatePage,
}

export function getViewComponent(viewName) {
  return routes[viewName] || null
}
