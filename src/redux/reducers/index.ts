import { combineReducers } from '@reduxjs/toolkit';
import { counterSlice } from './counter/counter-slice';

export const appReducer = combineReducers({ counter: counterSlice.reducer });
