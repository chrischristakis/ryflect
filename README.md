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
- [x] Auth
- [x] Auth middleware
- [x] Redo routes to fit auth
- [x] Set up config env file
- [x] Sanitize inputs

# Front end
- [x] Figma layout
- [ ] Add a 'loaded' property for journalIDs, since checking if empty isn't reliable
        - New users have empty journalIDs, so website woudln't work for them if we check using isEmpty
- [ ] Basic layout pages (No styling)
- [ ] Get notifications working for errors
- [ ] Show bad input front-end (Before submitting)
    - Specific errors for specific routes isnt a bad idea for this
- [ ] Proper loading
- [ ] Start encrypting data
- [ ] Look into cookies
- [ ] Random message in writing box as a prompt
    - Maybe put tips here

# Other
- [ ] Buy domain
- [x] Look into host (Heroku, digital ocean)
- [ ] Highlight one quote in your entry that pops up when you hover it in the timeline
- [ ] Start looking into https


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