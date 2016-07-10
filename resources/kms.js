'use strict'

const WKResource = require('./../resource').WKResource
const ResourceAttribute = require('./../resourceattribute').ResourceAttribute
const ResourceAttributeArray = require('./../resourceattribute').ResourceAttributeArray
const tag = require('./../tag')
const types = require('./../types')

/** @module KMS */

/** @memberof module:KMS
*   @extends WKResource
* @property {String} Description Required: No. A description of the key. Use a description that helps your users decide
                  whether the key is appropriate for a particular task.Update requires: No interruption
* @property {Boolean} Enabled Required: No. Indicates whether the key is available for use. AWS CloudFormation sets this value to
              true by default.Update requires: No interruption
* @property {Boolean} EnableKeyRotation Required: No. Indicates whether AWS KMS rotates the key. AWS CloudFormation sets this value to
                     false by default.Update requires: No interruption
* @property {Object} KeyPolicy Required: Yes. An AWS Identity and Access Management (IAM) policy to attach to the key. Use a policy to specify who
                  has permission to use the key and which actions they can perform. For more
                  information, see Key Policies
                  in the AWS Key Management Service Developer Guide.Update requires: No interruption
*/
class Key extends WKResource {
  constructor (name, propertiesObject) {
    let resourceType = 'AWS::KMS::Key'
    let properties = {
      Description: new ResourceAttribute('Description', String, 'No', null),
      Enabled: new ResourceAttribute('Enabled', Boolean, 'No', null),
      EnableKeyRotation: new ResourceAttribute('EnableKeyRotation', Boolean, 'No', null),
      KeyPolicy: new ResourceAttribute('KeyPolicy', Object, 'Yes', null)
    }
    super(name, resourceType, properties, propertiesObject)
  }
}

module.exports = {  Key: Key
}
