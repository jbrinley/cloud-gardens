# Cloud Gardens: plant your projects in the cloud, help them grow

There are a few key tenets for growing projects and the infrastructure to support them:

1. The infrastructure running any given project, be it your local development or production, should be identical and disposable, immutable
2. Every project and developer should be willing to adopt some practices around Continuous Integration and Deployment:
    * Some set of automated tests should be a part of every project
    * Developers should have a way to run local builds and tests prior to committing work to the common repo
    * Commits should be small and happen frequently
    * Project commits should trigger builds, testing, and other tasks relevant to the project on an integration server

# Creating a Project

Should require a single step
What it should do:
1. Create new repo from square one
2. Create environment resources:
    - dev and staging installs
    - connection to integration services for running tests, building, etc.
    - allow any given project to customize how tests are run, how the project is built, and provisioning of system dependencies such as third-party resources (hosted elasticsearch, RDS, etc)

# Architecture

* Project source:
    * Get rid of submodules, use dependency management with composer/similar instead (maybe a script to help convert existing projects?), what about base docker images too?
    * implement common testing strategy
    * frontend build strategy integration
    * cache prefixes or strategy around preventing cache conflict so that projects can share a redis or memcached instance
    * common branching strategy
    * for any persistent files on a local server, come up with a good strategy for getting those to a different place like s3, related possible use of s3 plugin with projects moving forward
* Rely on third party services whenever possible, these services should have APIs and be reasonably easy to migrate away from in the future
    * Datadog for monitoring
    * Blackfire for profiling?
    * AWS services, cloudwatch

# How to be a Groundskeeper

A Groundskeeper oversees the creation and maintenance of cloud gardens.  It's pretty easy to do as long as you have access to a AWS or DigitalOcean account where you'd like the garden to live.

Some requirements:
1. Node/npm installed

Then run `node . help` to see the available commands.

If you'd like to use your own configuration for building and maintaining, feel free to make your own file in the `/config` directory (config is loaded with the [npm config package](https://www.npmjs.com/package/config) and can inherit from the `default.js` config already there).  You just need to set the `NODE_ENV` variable to what you named your config file, something like:

```
NODE_ENV=myenvironment node . plant mygarden
```