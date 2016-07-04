/**
 * Created by arming on 6/15/16.
 */
'use strict'
const debug = require('debug')('baseawsobject')
const RequiredPropertyException = require('./exceptions').RequiredPropertyException
const ConditionNotMetException = require('./exceptions').ConditionNotMetException
const TypeException = require('./exceptions').TypeException
const Policy = require('./policy').Policy

class BaseAWSObject {
  constructor (name, resourceType, properties, propertiesObject, conditional) {
    this.Name = name
    this.resourceType = resourceType
    this.properties = properties
    this.conditional = conditional
    for (let prop in this.properties) {
      Object.defineProperty(this, prop, {
        set: (value) => {
          this.properties[prop].set(value)
        },
        get: () => {
          return this.properties[prop]
        }
      })
    }
    if (propertiesObject) {
      for (let prop in propertiesObject) {
        this.properties[prop] = propertiesObject[prop]
      }
    }
  }
  dependsOn (resource) {
    this.dependsOn = resource
  }
  addConfig (config) {
    if(this instanceof require('./resources/ec2').Instance) {
      if(!this.Metadata) {
        this.Metadata = {
        }
      }
      if(!this.Metadata['AWS::CloudFormation::Init']) {
        this.Metadata['AWS::CloudFormation::Init'] = {
          configSets: {}
        }
      }
      this.Metadata['AWS::CloudFormation::Init'][config.Name] = config
    } else {
      throw new TypeException('Not allowed to add ' + config + 'to ' + this.Name + ' because it is not an Instance or LaunchConfiguration')
    }
  }
  addConfigSet (configSet) {
    if(this instanceof require('./resources/ec2').Instance) {
      if(!this.Metadata) {
        this.Metadata = {
        }
      }
      if(!this.Metadata['AWS::CloudFormation::Init']) {
        this.Metadata['AWS::CloudFormation::Init'] = {
          configSets: {}
        }
      }
      this.Metadata['AWS::CloudFormation::Init'].configSets[configSet.Name] = configSet.configs
    } else {
      throw new TypeException('Not allowed to add ' + configSet + 'to ' + this.Name + ' because it is not an Instance or LaunchConfiguration')
    }
  }
  addPolicy (policy) {
    if(!this.policies) {
      this.policies = {}
    }
    if(policy instanceof Policy) {
      this.policies[policy.Name] = policy
    } else {
      throw new TypeException(policy + ' must be of type Policy')
    }
  }
  toJson () {
    debug('Generating Resource json')
    let newProperties = JSON.parse(JSON.stringify(this.properties))
    for (let prop in newProperties) {
      try {
        newProperties[prop] = this.properties[prop].toJson()
      } catch (e) {
        if (e instanceof RequiredPropertyException) {
          throw new RequiredPropertyException(this.Name + '.' + prop + ' is required but not defined.')
        }
      }
    }
    if(this.conditional) {
      try {
        this.conditional(this.properties)
      } catch (e) {
        if (e instanceof ConditionNotMetException) {
          throw new ConditionNotMetException(this.Name + ' has a condition that was not met: ' + e.message)
        }
      }
    }
    let newMetadata = {}
    if(this.Metadata) {
      if(this.Metadata['AWS::CloudFormation::Init']) {
        newMetadata['AWS::CloudFormation::Init'] = {}
        for (let config in this.Metadata['AWS::CloudFormation::Init']) {
          if(config === 'configSets') {
            newMetadata['AWS::CloudFormation::Init'][config] = this.Metadata['AWS::CloudFormation::Init'][config]
          } else {
            newMetadata['AWS::CloudFormation::Init'][config] = this.Metadata['AWS::CloudFormation::Init'][config].toJson()
          }
        }
      }
    }
    let returnObject = {
      Type: this.resourceType,
      Properties: newProperties,
    }
    if(this.Metadata) {
      returnObject.Metadata = newMetadata
    }
    if(this.policies) {
      for(let policy in this.policies) {
        returnObject[policy] = this.policies[policy].toJson()
      }
    }
    if (this.dependsOn) {
      returnObject.DependsOn = this.dependsOn.Name
    }
    return returnObject
  }
}

class SubPropertyObject {
  constructor (properties, propertiesObject, conditional) {
    this.properties = properties
    this.conditional = conditional
    for (let prop in this.properties) {
      Object.defineProperty(this, prop, {
        set: (value) => {
          this.properties[prop].set(value)
        },
        get: () => {
          return this.properties[prop]
        }
      })
    }
    if (propertiesObject) {
      for (let prop in propertiesObject) {
        this.properties[prop] = propertiesObject[prop]
      }
    }
  }
  toJson() {
    debug('Generating Resource json')
    let newProperties = JSON.parse(JSON.stringify(this.properties))
    for (let prop in newProperties) {
      try {
        newProperties[prop] = this.properties[prop].toJson()
      } catch (e) {
        if (e instanceof RequiredPropertyException) {
          throw new RequiredPropertyException(this.Name + '.' + prop + ' is required but not defined.')
        }
      }
    }
    if(this.conditional) {
      try {
        this.conditional(this.properties)
      } catch (e) {
        if (e instanceof ConditionNotMetException) {
          throw new ConditionNotMetException(this.Name + ' has a condition that was not met: ' + e.message)
        }
      }
    }
    return newProperties
  }
}

module.exports = {
  BaseAWSObject: BaseAWSObject,
  SubPropertyObject: SubPropertyObject
}