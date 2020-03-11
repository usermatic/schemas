module.exports = `
  type AppUser {
    id: ID!
    email: String!
    verified_email: Boolean
    first_name: String
    last_name: String
  }

  input HostInput {
    hostname: String!
  }

  input AppConfigInput {
    verifyEmail: Boolean
    requireVerification: Boolean

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
  }

  type AppConfig {
    # Send verification email?
    verifyEmail: Boolean
    # Require email verification before login
    requireVerification: Boolean

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
  }

  type AppHost {
    id: ID!
    hostname: String!
  }

  type App {
    id: ID!
    name: String!
    users (count: Int, offset: Int): [AppUser]!
    secret: String!
    config: AppConfig!
    hosts: [AppHost]!
  }

  type StripeCustomer {
    id: ID!
    stripeId: ID!
    userId: ID!
  }

  type StripeSetupIntent {
    # same as clientSecret for now.
    id: ID!
    clientSecret: ID!
  }

  type Stripe {
    id: ID! # the userId who is doing the checkout
    setupIntent: StripeSetupIntent!
    customer: StripeCustomer
  }

  type Query {
    apps(userId: ID!): [App]!
    app(appId: ID!): App!
    stripe(userId: ID!): Stripe!
  }

  enum PricePlan {
    BASIC
    PRO
    PREMIUM
  }

  type Mutation {

    createApp(
      userId: ID!
      name: String!
      hosts: [HostInput]!
    ): App!

    deleteApp(appId: ID!): Boolean!

    addHost(appId: ID!, host: String!): AppHost!

    removeHost(appId: ID!, hostId: ID!): Boolean!

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
      paymentConsent: Boolean!
    ): StripeCustomer!
  }
`
