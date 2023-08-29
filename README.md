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
- [x] Time capsule implementation
- [x] Email users whenever a time capsule is opened.
    - How do we do this efficiently with bulk... make sure each email is sent asynchronously.
- [x] Move username validation (if it exists) into verify middleware instead.
- [x] Consider revamping JournalIDs and CapsuleIDs, since it may bloat the user document.
- [x] Pagination for recents
- [x] Manual rate limit for registration, 5 registrations per ip per day
- [x] NGINX rate limit for all routes, 15r/s
- [x] Bump up expiry date for access token
- [x] Start encrypting data
- [x] Force logout if not authed.
- [x] Decrypt recent entries
- [x] Make rotating server key to encrypt the derived key in cookie
    - Changes once a week on a CRON
- [x] Log user out if server key is outdated and has rotated.
- [x] Change password functionality
- [ ] PBKDF2 for derived key

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
- [x] Make sure if one cookie is missing, we force use to login again and reset cookies by logging them out
- [x] Get markdown working
    - Should be on the fly, display what the markdown would look like as the user types
- [x] save a html journal entry and a plaintext entry with no tags.
- [x] Handle errors on each page
    - For example, on verify email, decide what to do if verfication has expired. What do we display?
- [x] If user plaintext cuts off an escaped character (since plaintext is escaped) we need to handle it appropriately.
- [x] Do not let user go to create journal page if journal already exists, grey out button.
- [x] Proper loading (Animation?)
- [x] Dummy FAQ, Change password pages
- [x] Button loading gif while waiting for a response
- [x] Put in Michelle's gif (Ty Michelle)
- [x] More basic styling...
- [x] Test deploy + feedback
- [x] Only let user go back to the year they started journaling
    - Also add upper bound to how far in the future they can scroll?
- [x] Add carousel for years
    - 'Scroll along the line' and enlarge center year
    - animate it!
- [x] Reconsider how we render the 'create entry' button, since the entire timeline is being rerendered every second. Try to isolate just the button to rerender.
- [x] Pagination for recents (infinite scroll)
- [x] One more production build to test spam emails and other new additions + feedback
- [x] Display time capsules
- [x] Handle viewing normal entry vs time capsule
    - Differentiate between journal and capsule if both exist on one day
- [x] Make creating a time capsule page differentiate from a normal journal entry
    - Same page and use props, or different page?
    - Use Params/query or pass data 
- [x] Timeline overflow bug
    - [x] Fix double shift bug (Maybe use ref or state to shift isntead of using using ref.current.style)
- [x] Text shouldn't overflow if one continuous line on view journal/recents
- [x] Word counter on frontend to match back end.
    - Just stop allowing text when document max size is reached.
    * Decided to just inform user when they're over capacity, and not allow submission.
- [x] Random message in writing box as a prompt
- [x] Make sure user knows they cannot recover password upon registration
    - Display a pop up or something
- [x] Faq
- [x] Footer
- [x] Create time capsule infographic
- [x] Privacy policy
- [x] Website metadata (title, description, etc.)
- [ ] Refresh home after user is deleted and we get a bunch of 'username does not exist'
    - Happens because we dont log user out so were calling our normal routes.
    - Regardless, routes seemed to be called 4 times each. should be once (twice in dev) each.
- [ ] Ping route being called 3 times when refreshing home, check up on this
- [ ] Lazy load video example for capsule
- [ ] Change password page
- [ ] Final production test, high maximum load journal entry test
- [ ] Make SVGs, like capsule, journal, website icon.
- [ ] Styling
    - Consider web/mobile

# Other
- [x] Buy domain
- [x] Look into host (Heroku, digital ocean)
- [x] Start looking into https (certbot)
- [ ] Scripts for running on prod
- [ ] Proper readme!