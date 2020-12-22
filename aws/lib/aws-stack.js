const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const s3n = require('@aws-cdk/aws-s3-notifications');
const lambda = require('@aws-cdk/aws-lambda');
const path = require('path');
const { LambdaDestination } = require('@aws-cdk/aws-s3-notifications');

class AwsStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    /**
     * Things we need:
     * 1. file storage ( a bucket) with specific directory structure
     * 2. some lambdas for processing results and doing stuff with them. These need to be
     *    kicked off somehow. probably with events, possibly something else.
     *    turns out we can just event out to lambda using s3n. AWESOME
     * 3. possibly a couple of databases for storing this stuff between lambdas,
     *    but this could also just be stateless as everything is generated from results
     * 4. a place to put json and/or csv outputs, probably the same s3 bucket (or not, loops can be bad).
     *    Again could also end up in a db. dynamo is "free" forever, probably our starting candidate if
     *    need one. That being said stateless may be better for now
     */
    // may be worth having a lambda that just ingests s3 put events and then delegates, probably eaiser
    //for the collab code stuff as we can mess with input formats and make results prettier

    //bucket to hold results files, populated manually with our agreed upon 'directory' structure 
    //(s3 is technically flat and just uses naming to create the illusion of directories)
    const resultsBucket = new s3.Bucket(this, `${id}-results-bucket`, {
      blockPublicAccess: {
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true
      },
      bucketName: 'cms-results-file-bucket',
      publicReadAccess: false
    });

    //lambda to ingest new files and kick off the proper processing lambdas
    //basically driver rating always and champ points as needed
    const delegatorLambda = new lambda.Function(this, `${id}-delegator-lambda`, {
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'delegator', 'src')),
      handler: 'delegatorLambda.handler',
      runtime: lambda.Runtime.NODEJS_12_X
    });

    //this glues our bucket to the delegator and gives it read access. New files kick off the function
    const delegatorNotification = resultsBucket
      .addEventNotification(s3.EventType.OBJECT_CREATED, new LambdaDestination(delegatorLambda));
    const delegatorGrant = resultsBucket.grantRead(delegatorLambda);

  }
}

module.exports = { AwsStack }
