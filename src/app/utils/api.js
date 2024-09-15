import {
    GET_PROFILE,
    GET_AUDIT_RATIO,
    GET_PASS_TREND,
    GET_PASS_TREND_MODULE,
    GET_XP_TREND,
    GET_XP_TREND_MODULE
} from './queries';

export async function apiLogin(username, password) {
    const response = await fetch('https://learn.reboot01.com/api/auth/signin', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${btoa(username + ':' + password)}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }

    const data = await response.text();
    return { token: data.replace(/"/g, '') };
}

// Helper function for GraphQL requests
export async function graphqlRequest(query, variables) {
    const jwt = localStorage.getItem('hasura-jwt');
    const response = await fetch('https://learn.reboot01.com/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        throw new Error('GraphQL request failed');
    }

    const result = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }

    return result;
}

export async function fetchProfileData(userId) {
    const response = await graphqlRequest(GET_PROFILE, { userId });
    const data =  response.data.event_user[0];
    return [data.user.login, 
        data.user.firstName, 
        data.user.lastName, 
        data.level, 
        data.user.transactions_aggregate.aggregate.sum.amount,
        [
            data.user.transactions.map(transaction => {
                return [" " + transaction.type.split("_").pop() + ": ", transaction.amount + "%"]
            } )
        ]
    ];
}

export async function fetchAuditRatioData(userId) {
    const response = await graphqlRequest(GET_AUDIT_RATIO, { userId });
    return Object.values(response.data.user[0]);
}

export async function fetchPassTrendData(userId) {
    const response = await graphqlRequest(GET_PASS_TREND, { userId });
    const convert = response.data.progress.map((elem) => Object.values(elem))
    return convert;
}

export async function fetchPassTrendModuleData(userId,moduleId) {
    const response = await graphqlRequest(GET_PASS_TREND_MODULE, { userId, moduleId });
    const convert = response.data.progress.map((elem) => Object.values(elem))
    return convert;
}

export async function fetchXPTrendData(userId) {
    const response = await graphqlRequest(GET_XP_TREND, { userId });
    const convert = response.data.transaction.map((elem) => Object.values(elem))
    return convert;
}

export async function fetchXPTrendModuleData(userId,moduleId) {
    const response = await graphqlRequest(GET_XP_TREND_MODULE, { userId,moduleId });
    const convert = response.data.transaction.map((elem) => Object.values(elem))
    return convert;
}
