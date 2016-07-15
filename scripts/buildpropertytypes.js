/**
 * Created by arming on 6/26/16.
 */
'use strict'

const BPromise = require('bluebird')
const fs = BPromise.promisifyAll(require('fs-extra'))

fs
  .readJsonAsync('./properties.json')
  .then((file) => {
    let result = ''
    result += '\'use strict\'\n\n'
    result += 'const ResourceProperty = require(\'./resource\').ResourceProperty\n'
    result += 'const ResourceAttributeArray = require(\'./resourceattribute\').ResourceAttributeArray\n'
    result += 'const ResourceAttribute = require(\'./resourceattribute\').ResourceAttribute\n\n'
    result += '/** @module Types' + ' */\n\n'

    let exportList = []

    for (let subType in file) {
      let subProp = file[subType]
      console.log(subProp)
      exportList.push(subType + ': ' + subType)
      let docHeader = ''
      docHeader += '/**\n'
      let body = ''
      body += 'class ' + subProp.name + ' extends ResourceProperty {\n'
      body += '  constructor (propertiesObject) {\n'
      body += '    let properties = {\n'
      let props = Object.keys(subProp.properties)
      for (let i = 0; i < props.length; i++) {
        let wkType = 'ResourceAttribute'
        let propType = subProp.properties[ props[ i ] ].Type
        if (Array.isArray(propType)) {
          wkType = 'ResourceAttributeArray'
          propType = propType[0]
        }
        if (typeof propType === 'string') {
          propType = propType.replace(/\./g, '')
          if (propType.includes('JSON')) {
            propType = 'Object'
          }
        }
        switch (propType) {
          case 'Integer':
            propType = 'Number'
            break
          case 'AutoScalingEBSBlockDevice':
            propType = 'AWSCloudFormationAutoScalingEBSBlockDevicePropertyType'
            break
          case 'CacheBehavior':
            propType = 'CloudFrontDistributionConfigCacheBehavior'
            break
          case 'DefaultCacheBehaviortype':
            propType = 'CloudFrontDefaultCacheBehavior'
            break
          case 'Loggingtype':
            propType = 'CloudFrontLogging'
            break
          case 'Origins':
            propType = 'CloudFrontDistributionConfigOrigin'
            break
          case 'ForwardedValuestype':
            propType = 'CloudFrontForwardedValues'
            break
          case 'CustomOrigintype':
            propType = 'CloudFrontDistributionConfigOriginCustomOrigin'
            break
          case 'S3Origintype':
            propType = 'CloudFrontDistributionConfigOriginS3Origin'
            break
          case 'anemptymap:{}':
            propType = 'Map'
            break
          case 'PrivateIpAddressSpecification':
            propType = 'EC2NetworkInterfacePrivateIPSpecification'
            break
          case 'Key-valuepairs,withthenameofthelabelasthekeyandthelabelvalueasthevalue':
            propType = 'Map'
            break
          case 'Key-valuepairs,withtheoptionnameasthekeyandtheoptionvalueasthevalue':
            propType = 'Map'
            break
          case 'String-to-stringmap':
            propType = 'Map'
            break
          case 'Stringtostringmap':
            propType = 'Map'
            break
          default:
            break
        }
        let name = props[i].replace(/ \(.+\)/g, '')
        body += '      ' + name + ': new ' + wkType + '(\'' + name + '\', ' + propType + ', \'' + subProp.properties[ props[ i ] ].Required + '\', null)'
        if (i === (props.length - 1)) {
          body += '\n'
        } else {
          body += ',\n'
        }

        docHeader += '* @property ' + name + ' {' + propType + '} Required: ' + subProp.properties[ props[ i ] ].Required + '.'
          if (subProp.properties[ props[ i ] ].Description) {
            docHeader += ' ' + subProp.properties[ props[ i ] ].Description.replace(/\n/g, ' ').trim() + '\n'
          } else {
            docHeader += '\n'
          }
      }
      body += '    }\n'
      body += '    super(\''+ subProp.name + '\', properties, propertiesObject)\n'
      body += '  }\n'
      body += '}\n\n'

      docHeader += '*/\n'
      result += docHeader
      result += body
    }

    result += 'module.exports = {\n'
    for (let i = 0; i < exportList.length; i++) {
      let ending = ',\n'
      if (i === (exportList.length - 1)) {
        ending = '\n'
      }
      result += '  ' + exportList[i] + ending
    }
    result += '}\n'
    console.log('result:')
    console.log(result)
    return result
  })
  .then((result) => {
    return fs.writeFileAsync('../types.js', result)
  })
  .then(() => {
    console.log('Finished writing file.')
  })