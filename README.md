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
- [x] Email registration code
- [ ] Set up CRON jobs for deleting old unactivated users and old verification entries (Can do both in one job)

# Front end
- [x] Figma layout
- [x] Basic layout pages (No styling)
- [x] Add a 'loaded' property for journalIDs, since checking if empty isn't reliable
        - New users have empty journalIDs, so website woudln't work for them if we check using isEmpty
        - THIS IS CAUSING RERENDERS OF THE ENTIRE PAGE! WE NEED TO CHECK IF SOMETHING IS LOADED FIRST
            - No need for context, just a loaded property that waits for all api calls on a page to complete before rendering content.
- [x] Snoop around for rerenders to fix
- [x] Cookies
    - Test what happens when user goes to other user's journal after being logged in, should bring them to unauthorized page
- [ ] Look into any better altneratives to pinging user to check if logged in, since error in console.
- [ ] Add user bar in navbar, support logout, change password, FAQ
- [ ] Handle errors on each page
- [ ] Get notifications working for errors
- [ ] Show bad input front-end (Before submitting)
    - Specific errors for specific routes isnt a bad idea for this
- [ ] Proper loading
- [ ] Start encrypting data
- [ ] QOL for typing (Make enter not submit the entire form when making a new entry)
- [ ] Look into cookies
- [ ] Random message in writing box as a prompt
    - Maybe put tips here
- [ ] Make sure user knows they cannot recover password upon registration

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