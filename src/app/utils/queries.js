export const GET_PROFILE = `
query GetProfile($userId: Int!) {
  event_user(where: { userId: { _eq: $userId }, eventId: { _eq: 20 } }) {
    level
    user {
      firstName
      lastName
      login
      transactions_aggregate(where: { type: { _eq: "xp" }, eventId: { _eq: 20 } }) {
        aggregate {
          sum {
            amount
          }
        }
      }
      transactions(
        where: {
          type: {
            _in: [
              "skill_js"
              "skill_go"
              "skill_html"
              "skill_prog"
              "skill_front-end"
              "skill_back-end"
            ]
          }
        }
        order_by: [{ type: desc }, { amount: desc }]
        distinct_on: [type]
      ) {
        type
        amount
      }
    }
  }
}
`

export const GET_PASS_TREND = `
query GetPassTrend($userId: Int!) {
  progress(
    where: { userId: { _eq: $userId } }
    order_by: {updatedAt: asc}
  ) {
    path
    grade
    eventId
  }
}
`

export const GET_PASS_TREND_MODULE = `
query GetPassTrendMod($userId: Int!, $module: Int!) {
  progress(
    where: { userId: { _eq: $userId }, eventId: { _eq: $module } }
    order_by: {updatedAt: asc}
  ) {
    path
    grade
  }
}
`


export const GET_XP_TREND = `
query GetXpTrend($userId: Int!) {
  transaction(
    where: { userId: { _eq: $userId }, type: {_eq:"xp"} }
    order_by: {createdAt: asc}
  ) {
    path
    amount
    eventId
  }
}
`

export const GET_XP_TREND_MODULE = `
query GetXpTrendMod($userId: Int!, $module: Int!) {
  transaction(
    where: { userId: { _eq: $userId }, type: {_eq:"xp"}, eventId: { _eq: $module } }
    order_by: {createdAt: asc}
  ) {
    path
    amount
  }
}
`

export const GET_AUDIT_RATIO = `
query GetAuditRatio($userId: Int!) {
  user(where: { id: { _eq: $userId } }) {
    totalUp
    totalDown
    auditRatio
  }
}
`