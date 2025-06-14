## Notes API Typescript And Express

A complete, secure, and efficient API built with TypeScript, Express, and MongoDB as the database, featuring protected routes and implementing jsWebToken for user and session authentication.

### EndPoints

1. `/api/signup`

```js
// method POST
// status code 201
{
    "message": "New User Created!"
}
```

2. `/api/login`

```js
// method POST
{
    "message": "User Authenticated Correctly"
}
// created cookie access_token and cookie name
```

3. `/api/notes`

```js
//user's note list
// method GET
//example
[
  {
    title: "Example1234",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt.....",
    tags: ["Videogames", "Entertainment"],
    important: false,
  },
  {
    title: "Note 123123 example",
    content: "I like typescript and express",
    tags: [],
    important: true,
  },
]
  //optional title parameter to filter notes by title
  //example
  // /api/notes?title=game
[
  {
    title: "Videogames",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt.....",
    tags: ["Videogames", "Entertainment"],
    important: false,
  }
];
```

4. `/api/notes`

```ts
// create note of user
// method POST
// Entry in body:
{
    "title": string,
    "content": string,
    "tags": string[],
    "important": boolean
    //required cookie access_token
}
```

5. `/api/notes/:id`

```js
// method GET
//returns the note that matches the specified id only if it belongs to the authenticated user
//example
{
  "_id": "683ddd811d0df34817887e78",
  "title": "Mangas que me gustan",
  "content": "Vagabond, Berserk, Viland Saga",
  "tags": [
    "Lectura",
    "Entretenimiento"
  ],
  "important": false,
  "userID": "(id of user)",
}
```

6. `/api/notes/:id`

```js
// method DELETE
//Delete the note that matches the specified id only if it belongs to the authenticated user
{
    "message": "Deleted"
    //required cookie access_token
}
```

7. `/api/notes/:id`

```js
// method PUT
//update the note that matches the specified id only if it belongs to the authenticated user
{
    //new note
    "title": "Example1234",
    "content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt.....",
    "tags": ["Videogames", "Entertainment"],
    "important":false
    //required cookie access_token
}
```

8. `/api/notes/tags`

```js
// method GET
//Returns the notes that match any of the tags passed as parameters.
//example /api/notes/tags/?tags=Videogames
[
  {
    title: "Example1234",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt.....",
    tags: ["Videogames", "Entertainment"],
    important: false,
  },
  {
    title: "Note 45 example",
    content: "I like the videogames",
    tags: ["Videogames"],
    important: true,
  },
];
//required cookie access_token
```

9. `/api/notes/get-tags`

```js
//method: get
//returns an array with all unique tags from the authenticated user's notes
["Videogames", "Entertainment", "Studies"];
```

10. `/api/logout`

```js
//delete client cookies access_token and name
//method: delete
{
  message: "User Logged Out";
}
```
