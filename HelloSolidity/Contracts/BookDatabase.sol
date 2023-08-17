// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

/*
CRUD example, to test persistence, alteration and removal of data using Mapping
*/

contract BookDatabase {

    // Book model
    struct Book {
        string title;
        uint16 year;
    }

    // books data structure
    // mapping(key => Type) visibility name
    mapping(uint32 => Book) public books;

    /*
     *** Note: In this example an integer was used, as in a database, 
         but it could be any key. String for example. A hash, etc.
    */
    // aux id control
    uint32 private nextId = 0;

    // number of records
    uint32 public total = 0;
    

    /**
     * Add new book 
     * eg: ["Book 1", 1995]
     */
    function addBook(Book memory newBook) public {
        nextId++;
        // add
        books[nextId] = newBook;
        total++;
    }


    /**
     * Edit an existent book 
     * eg: 1,["Book 2", 2000] or 1,["", 1999] or 1,["Book 3", 0]
     */
    function editBook(uint32 id, Book memory newBook) public {
        // get existant book
        Book memory oldBook = books[id];

        // title validation
        if ( !compare(newBook.title, "") && !compare(oldBook.title, newBook.title) ) {
            books[id].title = newBook.title;
        } 

        // year validation
        if ( newBook.year > 0 && oldBook.year != newBook.year ) {
            books[id].year = newBook.year;
        }
    }
            

    /**
     * Remove an existent book 
     * eg: 1
     */
    function removeBook(uint32 id) public {
        if (books[id].year > 0) {
            delete books[id];
            total--;
        }
    }


    /**
     * Compare two strings
     */
    function compare(string memory str1, string memory str2) 
        private
        pure
        returns (bool)
    {
        bytes memory arrA = bytes(str1);
        bytes memory arrB = bytes(str2);
        return arrA.length == arrB.length && keccak256(arrA) == keccak256(arrB);
    }
}