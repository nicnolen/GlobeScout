import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/graphql`,
    credentials: 'include',
    cache: new InMemoryCache(),
});

export default client;
