API URL: https://zipper-test-backend.herokuapp.com/

To use protected endpoints use the following request header
Authorization: Bearer {JWT_TOKEN}

## login user

POST /signin
BODY:

```JSON
{"email": "test@gmail.com", "password": "1234"}
```

RESPONSE:

```JSON
{"status":200,"data":{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZTVlNDQ1YWU3MTc5YTE3ZTIxMmIyNDIiLCJpYXQiOjE1ODMyMzYzNTMsImV4cCI6MTU4NTgyODM1M30.vrc1C1FLwtJM4cHRzEMYvZuznLqrYncma9t85OlPr9I"}}.
```

## create user

POST /signup
BODY:

```JSON
{"email":"test@gmail.com","password":"1234", "repeatPassword": 1234}
```

## get products(authentication required)

GET /products?limit=50&offset=0

for pagination use `limit` and `offset` query params
default values:
limit: 12
offset: 0

RESPONSE:

```JSON
{
    "status": 200,
    "data": {
        "count": TOTAL_NUMBER_OF_PRODUCTS,
        "rows": [
            {
                "id": 2,
                "title": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
                "description": "Sagittis ultrices dignissim penatibus integer interdum. Nulla diam, at nisl risus. Id nulla fames purus volutpat lobortis nunc, nunc.",
                "imageUrl": "https://i.imgur.com/ITDru9F.png",
                "createdAt": "2020-12-01T18:16:12.586Z",
                "updatedAt": "2020-12-01T18:16:12.586Z"
            }
        ]
    }
}
```

**Error messages will look like this.**

```JSON
{"status":400,"message":"This is an error message"}
```
