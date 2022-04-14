const initialData = {
    reviews: []
};

export const reviewsReducer = (state = initialData, action) => {

    switch (action.type) {
            case 'GET_ALL_REVIEWS' : {
            return {
                ...state,
                reviews: action.payload
            }
        }

        default:
            return state
    }

}