const graphql = require('graphql');
// const _ = require('lodash');
const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const Book = require('../models/book');
const Author = require('../models/author')
{
// let books = [
//     {id: "1", name: "ABC", genre: "Fantasy", authorID: "1"},
//     {id: "2", name: "XYZ", genre: "Horror", authorID: "2"},
//     {id: "3", name: "MVC", genre: "Comedy", authorID: "3"},
//     {id: "4", name: "Test", genre: "Fantasy", authorID: "3"},
//     {id: "5", name: "Purple", genre: "Horror", authorID: "2"},
//     {id: "6", name: "Mobile", genre: "Comedy", authorID: "3"}
// ];

// let authors = [
//     {id: "1", name: "Ali", age: 23},
//     {id: "2", name: "Ahmad", age: 24},
//     {id: "3", name: "Asad", age: 25}
// ];
}

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                // console.log(parent);
                // return _.find(authors,{id: parent.authorID});
                return Author.findById(parent.authorId);
            
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, {authorID: parent.id});
                return Book.find({authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // return _.find(books, {id: args.id});
                // code to get data from DB/ other source
                return Book.findById(args.id);
            }

        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                // return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books;
                return Book.find();
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors;
                return Author.find();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId:{type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }

    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});