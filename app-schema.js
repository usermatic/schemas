module.exports = `
  type PasswordCred {
    id: ID!
    email: String!
    verifiedEmail: Boolean!
  }

  type OauthCred {
    id: ID!
    provider: String!
    providerID: String!
    oauthEmail: String
  }

  type TotpCred {
    id: ID!
  }

  union AppUserCredential = PasswordCred | OauthCred | TotpCred

  type Name {
    first: String
    last: String
  }

  type Profile {
    name: Name
  }

  type AppUser {
    id: ID!
    credentials: [AppUserCredential!]!
    profile: Profile
  }

  input HostInput {
    hostname: String!
  }

  input AppConfigInput {
    verifyEmail: Boolean
    requireVerification: Boolean

    # MFA settings
    totpEnabled: Boolean
    requireMFA: Boolean

    # where verification emails should link to
    verificationTargetUri: String
    # where to redirect the user after clicking a verification email.
    verificationRedirectUri: String

    # where password reset emails should link to
    resetPasswordUri: String
    # where to redirect the user after resetting their password
    resetPasswordRedirectUri: String

    # How strong must a password be for a user to use it?
    minPasswordStrength: Int

    # Which oauth providers are enabled
    fbLoginEnabled: Boolean
    googleLoginEnabled: Boolean
    githubLoginEnabled: Boolean

    # oauth provider id/secrets
    fbClientID: String
    fbClientSecret: String
    googleClientID: String
    googleClientSecret: String
    googleScopes: String
    googleOffline: Boolean
    githubClientID: String
    githubClientSecret: String

    oauthRedirectUrl: String
    oauthFailureUrl: String

    # allow connection from http, for testing.
    allowHttp: Boolean
  }

  type AppConfig {
    # Send verification email?
    verifyEmail: Boolean
    # Require email verification before login
    requireVerification: Boolean

    # MFA settings
    totpEnabled: Boolean
    requireMFA: Boolean

    # where verification emails should link to
    verificationTargetUri: String
    # where to redirect the user after clicking a verification email.
    verificationRedirectUri: String

    # where password reset emails should link to
    resetPasswordUri: String
    # where to redirect the user after resetting their password
    resetPasswordRedirectUri: String

    # How strong must a password be for a user to use it?
    minPasswordStrength: Int!

    # Which oauth providers are enabled
    fbLoginEnabled: Boolean
    googleLoginEnabled: Boolean
    githubLoginEnabled: Boolean

    # oauth provider id/secrets
    fbClientID: String
    fbClientSecret: String
    googleClientID: String
    googleClientSecret: String
    googleScopes: String
    googleOffline: Boolean
    githubClientID: String
    githubClientSecret: String

    oauthRedirectUrl: String
    oauthFailureUrl: String

    # allow connection from http, for testing.
    allowHttp: Boolean
  }

  type AppHost {
    id: ID!
    hostname: String!
  }

  input UserFilter {
    email: String
    hasPassword: Boolean
    # has any oauth login
    hasOauth: Boolean
    # has oauth login from specific providers
    hasOauthProviders: [String!]
  }

  type UserResult {
    users: [AppUser!]!
    # cursor can be null if zero users are returned
    cursor: String
  }

  type App {
    id: ID!
    name: String!
    users (count: Int, userFilter: UserFilter, cursor: String): UserResult!
    secret: String!
    config: AppConfig!
    plan: PricePlan
    hosts: [AppHost!]!
  }

  enum PricePlan {
    T0
    T1
    T2
  }

  type StripeLineItem {
    description: String!
    quantity: Int!
    amount: Int!
  }

  type StripeInvoice {
    periodStart: Int!
    periodEnd: Int!
    lineItems: [StripeLineItem!]!
    subtotal: Int!
    tax: Int
    total: Int!
  }

  type StripeCustomer {
    id: ID!
    stripeId: ID!
    userId: ID!
    name: String!
    email: String!
    plan: PricePlan!
    upcomingInvoice: StripeInvoice!
  }

  type StripeSetupIntent {
    # same as clientSecret for now.
    id: ID!
    clientSecret: ID!
  }

  type StripePlan {
    id: ID!
    stripeId: ID!
    basePrice: Int!
  }

  type Stripe {
    id: ID! # the userId who is doing the checkout
    setupIntent: StripeSetupIntent!
    customer: StripeCustomer
  }

  type Query {
    apps(userId: ID!): [App!]!
    app(appId: ID!): App!
    stripe(userId: ID!): Stripe!
    stripePlan(tier: String!): StripePlan!
  }

  type CreateAppPayload {
    app: App!
    refetch: Query
  }

  type SuccessPayload {
    success: Boolean
    refetch: Query
  }

  type Mutation {

    createApp(
      userId: ID!
      name: String!
      hosts: [HostInput]!
    ): CreateAppPayload!

    deleteApp(appId: ID!, reauthToken: String!): SuccessPayload!

    addHost(appId: ID!, host: String!): SuccessPayload!

    removeHost(appId: ID!, hostId: ID!): SuccessPayload!

    addAppUser(
      appId: ID!
      email: String!
      password: String!
    ): AppUser!

    deleteAppUser(
      userId: ID!
    ): Boolean!

    setAppConfig(
      appId: ID!
      config: AppConfigInput!
    ): AppConfig!

    stripeCreateCustomer(
      userId: ID!
      plan: PricePlan!
      paymentMethod: ID!
      email: String!
      name: String!
      paymentConsent: Boolean!
    ): StripeCustomer!
  }
`
