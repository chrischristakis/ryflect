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
    POST(auth/reset)
    - POST(auth/reset/:verificationID)
        - store id in database as valid for 15 minutes, maybe cron job to poll, idk

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

- [ ] Sanitize inputs

# Front end
- [x] Figma layout
- [ ] Random message in writing box as a prompt

# Other
- [ ] Buy domain
- [x] Look into host (Heroku, digital ocean)
- [ ] Figure out how to display and detect a new year (Maybe hard code a daysInYear function to find out how many days are in a year)
    - Maybe if year doesnt exist in journal IDs, add it then on first journal creation of that year


# Table design

users:
    - username
    - hashed password
    - recentJournals [holds 5 ids at most, FILO]
    - journalIDs
        {
            2022: 
                id_map: {
                    123: {date, id}  <----- 123 is the overall day in the year, calculated on the server
                    98: {date, id}
                }
                days_in_year: 365 <----- filled in once.
            2023: 
                id_map: {
                    3: id
                    21: id 
                }
                days_in_year: 366
        }
    - email

journals:
    - id
    - date
    - text