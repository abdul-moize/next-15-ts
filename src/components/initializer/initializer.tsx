import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

export const Initializer = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
