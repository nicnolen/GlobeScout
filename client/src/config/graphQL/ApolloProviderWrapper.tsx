'use client';

import React, { JSX } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';

export default function ApolloProviderWrapper({ children }: { children: React.ReactNode }): JSX.Element {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
