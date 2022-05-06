const initialData = {
    cars: [],
    filteredCars: [],
    filteredCarsInCategory: [],
    categories:[]
};

export const carsReducer = (state = initialData, action) => {

    switch (action.type) {
        case 'GET_ALL_CARS' : {
            return {
                ...state,
                cars: action.payload
            }
        }
        case 'GET_ALL_CATEGORIES' : {
            return {
                ...state,
                categories: action.payload
            }
        }

        case 'GET_FILTERED_CARS' : {
            return {
                ...state,
                filteredCars: action.payload
            }
        }

        case 'GET_FILTERED_CARS_IN_CATEGORY' : {
            return {
                ...state,
                filteredCarsInCategory: action.payload
            }
        }

        default:
            return state
    }

}

