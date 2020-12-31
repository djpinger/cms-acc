# cms-acc
CMS ACC Tools

## [Race Results Parser](./race-results-parser)

**Description** Takes in the raw race result files from each race of the season, combines results, and returns a JSON representation of the data.

 These instructions were tested on Linux and Mac.  Changes for Windows should be minimal.

1. Install [Docker](https://www.docker.com/get-started) if you haven't already.
2. Make sure you have the latest version of docker and docker-compose installed. (You will have this if you just installed)
3. Ensure the data folder exists in the root of the `race-results-parser` directory structure.  This will get mounted into the container.
4. Run `docker-compose build`
5. Run `docker-compose up`.  Because it does not run a daemon, you will get all log output to your terminal/console.  There is no need to run this in the background with -d.
6. Run `docker-compose rm` to clean up exited containers (optional).

### References 

[https://www.acc-wiki.info/wiki/Server_Configuration#ID_Lists](https://www.acc-wiki.info/wiki/Server_Configuration#ID_Lists)