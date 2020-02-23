const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');
const { GraphQLScalarType } = require('graphql');

const userList = [{
  id: 1,
  name: 'wkylin',
  email: 'wkylin.w@gmail.com'
}];

const notices = [{ id: 1, content: '这是 notice', noticeTime: 1524710641 }];
const reminds = [{ id: 1, content: '这是 remind', endTime: 1524710641 }];

const typeDefs = gql`
    type Query {
        hello: String
        getBooks: [Book]
        getAuthors: [Author]
        favoriteColor: AllowedColor
        avatar(borderColor: AllowedColor): String
        searchUnion (text: String!): MessageResult!
        human(id: ID!): Human
        getUsers:[User]
    }
    type Mutation {
        addBook(title: String, author: String): Book
        createPost(post: PostAndMediaInput): Post
        updateUserEmail(id: ID!, email: String!): User
        updateMyUser(id: ID!, name:String!): User
    }

    scalar Date

    interface Message {
        content: String
    }

    type Notice implements Message {
        content: String
        noticeTime: Date
    }

    type Remind implements Message {
        content: String
        endTime: Date
    }

    union MessageResult = Notice | Remind

    type User {
        id: ID!
        name: String!
        email: String!
    }
    type Book {
        title: String
        author: Author
        email: String!
    }
    
    fragment userDetails on User {
        name
        email
    }

    type Author {
        name: String
        books: [Book]
    }

    input PostAndMediaInput {
        title: String
        body: String
        mediaUrls: [String]
    }

    type Post {
        title: String
        body: String
        mediaUrls:[String]
    }

    type Starship {
        name: String
    }

    enum AllowedColor {
        RED
        GREEN
        BLUE
    }

    enum Episode {
        NEWHOPE
        EMPIRE
        JEDI
    }

    interface Character {
        id: ID!
        name: String!
        friends: [Character]
        appearsIn: [Episode]!
    }
    type Human implements Character {
        id: ID!
        name: String!
        friends: [Character]
        appearsIn: [Episode]!
        starships: [Starship]
        totalCredits: Int
    }
    type Droid implements Character {
        id: ID!
        name: String!
        friends: [Character]
        appearsIn: [Episode]!
        primaryFunction: String
    }
`;

const resolvers = {
  MessageResult: {
    __resolveType(parent, context, info) {
      console.log(parent, context, info);
      if (parent.noticeTime) {
        return 'Notice';
      }
      if (parent.endTime) {
        return 'Remind';
      }
      return null;
    }
  },
  Message:{
    __resolveType(parent, context, info) {
        return {
          content: '我的中国心'
        };
    }
  },
  Character:{
    __resolveType(parent, context, info){
      return {
        id: 1000,
        name: "Hello",
        friends: {
          id: 10023,
          name: "Ho",
          friends:[],
          appearsIn:["EMPIRE"]
        },
        appearsIn: ["EMPIRE"],
      }
    }
  },
  Query: {
    hello: () => 'Hello world',
    getBooks: () => {
      return [
        {
          title: 'Type Script',
          author: {
            name: 'A san',
            books: [
              {
                title: 'Type Script',
                author: {
                  name: 'A san',
                  books: []
                }
              }
            ]
          }
        }
      ];
    },
    getAuthors: () => {
      return [
        {
          name: 'A san',
          books: [
            {
              name: 'js',
              author: {
                name: 'Hello one',
                books: []
              }
            }
          ]
        }
      ];
    },
    favoriteColor: () => 'RED',
    avatar: (parent, args, context, info) => {
      // console.log('args', args);
      return args.borderColor;
    },
    searchUnion: (parent, { text }) => {
      if (text === 'notice') {
        return notices[0];
      } else {
        return reminds[0];
      }
    },
    human:(parent, args, context)=> {
      return {
        id: 1001,
        name: "Hone",
        friends: [{
        
        }],
        appearsIn: [],
        starships: [],
        totalCredits: 100000,
      }
    },
    getUsers:(parent, args, context) => {
      return [
        {
          id: 11111,
          name: "Jone",
          email: "wkylin.w@gmail.com"
        }
      ]
    }
  },
  Mutation: {
    addBook: (parent, args) => {
      console.log('args', args);
      console.log('parent', parent);
      return {
        title: args.title,
        author: {
          name: args.author
        }
      };
    },
    createPost: (parent, args) => {
      // console.log('args', args);
      return {
        title: args.post.title,
        body: args.post.body,
        mediaUrls: ['http://www.baidu.com']
      };
    },
    updateUserEmail: (parent, args) => {
      console.log('email args', args);
      const user = userList.filter((user) => {
        return user.id === +args.id;
      });
      console.log('user', user);
      user[0].email = args.email;
      return user[0];
    },
    updateMyUser: (parent, args) => {
      console.log('update args', args);
      const user = userList.filter((user) => {
        return user.id = args.id;
      });
      user[0].name = args.name;
      return user[0];
    }
  },
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      // return new Date(value).getTime()
      return new Date(value) // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    }
  })
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  typeResolvers:{},
  resolverValidationOptions: {
    requireResolversForResolveType: false
  },
  tracing: true,
});

const app = new Koa();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});
