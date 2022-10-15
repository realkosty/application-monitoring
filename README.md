# Application Monitoring
Also called the Empower Plant UI/UX. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Features the following...
- Error Monitoring...Performance Monitoring...Release Health...
- BrowserTracing (Performance)  
- Sentry.Profiler (class components)  
- Sentry.withSentryRouting(Route); (react-router)  
- FlaskIntegration, SqlAlchemyIntegration

| sentry    | version
| ------------- |:-------------:|
| @sentry/react | 6.16.1 |
| @sentry/tracing | 6.16.1 |
| sentry_sdk | 1.5.1 |
| @sentry/node | 6.16.1 |
| sentry-spring-boot-starter | 5.5.1 |
| sentry-logback | 5.5.1 |

## Setup
1. Permit your IP address in CloudSQL.
2. Create a react/.env and enter your DSN. See .env.example for an example.
3. Create a flask/.env and enter your DSN. See .env.example for an example. Ask a colleague for the values.
4. The `FLASK_BACKEND` in `react/.env` represents Flask in AppEngine, this is used when you access the prod React web app. Flask is the default backend. If you expect to run other backend types, add values for those in `react/.env` as well (i.e. `EXPRESS_BACKEND`).

```
# React
cd react
npm install

# Flask
cd flask
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

## Run
```
cd react
cd flask
```

```
# Pick one of two ways to run the React app:

# 1) Run React app w/ sourcemaps, suspect commits
# Recommended to use this command rather than `npm start`, as
# run.sh uploads source maps and handles crashes more
# realistically.
./run.sh

# 2) Run React app w/ hot reload
# NOTE: this will cause crashing errors to be tagged
#   in sentry as handled (`handled: true`)
npm start

# Run the Flask app
source env/bin/activate
./run.sh
```

Add +2 quantity of a single item to Cart and purchase in order to trigger an Error. Visit the routes defined in src/index.js to produce transactions.


## Deploy to Prod
This script deploys the flagship apps React + Flask. For deploying a single app to App Engine, check each platform's README for specific instructions. Make sure all .env's and app.yaml's have correct values before deploying.
```
./deploy.sh
```
You can put all 4 apps in deploy.sh for deployment, but that's 4 apps you could be taking down at once, which other people are relying on. With great power, comes great responsibility.  

Run `gcloud auth login` if it asks you to authenticate, or insert YubiKey.  

## Deploy to Staging
Update the app engine service name in the following places:  
```
// required
react/app.yaml to staging-application-monitoring-javascript  
react/.env to staging-application-monitoring-express, -flask, -springboot
flask/app.yaml to staging-application-monitoring-flask 
express/app.yaml to staging-application-monitoring-node
spring-boot/src/main/appengine/app.yaml to staging-springboot

// optional
react/.env REACT_APP_FLASK_BACKEND with updated URL
flask/.env FLASK_APP_DSN with updated DSN
springboot/src/main/resources/application.properties with updated DSN
deploy.sh's SENTRY_PROJECT with updated value
```
Then run deploy.sh for deploying the flagship app (React to Flask) together, or deploy only the individual apps that you need (check the README for each platform). 

## Updating The Apps
```
## Check if you're on your fork. If so, you should see:
git remote -v
origin	git@github.com:<your_handle>/application-monitoring.git (fetch)
origin	git@github.com:<your_handle>/application-monitoring.git (push)
upstream	git@github.com:sentry-demos/application-monitoring.git (fetch)
upstream	git@github.com:sentry-demos/application-monitoring.git (push)

# If you don't have an upstream
git remote add upstream git@github.com:sentry-demos/application-monitoring.git

# Make sure you're on master
git checkout master

# get updates from the upstream
git fetch upstream master
git merge upstream/master

# merge those updates into your current branch, if it's behind
git checkout yourbranch
git merge master

# update sentry_sdk's and other modules
cd react && rm -rf node_modules && npm install
cd flask && source env/bin/activate && pip install -r requirements.txt

# Check that your react/.env, flask/.env and deploy.sh still have correct values
```

## Troubleshooting
See [troubleshooting](./troubleshooting.md)

## Gcloud
```
gcloud app versions list
gcloud app deploy
gcloud app browse
gcloud app services list
gcloud app logs tail -s application-monitoring-react
gcloud app logs tail -s application-monitoring-flask
gcloud --help
gcloud topic configurations
gcloud auth
gcloud auth application-default
gcloud auth login
gcloud auth list
gcloud config set account `ACCOUNT`
gcloud config list, to display current account
```
`gcloud app deploy` does not support `--update-env-vars RELEASE=$RELEASE` like `gcloud run deploy` does with Cloud Run

## Versions

| non-sentry    | version
| ------------- |:-------------:|
| npx | 7.8.0 |
| npm | 7.8.0 |
| node | v.14.2.0 |
| python | 3 |
| react | ^17.0.2 |
| react-dom | ^17.0.2 |
| react-router-dom | ^5.2.0 |
| react-scripts | 4.0.3 |

