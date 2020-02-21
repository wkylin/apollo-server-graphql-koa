const Koa = require('koa');
const { ApolloServer, gql} = require('apollo-server-koa');

const userList = [{
  id:1,
  name: 'wkylin',
  email: 'wkylin.w@gmail.com'
}];

const typeDefs = gql`
  type Query {
      hello: String
      getBooks: [Book]
      getAuthors: [Author]
      favoriteColor: AllowedColor
      avatar(borderColor: AllowedColor): String
  }
  type Mutation {
      addBook(title: String, author: String): Book
      createPost(post: PostAndMediaInput): Post
      updateUserEmail(id: ID!, email: String!): User
      updateMyUser(id: ID!, name:String!): User
  }

  type User {
      id: ID!
      name: String!
      email: String!
  }
  type Book {
      title: String
      author: Author
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

#  interface MutationResponse {
#      code: String!
#      success: Boolean!
#      message: String!
#  }
#  type UpdateUserEmailMutationResponse implements MutationResponse {
#      code: String!
#      success: Boolean!
#      message: String!
#      user: User
#  }

  enum AllowedColor {
      RED
      GREEN
      BLUE
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world',
    getBooks:() => {
      return [
        {
          title: 'Type Script',
          author:{
            name:'A san',
            books:[
              {
                title:'Type Script',
                author:{
                  name:'A san',
                  books:[]
                }
              }
            ]
          }
        }
      ]
    },
    getAuthors: () => {
      return [
        {
          name: 'A san',
          books:[
            {
              name: 'js',
              author:{
                name:'Hello one',
                books:[]
              }
            }
          ]
        }
      ]
    },
    favoriteColor: () => 'RED',
    avatar: (parent, args) => {
      console.log('args', args);
      return args.borderColor;
      // args.borderColor is 'RED', 'GREEN', or 'BLUE'
    },
  },
  Mutation:{
    addBook:(parent,args) => {
      console.log('args', args);
      console.log('parent', parent);
      return {
        title: args.title,
        author: {
          name: args.author
        }
      }
    },
    createPost:(parent, args) => {
      // console.log('args', args);
      return {
        title: args.post.title,
        body: args.post.body,
        mediaUrls:['http://www.baidu.com']
      }
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
    updateMyUser:(parent, args) => {
      console.log('update args', args);
      const user = userList.filter((user) => {
        return user.id = args.id;
      });
      user[0].name = args.name;
      return user[0];
    }
  }
};

const server = new ApolloServer({typeDefs, resolvers});

const app = new Koa();

server.applyMiddleware({app});

app.listen({ port: 4000}, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});
