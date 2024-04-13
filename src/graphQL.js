"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
    tag: Tag!
  }

  input PostCreate {
    title: String!
    content: String!
    tagId: ID!
  }

  type Tag {
    id: ID!
    name: String!
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getTags: [Tag!]!
    getPostsByTag(tagId: ID!): [Post!]!
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, title: String, content: String, tagId: String): Post!
    createTag(name: String!): Tag!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
    getTags: (_parent, args, { app }) => {
      console.log(app.db);
      return app.db.tags; 
    },
    getPostsByTag: (_parent, { tagId }, { app }) => {
      return app.db.posts.filter(post => post.tag.id === tagId);
    }
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content, tagId } = newPost;

      const tag = app.db.tags.find(tag => tag.id === tagId);

      const post = {
        id: randomUUID(),
        title,
        content,
        tag,
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, { id }, { app }) => {
      const postIndex = app.db.posts.findIndex(post => post.id === id);
      if (postIndex === -1) {
        throw new Error("Post not found");
      }

      const deletedPost = app.db.posts[postIndex];

      app.db.posts.splice(postIndex, 1);

      return deletedPost;
    },
    updatePost: (_parent, { id, title, content, tagId }, { app }) => {
      const index = app.db.posts.findIndex(post => post.id === id);
    
      const post = app.db.posts[index];

      if (title !== undefined) {
        post.title = title;
      }
      if (content !== undefined) {
        post.content = content;
      }
      if (tag !== undefined) {
        const tag = app.db.tags.find(tag => tag.id === tagId);
        post.tag = tag;
      }
      app.db.posts[index] = post;
      return post;
    },
    createTag: (_parent, { name }, { app }) => {
      if(!app.db.tags) {
        app.db.tags = [];
      }
      const newTag = {
        id: randomUUID(), 
        name,
      };
      app.db.tags.push(newTag); 
      return newTag;
    },
    
  },
};

export const loaders = {};
