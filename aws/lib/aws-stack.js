const cdk = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');
const s3n = require('@aws-cdk/aws-s3-notifications');

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
  }
}

module.exports = { AwsStack }
