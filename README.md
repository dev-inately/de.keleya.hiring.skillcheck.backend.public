# Keleya Skill-Check

## Backend

The task here is to finish the provided 'barebone' backend by implementing all endpoints and required functionality, and setting up the database following these requirements. The goal of this 'project' is to end up with a working REST API with CRUD endpoints for a simple user management, paired with authorization and authentication methods.

For the backend we are using two modern frameworks, [NestJS](https://docs.nestjs.com/) and [Prisma](https://www.prisma.io/docs/getting-started) running on Node 14. To make the database setup as simple as possible, we will use a SQlite DB. One part of this task will thus be, to familiarize yourself with the technology stack.

The repository as provided throws NotImplementedException() for the missing functions, as well as misses the data structures and database.

### Types

Data is being transferred between functions using Data Transfer Objects. This need to be implemented in accordance with the data model. Optionally, data validation should be implemented as well to assure that valid data is being sent into the application.

### Database

The database should follow this schema:
![backend schema](backend_schema.png)

Command lines:

- `npx prisma migrate dev` for migration
- `npx prisma db seed` for seeding

### Endpoints

- GET /user should query for users with these optional filtering parameters:
  - `limit` Limit the number of results returned
  - `offset` Skip the first n results
  - `updatedSince` Return only items which were updated since Date.
  - `id` An Array of id(s) to limit the query to
  - `name` a LIKE search for names
  - `credentials` include the related credentials in result
  - `email` search for matching email
- GET /user/:id should return one specific user with that id
- (public) POST /user should create a new user with credentials
- PATCH /user should update a user if it exists and should update credentials if they exist IF the user has not been deleted previously
- DELETE /user marks the user as deleted and also removes related credentials rows, but does NOT remove the user row itself
- (public) POST /user/authenticate authenticates the user with an email/password combination and returns a boolean
- (public) POST /user/token authenticates the user with an email/password combination and returns a JWT token
- (public) POST /user/validate validates a Bearer token sent via authorization header and returns a boolean

### Security

- Endpoints marked (public) should allow access without authorization
- Endpoints **not** marked (public) should check JWT tokens and map to users
- Health Check endpoints should be public and no JWT should be required
- Non-public endpoints called by Admin users should allow requests to modify all users, while regular users should locked into their own user - they are only allowed to work on their own user id
- Passwords need to be hashed and salted

### Testing

- If possible, unit tests should check the functionality of the various endpoints and services
- Alternatively, discuss why certain tests were not implemented, necessary or useful, or suggest a test environment

### Extra

- Discuss improvements to the data models or endpoints
- Feel free to suggest other solutions to implement similar projects (but for this skill check, do use the given tech stack as provided here)

### How to do the skill check

- Fork this repository
- Make modifications as you see fit
- Add all your notes into this readme
- Send us the link to your fork
- Tell us how long it took you to get the repository to the state you sent us - remember: it's ok to take time if it's done properly.
- Import Hiring Backend Test.postman_collection.json into the latest Postman client and run the collection tests. Depending on how you seed your database, some tests may need to be adjusted for ids. Please take a screenshot of the results like this one:
- ![postman_tests.png](postman_tests.png)
- Send us this screenshot as well as the export of your postman tests.
- the following should run without errors:
```
yarn
npx prisma migrate reset
yarn test
```
### Your Notes Below Here
Here are some modifications that were done on my part 

- I added a `deleted_at` field which shows if a record has been deleted or not. Futhermore, I also implemented it in a way such that deleted records are not fetched when they are being queried except a query `?show_deleted=true` is passed for the admin. 
- I added test to the `user.service.ts` and `user.controller.ts` (`a code that's not tested is broken by default - Bruce Eckel`). I didn't add e2e test because that's essentially what the Postman test also does. In real life situation however, I would definitely write e2e test which would have a seperate environment setup as that will also provide an insight on how the code really reacts in real life scenarios.
- I added documentation to the API (I always do!). I'm a die-hard [redoc](https://github.com/Redocly/redoc) fan but I also added Swagger UI too. These can be accessed via `/api-docs` for Redoc and `/docs` for Swagger.
- I modified the `/authenticate` response a bit, so instead of returning `credentials: true`, which might be a bit confusing, I returned `is_authenticated: true` which is less ambiguous.
- I made a generic error format. They will always return `status`, `error` and `message`. So, in order not to expose too much error or stacktraces to user, I truncated some error object/array and returned the string as a message. Ideally, full error stacks are meant to be logged externally (which is why I added a `trace_id` to the error object which would be like the key on our logging server).
- I added the _is_admin_ status to the token 
- I prevented the fields `email_confirmed` and `is_admin` from being created or updated. This fields are updated based on conditions (for example, email_confirmed will only be changed after a successful verification process)

Here are some observations
- Prisma naming convention for the `models` is camelCase but the database layout shows `snake_case`. We can use `@map` to rename that but I didn't do it, for clarity. (the in-app comment, mentions it in snake_case but I later found out that the test checks for camelCase but I adjusted that to expect snake_case).
- Responses can be made uniform such as having an IResponse class which will describe all types of response. I tend to follow [JSend](https://github.com/omniti-labs/jsend) when I can, but applying it here will be too much of a change.
... 
