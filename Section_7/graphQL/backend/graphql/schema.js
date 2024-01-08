const { buildSchema } = require("graphql");

const schema = buildSchema(`
  schema {
    query: RootQuery
    mutation: RootMutation
  }

  type RootQuery {
    getPosts(page: Int): PostData!
  }

  type PostData {
    posts: [Post!]!
    totalPosts: Int!
  }

  type AuthData {
    token: String!
    userId: String!
  }

  type RootMutation {
    createUser(userInput: UserInputData!): User!
    login(email: String!, password: String!): AuthData!
    createPost(postInput: PostInputData): Post!
  }

  input PostInputData {
    title: String!
    imageUrl: String!
    content: String!
  }

  input UserInputData {
    email: String!
    password: String!
    name: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    name: String!
    status: String!
    posts: [Post!]!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }
`);

module.exports = schema;
