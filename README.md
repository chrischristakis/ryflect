# Backend
- [x] Get basic api route working
- [x] Get .env file working
- [x] Init git repo
- [x] Route planning
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
- [x] Set up CRON jobs for deleting old unactivated users and old verification entries (Can do both in one job)
- [ ] Change routes to account for encryption

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
- [x] Add user bar in navbar, support logout, change password, FAQ
- [x] Fix registration and login forms to use custom hooks
    - Both handle errored fields the same way, try to streamline this so code is less bulky.
- [ ] Make sure if one cookie is missing, we force use to login again and reset cookies by logging them out
- [ ] Start encrypting data, or do markdown
- [ ] Handle errors on each page
    - For example, on verify email, decide what to do if verfication has expired. What do we display?
- [ ] Do not let user go to create journal page if journal already exists, grey out button.
    - If they try to click it, give them a notif telling them they can only journal once a day, and the reset time.
- [ ] Proper loading (Animation?)
- [ ] Get markdown working
    - Should be on the fly, display what the markdown would look like as the user types
- [ ] Change password functionality
- [ ] QOL for typing (Make enter not submit the entire form when making a new entry)
- [ ] Buttons for markdown
    - Bold, italics, list, tab,  
- [ ] Random message in writing box as a prompt
- [ ] Make sure user knows they cannot recover password upon registration
    - Display a pop up or something
- [ ] Change TEST_EMAIL in registration route to the user's actual email

# Other
- [ ] Buy domain
- [x] Look into host (Heroku, digital ocean)
- [ ] Start looking into https
- [ ] Add time capsule feature


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