# GoBarber Web

<p align="center">
  <img src="resources/logo.svg" alt="logo" />
</p>

This is the repository for the GoBarber web application.
If you don't know what GoBarber is please have a look [here](https://github.com/jeffersoncechinel/gobarber).

Its purpose is to consume the API and provide the barber with visibility of past and next client's appointments.

You may also want to see the [GoBarber API repository](https://github.com/jeffersoncechinel/gobarber-api)  
You may also want to see the [GoBarber Mobile repository](https://github.com/jeffersoncechinel/gobarber-mobile)

![Data Flow](resources/gobarber-web.png?raw=true "Data Flow")

The application is written in ReactJS + Styled Components based on Typescript.

Features
----
 - Animated switch SignUp and SignIn pages for barbers.
 - Form input validations with visual alerts.
 - Toast messages for success and error operations.
 - List past and future scheduled appointments for the logged user.
 - Next appointment is placed on top.
 - Appointment list split by morning and afternoon.
 - Calendar automatically filters for disabled and past dates.
 - User profile can be updated including its avatar image and password.
 - User data and authentication token stored in browser storage.

Requirements
----
* [NodeJS](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)

Let's get started
----
:exclamation: Before you begin make sure you have the [GoBarber API](https://github.com/jeffersoncechinel/gobarber-api) up and running.

```
# clone the repository
git clone https://github.com/jeffersoncechinel/gobarber-web.git

# access the repository folder
cd gobarber-web

# install dependencies
yarn install

# start the web application
yarn start
```

You may now access http://127.0.0.1:3000/

License
----

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
