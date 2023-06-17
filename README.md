# UNIBIT Assignment

# Problem Statement:
- Create Login API
- Create Tambula ticket Create API*(No of tickets will be variable not a fixed number).
Return a Unique id on the Creation of the ticket.
- Create a Tambula ticket fetch API to fetch all the ticket lists associated with the
Respective ID with pagination.
Tambula Ticket Generator Rules:

- The numbers 1 to 90 are used once only.
- In the first column are the numbers 1 to 9, the second column has numbers
10 to 19, etc, all the way to the 9th column which has numbers 80 to 90 in it.
- Every row must have exactly 5 numbers in it.
- In a specific column, numbers must be arranged in ascending order from top
to bottom.
- All the numbers 1 to 90 are used only once in each set of 6 tickets.
- Each column must have at least 1 number
- Blank Cell fill by zero or “x”
- Each ticket must be unique from another ticket

# Conditions:
- Database Use(MongoDB/MySQL)
- All injection type & DataBase attacks must be prevented
- Coding architecture & style must be Production Graded.
- Only Use Node.JS

# Sample Ticket Array:
{
"tickets": {
"ticket1": [
[0, 19, 0, 31, 0, 0, 61, 74, 85],
[4, 14, 0,0 , 40, 0, 0, 77, 86],
[0, 18, 25, 37, 0, 54, 64, 0, 0]
],
"ticket2": [
[2, 0, 23, 38, 0, 53, 0, 0, 83],
[0, 13, 0, 0, 46, 59, 70, 79, 0],
[6, 0, 29, 41, 49, 0, 68, 0, 0]
],
"ticket3": [
[0, 15, 0, 33, 45, 0, 0, 76, 81],
[7, 12, 0, 0, 0, 52, 0, 75, 82],
[0, 0, 22, 39, 0, 57, 66, 0, 89]
],
"ticket4": [
[8, 11, 20, 0, 0, 0, 0, 73, 84],
[3, 0, 0, 34, 42, 51, 65, 0, 0],
[0, 0, 0, 36, 48, 50, 0, 72, 88]
],
"ticket5": [
[1, 16, 27, 35, 0, 56,0, 0, 0],
[0, 17, 0, 32, 0, 55, 67, 78, 0],
[5, 0, 28, 0, 43, 0, 69, 0, 87]
],
"ticket6": [
[0, 10, 21, 0, 44, 0, 60, 0, 80],
[9, 0, 26, 30, 0, 58, 63, 0, 0],
[0, 0, 24, 0, 47, 0, 62, 71, 90]
]
}
}

## Prerequisites

Below noted things you need to install to run this project in your system

- Node.js
- NPM
- MongoDB

### To Setup

Clone or download this repository

1. `cd unibit/`
2. `npm install`

### After Setting Up To Run the Node Server

You can use either of these two

1. `node index.js`
2. `npm start`

# USER APIs
# 1. POST API - Creating a profile
# 2. POST API – Logging in the User
# 3. PUT API – Updating a profile
# 4. DELETE API – Deleting a profile


If facing any issue please Contact me.

`   -------- Thanks for reading -----------   `
              **ANISH TIWARI**
