### GraphQL

#### 1.查询字段时，是并行执行，而变更字段时，是线性执行，串形执行，一个接着一个。
#### 2.一个接口是一个抽象类型，它包含某些字段，而对象类型必须包含这些字段，才能算实现了这个接口。
#### 3.联合类型的成员需要是具体对象类型；你不能使用接口或者其他联合类型来创造一个联合类型。
#### 4.输入对象类型的字段当然也不能拥有参数。
#### 5.如果字段产生标量值，例如字符串或数字，则执行完成。如果一个字段产生一个对象，则该查询将继续执行该对象对应字段的解析器，直到生成标量值。GraphQL 查询始终以标量值结束

  GraphQL连接的对象是数据和操作(Service层)，而不是数据库。
  syntax-error-unterminated-string，这是碰到块级字符串时容易出现的问题，有两种方案：一种是按GraphQL规范，使用"""封装块级字符串，另一种方案是使用GraphQL变量来接收块级字符串
  服务端查询执行的核心算法也很简单：就是查询逐字段遍历，并为各字段执行一个 resolver 以处理数据操作。
  Facebook 推出的 DataLoader 就是一个这样的数据批量处理和缓存的方案。
  所谓 introspection 查询，就是指客户端向服务器询问 API Schema 信息的查询。
  
### 定义：
type TypeName {
  KEY: TYPE[DECORATE]
  …
}
1. 大括号中的各行遵循 KEY:TYPE 的模式，其中 KEY 为该类型所包含的键，可以为任意字符串；TYPE 为 KEY 的类型，可以是 GraphQL 中预定义类型中的任意一种，也可以是用户定义好的其他自定义类型。

### 基本操作
GraphQL 的主要操作包括查询 (Query)、变更 (Mutation) 和订阅 (Subscription)。
客户端通过 Query 从 Service 获取数据，通过 Mutation 向 Service 发起变更操作(增删改)。
通过 Subscription 向 Service 发起订阅请求并建立套接字链接，监听相关数据的变更。

其中 query 为关键字(可省略)，表明该操作为 query 操作。getCourses 为操作名称(可省略)，由开发自定义。
对于 query 中的多个操作和 mutation 中的多个操作，我们可以分别理解为 Promise.all[oper1, oper2, …] 和 new Promise(oper1).then((res) => oper2 …)。

resolvers 实际上是一个对象，其包含 Query、Mutation 和 Subscription，他们所包含的内容与 typeDefs 中声明的各个方法一一对应，是各声明的具体实现。

Apollo 提供了两种包含 ApolloClient 的库，分别为 apollo-boost 和 apollo-client。
其区别在于 apollo-boost 暴露的 ApolloClient 已对 Client 做好大多配置。
apollo-client 暴露的 ApolloClient 灵活度更高，可配置性更强。

### 问题
1. 过度获取
2. 冗余判断

需要注意的是，GraphQL中的字符串需要包装在双引号中。
除了参数，query还允许你使用变量来让参数可动态变化，变量以$开头书写。
Fragment支持多层级地继承。
Directives提供了一种动态使用变量改变我们的queries的方法。

当另外两个由客户端通过HTTP请求发送，订阅是服务器在某个事件发生时将数据本身推送给感兴趣的客户端的一种方式。这就是GraphQL 处理实时通信的方式。

GraphQL解除了接口和数据之间的绑定，对业务数据模型做了抽象和整理，以图的方式来明确模型之间的关系，通过这些关系，具体业务场景可以定制自己的数据，不同的业务场景只要基于同样一套基础数据模型就可以复用过往的接口。


