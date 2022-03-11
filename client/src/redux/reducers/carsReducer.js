const initialData = {
    cars: [],
    filteredCars: []
};

export const carsReducer = (state = initialData, action) => {

    switch (action.type) {
        case 'GET_ALL_CARS' : {
            return {
                ...state,
                cars: action.payload
            }
        }

        case 'GET_FILTERED_CARS' : {
            return {
                ...state,
                filteredCars: action.payload
            }
        }

        default:
            return state
    }

}

