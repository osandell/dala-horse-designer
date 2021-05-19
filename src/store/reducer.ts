const Reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'ADD_DESIGN':
            return {
                ...state,
                posts: action.payload
            };
        case 'REMOVE_DESIGN':
            return {
                ...state,
                posts: state.posts.concat(action.payload)
            };
        default:
            return state;
    }
};

export default Reducer;