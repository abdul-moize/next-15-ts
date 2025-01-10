import { RootState } from '../../store';
import { CounterState } from './counter-slice';

const getCounterState = (key: keyof CounterState) => (state: RootState) => state.counter[key];
export const selectCounterValue = getCounterState('value');
