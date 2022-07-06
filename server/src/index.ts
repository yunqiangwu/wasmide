import "reflect-metadata"
import * as path from 'path';
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column, createConnection, Connection } from 'typeorm';
import "reflect-metadata"
import { buildSchema, ObjectType, Field, ID, Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import * as express from 'express';

@Entity()
class PostEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created: Date;

  @Column('text')
  content: string;
}

@ObjectType()
class Post {

  @Field(type => ID)
  id: string;

  @Field()
  created: Date;

  @Field()
  content: string;
}

@Resolver(Post)
class PostResolver {


  @Query(returns => [Post])
  async posts(
    @Ctx() context: AppContext,
  ): Promise<Post[]> {
    const postRepository = context.connection.getRepository(PostEntity);
    return await postRepository.find();
  }

  @Mutation(returns => Post)
  async createPost(
    @Ctx() context: AppContext,
    @Arg('content') content: string,
  ): Promise<Post> {
    const postRepository = context.connection.getRepository(PostEntity);
    const post = await postRepository.save({ content });
    return post;
  }

  @Mutation(returns => Post)
  async updatePost(
    @Ctx() context: AppContext,
    @Arg('postId') postId: string,
    @Arg('content') content: string,
  ): Promise<Post> {
    const postRepository = context.connection.getRepository(PostEntity);
    await postRepository.update(postId, { content });
    return await postRepository.findOneOrFail(postId);
  }

  @Mutation(returns => String)
  async deletePost(
    @Ctx() context: AppContext,
    @Arg('postId') postId: string
  ): Promise<string> {
    const postRepository = context.connection.getRepository(PostEntity);
    await postRepository.delete(postId);
    return postId;
  }

}

type AppContext = {
  connection: Connection,
};

async function main() {

  try {

    // const schema = await buildSchema({
    //   resolvers: [PostResolver],
    //   dateScalarMode: 'timestamp'
    // });


    // const server = new ApolloServer({
    //   schema,
    //   playground: true
    // });

    // const { url } = await server.listen(4444);

    // console.log(`GraphQL Playground available at ${url}`);

    const connection = await createConnection({
      type: 'sqlite',
      database: path.resolve(__dirname, '_temp_dir/sqlite.db'),
      synchronize: true,
      entities: [PostEntity],
    });

    console.log('Create connection success!');

    // const postRepository = connection.getRepository(PostEntity);

    // 新增
    // const result = await postRepository.insert({ content: '提供基于GraphQL API的数据查询及访问,「Hasura」获990万美元A轮...' });
    // console.log(`insert post success: ${JSON.stringify(result, null, 2)}`);

    // 修改
    // const result = await postRepository
    //   .update('fefc7d7c-4d33-45e2-b437-88db8e920f5d', { content: 'Hello GraphQL' });
    // console.log(`update post success: ${JSON.stringify(result, null, 2)}`);

    // // 删除
    // const result = await postRepository
    //   .delete('fefc7d7c-4d33-45e2-b437-88db8e920f5d');
    // console.log(`delete post success: ${JSON.stringify(result, null, 2)}`);

    const schema = await buildSchema({
      resolvers: [PostResolver],
      dateScalarMode: 'timestamp'
    });

    const context: AppContext = {
      connection
    };

    const server = new ApolloServer({
      context,
      schema,
      playground: true
    });

    const app = express();
    const port = 3001;



    app.get('/', (req, res) => {
      res.send('He2llo W2or33l3d!')
    });

    server.applyMiddleware({
      app,
      path: '/api',
    });

    await new Promise((resolve: any) => app.listen({ port }, resolve));

    console.log(`Example app listening on port ${port}`)

    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);

    return {
      app, server
    };

  } catch (error) {
    console.error(error);
  }

  return null;

}

main();