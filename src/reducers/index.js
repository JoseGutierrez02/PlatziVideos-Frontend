const reducer = (state, action) => {
  
  switch (action.type) {
    case 'SET_FAVORITE':
      const exist = state.myList.find((item) => item.id === action.payload.id);
      if (exist) return { ...state };
      return {
        ...state,
        myList: [...state.myList, action.payload],
      };
    case 'DELETE_FAVORITE':
      return {
        ...state,
        myList: state.myList.filter((items) => items.id !== action.payload),
      };
    case 'LOGIN_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'REGISTER_REQUEST':
      return {
        ...state,
        user: action.payload,
      };
    case 'GET_VIDEO_SOURCE':
      const lists = [...state.trends, ...state.originals];
      return {
        ...state,
        playing: lists.find((item) => item.id === Number(action.payload)) || [],
      };
    case 'SEARCH_REQUEST':
      const fullList = [...state.trends, ...state.originals];
      if (action.payload === '' || action.payload === ' ') return { ...state, search: [] };
      return {
        ...state,
        search: fullList.filter((item) => item.title.toLowerCase().includes(action.payload.toLowerCase())) || [],
      };
    default:
      return state;
  }

};

export default reducer;
