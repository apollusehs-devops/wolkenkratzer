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

describe('SNS', () => {
  let t = new wk.Template()

  let Topic = new wk.SNS.Topic('Topic')
  t.add(Topic)

  let TopicPolicy = new wk.SNS.TopicPolicy('TopicPolicy')

  it('should be able to add an SNS Topic to the template', () => {
    t.Resources['Topic'].WKResourceType.should.equal('AWS::SNS::Topic')
  })

  it ('CloudFormation should validate the template NetworkTest', (done) => {
    util.validateTemplate(t, done)
  })
})
