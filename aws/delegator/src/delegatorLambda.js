const AWS = require('aws-sdk');

const s3 = new AWS.S3();

exports.handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))
    const eventBody = event.Records[0].s3
    const bucketName = eventBody.bucket.name;
    const fileName = eventBody.object.key;
    const resultsFile = await s3.getObject({
        Bucket: bucketName,
        Key: fileName
    }).promise();
    const results = JSON.parse(resultsFile.Body.toString().replace(/[\u0000-\u0019]+/g,""));
    console.log(JSON.stringify(results));
    return context.logStreamName
}