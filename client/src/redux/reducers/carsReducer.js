const initialData = {
    cars: [],
    filteredCars:  [],
    filteredCarsInAddress: [],
    categories:[],
    locations:[],
    savedCarsIds:JSON.parse(localStorage.getItem('userSaved')) ||[],
    savedCars:[]
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

        case 'GET_ALL_LOCATIONS' : {
            return {
                ...state,
                locations: action.payload
            }
        }

        case 'GET_FILTERED_CARS' : {
            return {
                ...state,
                filteredCars: action.payload
            }
        }

        case 'GET_FILTERED_CARS_IN_ADDRESS' : {
            return {
                ...state,
                filteredCarsInAddress: action.payload
            }
        }
        case 'GET_SAVED_CARS' : {
            return {
                ...state,
                savedCars: action.payload
            }
        }
        case 'ADD-SAVED-CAR-ID' : {
            //в массиве нет машины которую мы хотим добавить значит ее можно добавить
            if (state.savedCarsIds.every(c => c !== action.payload)) {
                return {
                    ...state,
                    savedCarsIds: [...state.savedCarsIds, action.payload]
                }
                //в массиве есть машина значит мы хотим удалить ее из избранных
            } else if (state.savedCarsIds.some(c => c === action.payload)) {
                return {
                    ...state,
                    savedCarsIds: state.savedCarsIds.filter(c=>c!==action.payload)
                }
            } else return state
        }

        default:
            return state
    }

}

