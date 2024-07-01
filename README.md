# Exercise Tracker

This is the Exercise Tracker project, part of the FreeCodeCamp (FCC) curriculum. This project is designed to help me learn how to create a microservice that can track user exercises, including logging exercise details and retrieving logs.

## Overview

In this project, I built a microservice that allows users to create a user profile, log exercises, and retrieve a log of all exercises performed by a user within a given timeframe. This project was a great way to learn about RESTful API design, working with databases, and handling user input in a Node.js environment.

## Project Link

Instructions for building the project can be found at [FreeCodeCamp - Exercise Tracker](https://www.freecodecamp.org/learn/apis-and-microservices/apis-and-microservices-projects/exercise-tracker)

## What I Learned

Through this project, I learned how to:

- Set up a Node.js and Express server.
- Design and implement RESTful API endpoints.
- Handle user input and validation.
- Work with a database to store and retrieve data.
- Manage user profiles and log exercises.
- Implement query parameters to filter and sort exercise logs.

## Endpoints

- `POST /api/users`
  - Creates a new user profile.

- `POST /api/users/:_id/exercises`
  - Logs an exercise for a specific user.

- `GET /api/users/:_id/logs`
  - Retrieves a log of all exercises performed by a specific user.


### Technology Stack
- JavaScript:
- Node.js: 
- Express.js: a web framework for Node.js.
- MongoDB: A NoSQL database for storing user/exercise data.
- Mongoose: ODM library for MongoDB and Node.js.
- 
