/**
 * Created by arming on 6/5/16.
 */

/* global describe it */
'use strict'

const path = require('path')
const chai = require('chai')
chai.config.truncateThreshold = 0
chai.should()
var should = require('chai').should()

const wk = require(path.join(__dirname, '..', '..', 'index'))
const util = require('../util')

describe('Route53', () => {
  let t = new wk.Template()

  let AmazonRoute53HealthCheckConfig = new wk.Types.AmazonRoute53HealthCheckConfig()
  AmazonRoute53HealthCheckConfig.Type = 'HTTP'

  let HealthCheck = new wk.Route53.HealthCheck('HealthCheck')
  HealthCheck.HealthCheckConfig = AmazonRoute53HealthCheckConfig
  t.add(HealthCheck)

  let HostedZone = new wk.Route53.HostedZone('HostedZone')
  let RecordSet = new wk.Route53.RecordSet('RecordSet')
  let RecordSetGroup = new wk.Route53.RecordSetGroup('RecordSetGroup')


  it('should be able to add an Route53 HealthCheck to the template', () => {
    t.Resources['HealthCheck'].WKResourceType.should.equal('AWS::Route53::HealthCheck')
  })

  it ('CloudFormation should validate the template NetworkTest', (done) => {
    util.validateTemplate(t, done)
  })
})
