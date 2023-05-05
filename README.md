# Backend
- [x] Get basic api route working
- [x] Get .env file working
- [x] Init git repo
- [x] Route planning
    auth
    POST(auth/login)
    - return jwt
    POST(auth/register)
    - POST(auth/register/:verificationID)

    journals (all headers contain jwt)
    GET(/journals/year/:year)
    - Get all journal IDs in a year
    GET(/journals/recents)
    - Get recent journals and their data
    GET(/journals/:ID)
    - Get journal data using a journalID
    POST(/journals)
    - body: text
    - Make a new journal entry

- [x] Mongo refresh
- [x] Local Mongo (Atlas should be easy to switch to)
- [x] Make dummy app which has basic mongo operations to test DO deploy
- [x] Publish app on digital ocean as a test
- [x] Make dummy user data (Non hashed passwords, etc)
- [x] Make utils for current day index
- [x] Implement all routes other than auth
- [ ] Auth
- [ ] Auth middleware
- [ ] Redo routes to fit auth
- [ ] Start encrypting data
- [ ] Sanitize inputs

# Front end
- [x] Figma layout
- [ ] Random message in writing box as a prompt

# Other
- [ ] Buy domain
- [x] Look into host (Heroku, digital ocean)


# Table design

users:
    - username
    - hashed password
    - journalIDs
        [
            {
                year: 2023
                ids: { key: index of day in overall year, value is journal ID
                    123: id
                    98: id
                }
            },
            {
                year: 2024
                ids: { key: index of day in overall year, value is journal ID
                    123: id
                    98: id
                } 
            }
        ]
    - email

journals:
    - id
    - date
    - text