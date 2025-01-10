'use client';

import { selectCounterValue } from '../../redux/reducers/counter/counter-selector';
import { decrement, increment } from '../../redux/reducers/counter/counter-slice';
import { useAppDispatch, useAppSelector } from '../../redux/store';

export const HomePage = () => {
  const counter = useAppSelector(selectCounterValue);
  const dispatch = useAppDispatch();

  const onIncrement = () => {
    dispatch(increment());
  };

  const onDecrement = () => {
    dispatch(decrement());
  };

  return (
    <div>
      <h1>Home</h1>
      <p>
        Counter:
        {counter}
      </p>
      <button type="button" onClick={onIncrement}>Increment</button>
      <button type="button" onClick={onDecrement}>Decrement</button>
    </div>
  );
};
