'use client';

import { useQuery } from '@apollo/client';
import { GET_GREETING } from '../../graphQL/queries';

export default function Weather() {
    const { data, loading, error } = useQuery(GET_GREETING);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return <h1>{data.getGreeting}</h1>;
}
