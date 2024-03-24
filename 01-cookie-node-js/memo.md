# requirements

- switch mode
  - login to home
  - switch to rove with no pin code validation
  - switch to home need pin code validation
- switch users
  - In several browsers, same login user, different active users
    - data have to be in browser
  - have to be secure
    - use jwt to avoid user change login status data
    - verify jwt for security. only server can grant valid jwt, so secure.

# page ejs setup

https://enlyt.co.jp/blog/node-js-2/

# cookie

- just set key - value
- generated in server
- browser unique
- data type is string

# session

- session id in cookie
- saved in server memory (or storage could be redis or db)
- can save multiple values

# jwt

- used for security
- only server side can validate jwt and fetch data
