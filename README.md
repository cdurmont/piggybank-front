# Piggybank (front-end)

This is the front-end part of Piggybank, a simple personal accounting app based on double-entry bookkeeping.
Piggybank is currently tailored to my needs, but feel free to use it and contribute !

## Piggybank Quick start

Want to try out Piggybank ? All you need is :
* a working Docker environment
* The docker-compose.yaml file at the root of this project's sources
* Run `docker-compose up -d` in the directory containing the docker-compose.yaml file

This will start 4 containers:
* a mongodb server on port 27017 (SECURITY WARNING ! root password for mongodb hardcoded in the docker-compose.yaml !)
* a mongo-express instance on port 8081
* Piggybank backend on port 3000
* Piggybank frontend on port 4000

Navigate to `http://localhost:4000/` to access Piggybank. Upon install, log in with any 
login/password, this wille create the first user and set it as admin.



## front-end Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
