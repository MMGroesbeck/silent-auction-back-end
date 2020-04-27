# endpoints

## /api/users
- POST /api/users/register
- - Requires username: string, email: string, password: string, role:string = "bidder" or "seller"
- - Returns {user, JSON web token as "token"}
- - Each email can only be associated with one "bidder" and one "seller"; will return error if user of specified role already has provided email.
- POST /api/users/login
- - Requires {user, JSON web token as "token"}
- - On successful login, returns token as "token", success message as "message".
- - If unable to validate username/password combo, returns status 401.

## /api/auctions
- GET /api/auctions
- - Returns array of all auctions.
- GET /api/auctions/:id
- - Returns auction with id = :id
- GET /api/auctions/seller
- - REQUIRES TOKEN
- - Returns array of auctions where logged-in user is seller
- GET /api/auctions/:id/bids
- - REQUIRES TOKEN
- - Returns array of bids (no username) for auction with id = :id only if logged-in user is seller.

## /api/bidders
- GET /api/bidders/:id
- - REQUIRES TOKEN
- - :id = user id for user being searched
- - Returns limited info (username, role) if logged-in user is not user being searched; more info (email) if logged-in user is user being searched
- GET /api/bidders/:id/bids
- - REQUIRES TOKEN
- - Returns list of bids for logged-in bidder with user id = :id
- POST /api/bidders/:id/bids
- - REQUIRES TOKEN
- - POST request requires auction_id and bid_amount
- - Bid is accepted only if bid_amount is higher than the current high bid for the auction with id auction_id
- - Returns status 201 with accepted bid, status 400 if new bid is too low.

## /api/watching
- GET /api/watching
- - REQUIRES TOKEN
- - Returns list of auction ids that the logged-in user has added to watchlist
- POST /api/watching/:id
- - REQUIRES TOKEN
- - Adds auction where id = :id to the watchlist of logged-in user
- DELETE /api/watching/:id
- - REQUIRES TOKEN
- - Removes auction where id = :id from the watchlist of the logged-in user

# data schema
- users:
- - { id: integer, username: string, email: string, role: string = "bidder" or "seller" }
- auctions:
- - { id: integer, name: string, description: string, user_id: integer = user id of seller, image_url: string, start-datetime: timestamp, end-datetime: timestamp }
- bids:
- - { id: integer, user_id: integer = id of bidder, auction_id: integer = id of auction, bid_amount: decimal, bid_time: timestamp }
- watching:
- - { id: integer, user: integer = id of user, auction: integer = id of auction }