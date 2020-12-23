const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    const eventBody = event.Records[0].s3;
    const key = eventBody.object.key;
    const results = getEventResult(eventBody);
    console.info(`EVENT INFO: ${results.trackName} ${results.sessionType}`)
    console.info(`SERVER INFO: ${results.serverName}`)

    //now we have to do the actual work, need to figure out where the file is from (quali server or event)
    //directory structure I'm assuming as of now: data/season/x and data/quali

    //will error handle this array size stuff later, for now it's predictable
    const directory = key.split('/')[1];
    if(directory === 'quali') {
        //then we're in driver rating land, talk to doug on what addtl files he needs
    } else if (directory === 'season' && !isConfigFile(key.split('/')[3])) {
        //then we're in race season land, need to get split and do additional parsing stuff
        const season = key.split('/')[2];
        //getting split will have to come from file title, this is a wild guess on what that looks like
        const split = results.serverName.substring(1,2);
        //so we have the season, the split, what else do we need to call stuff?
        //probably just going to want to construct a whole object and ship it
    }
    return context.logStreamName
}

function isConfigFile(fileName) {
    return !fileName.toLowerCase().contains('config');
}

function getEventResult(eventBody) {
    console.debug("EVENT: \n" + JSON.stringify(event, null, 2))
    const resultsFile = await s3.getObject({
        Bucket: eventBody.bucket.name,
        Key: eventBody.object.key
    }).promise();
    return JSON.parse(resultsFile.Body.toString().replace(/[\u0000-\u0019]+/g,""));
}

