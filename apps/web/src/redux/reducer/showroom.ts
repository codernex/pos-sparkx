import {Reducer} from '@reduxjs/toolkit';
import {
    ADD_SHOWROOM_ERR,
    ADD_SHOWROOM_LOADING,
    ADD_SHOWROOM_SUCCESS,
    DELETE_SHOWROOM_ERR,
    DELETE_SHOWROOM_LOADING,
    DELETE_SHOWROOM_SUCCESS,
    FETCH_SHOWROOM_ERR,
    FETCH_SHOWROOM_LOADING,
    FETCH_SHOWROOM_SUCCESS,
    UPDATE_SHOWROOM_ERR,
    UPDATE_SHOWROOM_LOADING,
    UPDATE_SHOWROOM_SUCCESS
} from '../constant';
import {IShoroomState, ShoroomActionType} from '../types';

const showroom: Reducer<IShoroomState, ShoroomActionType> = function (
    state = {isLoading: false, showroom: []},
    action
) {
    switch (action.type) {
        case FETCH_SHOWROOM_LOADING: {
            return {...state, isLoading: true};
        }

        case FETCH_SHOWROOM_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                showroom: action.payload
            };
        }

        case FETCH_SHOWROOM_ERR: {
            return {...state, isLoading: false};
        }
        case ADD_SHOWROOM_LOADING: {
            return {
                ...state,
                isLoading: true
            };
        }

        case ADD_SHOWROOM_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                showroom: [...state.showroom, action.payload]
            };
        }
        case ADD_SHOWROOM_ERR: {
            return {
                ...state,
                isLoading: false
            };
        }

        case UPDATE_SHOWROOM_LOADING: {
            return {...state, isLoading: true};
        }
        case UPDATE_SHOWROOM_SUCCESS: {
            return {
                ...state,
                isLoading: false,
                showroom: state.showroom.map(item => item.id === action.payload.id ? action.payload : item)
            }
        }
        case UPDATE_SHOWROOM_ERR: {
            return {...state, isLoading: false}
        }
        case DELETE_SHOWROOM_LOADING: {
            return {...state, isLoading: true};
        }
        case DELETE_SHOWROOM_SUCCESS: {
            return {isLoading: false, showroom: action.payload}
        }
        case DELETE_SHOWROOM_ERR: {
            return {...state, isLoading: false}
        }
        default:
            return state;
    }
};

export default showroom;
