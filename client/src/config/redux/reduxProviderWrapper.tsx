'use client';

import React, { JSX } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../redux/store';

export default function ReduxProviderWrapper({ children }: { children: React.ReactNode }): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
}
