/**
 * Created by arming on 6/22/16.
 */

const wolkenkratzer = require('../index')
// const ec2 = require('../resources/ec2')

let t = new wolkenkratzer.Template()

let keyNameParam = new wolkenkratzer.Parameter('KeyName', {
  'Type': 'AWS::EC2::KeyPair::KeyName',
  'ConstraintDescription' : 'must be the name of an existing EC2 KeyPair.',
  'Default': 'arminkeypair'
})
t.addParameter(keyNameParam)

let instanceTypeParam = new wolkenkratzer.Parameter('InstanceType', {
  'Description' : 'WebServer EC2 instance type',
  'Type' : 'String',
  'Default' : 't2.large',
  'AllowedValues' : [ 't1.micro', 't2.nano', 't2.micro', 't2.small', 't2.medium', 't2.large', 'm1.small', 'm1.medium', 'm1.large', 'm1.xlarge', 'm2.xlarge', 'm2.2xlarge', 'm2.4xlarge', 'm3.medium', 'm3.large', 'm3.xlarge', 'm3.2xlarge', 'm4.large', 'm4.xlarge', 'm4.2xlarge', 'm4.4xlarge', 'm4.10xlarge', 'c1.medium', 'c1.xlarge', 'c3.large', 'c3.xlarge', 'c3.2xlarge', 'c3.4xlarge', 'c3.8xlarge', 'c4.large', 'c4.xlarge', 'c4.2xlarge', 'c4.4xlarge', 'c4.8xlarge', 'g2.2xlarge', 'g2.8xlarge', 'r3.large', 'r3.xlarge', 'r3.2xlarge', 'r3.4xlarge', 'r3.8xlarge', 'i2.xlarge', 'i2.2xlarge', 'i2.4xlarge', 'i2.8xlarge', 'd2.xlarge', 'd2.2xlarge', 'd2.4xlarge', 'd2.8xlarge', 'hi1.4xlarge', 'hs1.8xlarge', 'cr1.8xlarge', 'cc2.8xlarge', 'cg1.4xlarge'],
  'ConstraintDescription' : 'must be a valid EC2 instance type.'
})
t.addParameter(instanceTypeParam)

let sshLocationParam = new wolkenkratzer.Parameter('SSHLocation', {
  'Description': 'The IP address range that can be used to SSH to the EC2 instances',
  'Type': 'String',
  'MinLength': '9',
  'MaxLength': '18',
  'Default': '0.0.0.0/0',
  'AllowedPattern': '(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})\\.(\\d{1,3})/(\\d{1,2})',
  'ConstraintDescription': 'must be a valid IP CIDR range of the form x.x.x.x/x.'
})
t.addParameter(sshLocationParam)

let webServerCapacityParam = new wolkenkratzer.Parameter('WebServerCapacity', {
  'Default': '1',
  'Description' : 'The initial number of WebServer instances',
  'Type': 'Number',
  'MinValue': '1',
  'MaxValue': '5',
  'ConstraintDescription' : 'must be between 1 and 5 EC2 instances.'
})
t.addParameter(webServerCapacityParam)

let dbNameParam = new wolkenkratzer.Parameter('DBName', {
  'Default': 'wordpressdb',
  'Description' : 'The WordPress database name',
  'Type': 'String',
  'MinLength': '1',
  'MaxLength': '64',
  'AllowedPattern' : '[a-zA-Z][a-zA-Z0-9]*',
  'ConstraintDescription' : 'must begin with a letter and contain only alphanumeric characters.'
})
t.addParameter(dbNameParam)

let dbUserParam = new wolkenkratzer.Parameter('DBUser', {
  'NoEcho': 'true',
  'Description' : 'The WordPress database admin account username',
  'Type': 'String',
  'MinLength': '1',
  'MaxLength': '16',
  'AllowedPattern' : '[a-zA-Z][a-zA-Z0-9]*',
  'ConstraintDescription' : 'must begin with a letter and contain only alphanumeric characters.'
})
t.addParameter(dbUserParam)

let dbPasswordParam = new wolkenkratzer.Parameter('DBPassword', {
  'NoEcho': 'true',
  'Description' : 'The WordPress database admin account password',
  'Type': 'String',
  'MinLength': '8',
  'MaxLength': '41',
  'AllowedPattern' : '[a-zA-Z0-9]*',
  'ConstraintDescription' : 'must contain only alphanumeric characters.'
})
t.addParameter(dbPasswordParam)

let dbRootPasswordParam = new wolkenkratzer.Parameter('DBRootPassword', {
  'NoEcho': 'true',
  'Description' : 'MySQL root password',
  'Type': 'String',
  'MinLength': '8',
  'MaxLength': '41',
  'AllowedPattern' : '[a-zA-Z0-9]*',
  'ConstraintDescription' : 'must contain only alphanumeric characters.'
})
t.addParameter(dbRootPasswordParam)

let webServerSecurityGroup = new wolkenkratzer.EC2.SecurityGroup('WebServerSecurityGroup')
t.addResource(webServerSecurityGroup)
webServerSecurityGroup.GroupDescription = 'Enable HTTP access via port 80 locked down to the load balancer + SSH access'

let rule1 = new wolkenkratzer.Types.EC2SecurityGroupRulePropertyType({'IpProtocol' : 'tcp', 'FromPort' : '80', 'ToPort' : '80', 'CidrIp' : '0.0.0.0/0'})
webServerSecurityGroup.SecurityGroupIngress.push(rule1)

let rule2 = new wolkenkratzer.Types.EC2SecurityGroupRulePropertyType()
rule2.IpProtocol = 'tcp'
rule2.FromPort = 22
rule2.ToPort = 22
rule2.CidrIp.ref(sshLocationParam)
webServerSecurityGroup.SecurityGroupIngress.push(rule2)

// Ubuntu us-east-1 ami-fce3c696

t.addMapping('AWSInstanceType2Arch', {
  't1.micro'    : { 'Arch' : 'PV64'   },
  't2.nano'     : { 'Arch' : 'HVM64'  },
  't2.micro'    : { 'Arch' : 'HVM64'  },
  't2.small'    : { 'Arch' : 'HVM64'  },
  't2.medium'   : { 'Arch' : 'HVM64'  },
  't2.large'    : { 'Arch' : 'HVM64'  },
  'm1.small'    : { 'Arch' : 'PV64'   },
  'm1.medium'   : { 'Arch' : 'PV64'   },
  'm1.large'    : { 'Arch' : 'PV64'   },
  'm1.xlarge'   : { 'Arch' : 'PV64'   },
  'm2.xlarge'   : { 'Arch' : 'PV64'   },
  'm2.2xlarge'  : { 'Arch' : 'PV64'   },
  'm2.4xlarge'  : { 'Arch' : 'PV64'   },
  'm3.medium'   : { 'Arch' : 'HVM64'  },
  'm3.large'    : { 'Arch' : 'HVM64'  },
  'm3.xlarge'   : { 'Arch' : 'HVM64'  },
  'm3.2xlarge'  : { 'Arch' : 'HVM64'  },
  'm4.large'    : { 'Arch' : 'HVM64'  },
  'm4.xlarge'   : { 'Arch' : 'HVM64'  },
  'm4.2xlarge'  : { 'Arch' : 'HVM64'  },
  'm4.4xlarge'  : { 'Arch' : 'HVM64'  },
  'm4.10xlarge' : { 'Arch' : 'HVM64'  },
  'c1.medium'   : { 'Arch' : 'PV64'   },
  'c1.xlarge'   : { 'Arch' : 'PV64'   },
  'c3.large'    : { 'Arch' : 'HVM64'  },
  'c3.xlarge'   : { 'Arch' : 'HVM64'  },
  'c3.2xlarge'  : { 'Arch' : 'HVM64'  },
  'c3.4xlarge'  : { 'Arch' : 'HVM64'  },
  'c3.8xlarge'  : { 'Arch' : 'HVM64'  },
  'c4.large'    : { 'Arch' : 'HVM64'  },
  'c4.xlarge'   : { 'Arch' : 'HVM64'  },
  'c4.2xlarge'  : { 'Arch' : 'HVM64'  },
  'c4.4xlarge'  : { 'Arch' : 'HVM64'  },
  'c4.8xlarge'  : { 'Arch' : 'HVM64'  },
  'g2.2xlarge'  : { 'Arch' : 'HVMG2'  },
  'g2.8xlarge'  : { 'Arch' : 'HVMG2'  },
  'r3.large'    : { 'Arch' : 'HVM64'  },
  'r3.xlarge'   : { 'Arch' : 'HVM64'  },
  'r3.2xlarge'  : { 'Arch' : 'HVM64'  },
  'r3.4xlarge'  : { 'Arch' : 'HVM64'  },
  'r3.8xlarge'  : { 'Arch' : 'HVM64'  },
  'i2.xlarge'   : { 'Arch' : 'HVM64'  },
  'i2.2xlarge'  : { 'Arch' : 'HVM64'  },
  'i2.4xlarge'  : { 'Arch' : 'HVM64'  },
  'i2.8xlarge'  : { 'Arch' : 'HVM64'  },
  'd2.xlarge'   : { 'Arch' : 'HVM64'  },
  'd2.2xlarge'  : { 'Arch' : 'HVM64'  },
  'd2.4xlarge'  : { 'Arch' : 'HVM64'  },
  'd2.8xlarge'  : { 'Arch' : 'HVM64'  },
  'hi1.4xlarge' : { 'Arch' : 'HVM64'  },
  'hs1.8xlarge' : { 'Arch' : 'HVM64'  },
  'cr1.8xlarge' : { 'Arch' : 'HVM64'  },
  'cc2.8xlarge' : { 'Arch' : 'HVM64'  }
})

t.addMapping('AWSInstanceType2NATArch', {
  't1.micro'    : { 'Arch' : 'NATPV64'   },
  't2.nano'     : { 'Arch' : 'NATHVM64'  },
  't2.micro'    : { 'Arch' : 'NATHVM64'  },
  't2.small'    : { 'Arch' : 'NATHVM64'  },
  't2.medium'   : { 'Arch' : 'NATHVM64'  },
  't2.large'    : { 'Arch' : 'NATHVM64'  },
  'm1.small'    : { 'Arch' : 'NATPV64'   },
  'm1.medium'   : { 'Arch' : 'NATPV64'   },
  'm1.large'    : { 'Arch' : 'NATPV64'   },
  'm1.xlarge'   : { 'Arch' : 'NATPV64'   },
  'm2.xlarge'   : { 'Arch' : 'NATPV64'   },
  'm2.2xlarge'  : { 'Arch' : 'NATPV64'   },
  'm2.4xlarge'  : { 'Arch' : 'NATPV64'   },
  'm3.medium'   : { 'Arch' : 'NATHVM64'  },
  'm3.large'    : { 'Arch' : 'NATHVM64'  },
  'm3.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'm3.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'm4.large'    : { 'Arch' : 'NATHVM64'  },
  'm4.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'm4.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'm4.4xlarge'  : { 'Arch' : 'NATHVM64'  },
  'm4.10xlarge' : { 'Arch' : 'NATHVM64'  },
  'c1.medium'   : { 'Arch' : 'NATPV64'   },
  'c1.xlarge'   : { 'Arch' : 'NATPV64'   },
  'c3.large'    : { 'Arch' : 'NATHVM64'  },
  'c3.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'c3.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'c3.4xlarge'  : { 'Arch' : 'NATHVM64'  },
  'c3.8xlarge'  : { 'Arch' : 'NATHVM64'  },
  'c4.large'    : { 'Arch' : 'NATHVM64'  },
  'c4.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'c4.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'c4.4xlarge'  : { 'Arch' : 'NATHVM64'  },
  'c4.8xlarge'  : { 'Arch' : 'NATHVM64'  },
  'g2.2xlarge'  : { 'Arch' : 'NATHVMG2'  },
  'g2.8xlarge'  : { 'Arch' : 'NATHVMG2'  },
  'r3.large'    : { 'Arch' : 'NATHVM64'  },
  'r3.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'r3.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'r3.4xlarge'  : { 'Arch' : 'NATHVM64'  },
  'r3.8xlarge'  : { 'Arch' : 'NATHVM64'  },
  'i2.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'i2.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'i2.4xlarge'  : { 'Arch' : 'NATHVM64'  },
  'i2.8xlarge'  : { 'Arch' : 'NATHVM64'  },
  'd2.xlarge'   : { 'Arch' : 'NATHVM64'  },
  'd2.2xlarge'  : { 'Arch' : 'NATHVM64'  },
  'd2.4xlarge'  : { 'Arch' : 'NATHVM64'  },
  'd2.8xlarge'  : { 'Arch' : 'NATHVM64'  },
  'hi1.4xlarge' : { 'Arch' : 'NATHVM64'  },
  'hs1.8xlarge' : { 'Arch' : 'NATHVM64'  },
  'cr1.8xlarge' : { 'Arch' : 'NATHVM64'  },
  'cc2.8xlarge' : { 'Arch' : 'NATHVM64'  }
})

t.addMapping('AWSRegionArch2AMI', {
  'us-east-1'        : {'PV64' : 'ami-2a69aa47', 'HVM64' : 'ami-6869aa05', 'HVMG2' : 'ami-2e5e9c43'},
  'us-west-2'        : {'PV64' : 'ami-7f77b31f', 'HVM64' : 'ami-7172b611', 'HVMG2' : 'ami-83b770e3'},
  'us-west-1'        : {'PV64' : 'ami-a2490dc2', 'HVM64' : 'ami-31490d51', 'HVMG2' : 'ami-fd76329d'},
  'eu-west-1'        : {'PV64' : 'ami-4cdd453f', 'HVM64' : 'ami-f9dd458a', 'HVMG2' : 'ami-b9bd25ca'},
  'eu-central-1'     : {'PV64' : 'ami-6527cf0a', 'HVM64' : 'ami-ea26ce85', 'HVMG2' : 'ami-7f04ec10'},
  'ap-northeast-1'   : {'PV64' : 'ami-3e42b65f', 'HVM64' : 'ami-374db956', 'HVMG2' : 'ami-e0ee1981'},
  'ap-northeast-2'   : {'PV64' : 'NOT_SUPPORTED', 'HVM64' : 'ami-2b408b45', 'HVMG2' : 'NOT_SUPPORTED'},
  'ap-southeast-1'   : {'PV64' : 'ami-df9e4cbc', 'HVM64' : 'ami-a59b49c6', 'HVMG2' : 'ami-0cb5676f'},
  'ap-southeast-2'   : {'PV64' : 'ami-63351d00', 'HVM64' : 'ami-dc361ebf', 'HVMG2' : 'ami-a71c34c4'},
  'sa-east-1'        : {'PV64' : 'ami-1ad34676', 'HVM64' : 'ami-6dd04501', 'HVMG2' : 'NOT_SUPPORTED'},
  'cn-north-1'       : {'PV64' : 'ami-77559f1a', 'HVM64' : 'ami-8e6aa0e3', 'HVMG2' : 'NOT_SUPPORTED'}
})

let webServer = new wolkenkratzer.EC2.Instance('WebServer')
webServer.ImageId.findInMap('AWSRegionArch2AMI', { 'Ref' : 'AWS::Region' }, { 'Fn::FindInMap' : [ 'AWSInstanceType2Arch', { 'Ref' : 'InstanceType' }, 'Arch' ] })
t.addResource(webServer)

let webSiteUrlOutput = new wolkenkratzer.Output('WebsiteURL', {
  'Value' : { 'Fn::Join' : ['', ['http://', { 'Fn::GetAtt' : [ 'WebServer', 'PublicDnsName' ]}, '/wordpress' ]]},
  'Description' : 'WordPress Website'
})

//console.log(webSiteUrlOutput)
t.addOutput(webSiteUrlOutput)
console.log(t.toJson())

/*

 'Resources' : {


 'WebServer': {
 'Type' : 'AWS::EC2::Instance',
 'Metadata' : {
 'AWS::CloudFormation::Init' : {
 'configSets' : {
 'wordpress_install' : ['install_cfn', 'install_wordpress', 'configure_wordpress' ]
 },
 'install_cfn' : {
 'files': {
 '/etc/cfn/cfn-hup.conf': {
 'content': { 'Fn::Join': [ '', [
 '[main]\n',
 'stack=', { 'Ref': 'AWS::StackId' }, '\n',
 'region=', { 'Ref': 'AWS::Region' }, '\n'
 ]]},
 'mode'  : '000400',
 'owner' : 'root',
 'group' : 'root'
 },
 '/etc/cfn/hooks.d/cfn-auto-reloader.conf': {
 'content': { 'Fn::Join': [ '', [
 '[cfn-auto-reloader-hook]\n',
 'triggers=post.update\n',
 'path=Resources.WebServer.Metadata.AWS::CloudFormation::Init\n',
 'action=/opt/aws/bin/cfn-init -v ',
 '         --stack ', { 'Ref' : 'AWS::StackName' },
 '         --resource WebServer ',
 '         --configsets wordpress_install ',
 '         --region ', { 'Ref' : 'AWS::Region' }, '\n'
 ]]},
 'mode'  : '000400',
 'owner' : 'root',
 'group' : 'root'
 }
 },
 'services' : {
 'sysvinit' : {
 'cfn-hup' : { 'enabled' : 'true', 'ensureRunning' : 'true',
 'files' : ['/etc/cfn/cfn-hup.conf', '/etc/cfn/hooks.d/cfn-auto-reloader.conf'] }
 }
 }
 },

 'install_wordpress' : {
 'packages' : {
 'yum' : {
 'php'          : [],
 'php-mysql'    : [],
 'mysql'        : [],
 'mysql-server' : [],
 'mysql-devel'  : [],
 'mysql-libs'   : [],
 'httpd'        : []
 }
 },
 'sources' : {
 '/var/www/html' : 'http://wordpress.org/latest.tar.gz'
 },
 'files' : {
 '/tmp/setup.mysql' : {
 'content' : { 'Fn::Join' : ['', [
 'CREATE DATABASE ', { 'Ref' : 'DBName' }, ';\n',
 'CREATE USER '', { 'Ref' : 'DBUser' }, ''@'localhost' IDENTIFIED BY '', { 'Ref' : 'DBPassword' }, '';\n',
 'GRANT ALL ON ', { 'Ref' : 'DBName' }, '.* TO '', { 'Ref' : 'DBUser' }, ''@'localhost';\n',
 'FLUSH PRIVILEGES;\n'
 ]]},
 'mode'  : '000400',
 'owner' : 'root',
 'group' : 'root'
 },

 '/tmp/create-wp-config' : {
 'content' : { 'Fn::Join' : [ '', [
 '#!/bin/bash -xe\n',
 'cp /var/www/html/wordpress/wp-config-sample.php /var/www/html/wordpress/wp-config.php\n',
 'sed -i \'s/'database_name_here'/'',{ 'Ref' : 'DBName' }, ''/g\' wp-config.php\n',
 'sed -i \'s/'username_here'/'',{ 'Ref' : 'DBUser' }, ''/g\' wp-config.php\n',
 'sed -i \'s/'password_here'/'',{ 'Ref' : 'DBPassword' }, ''/g\' wp-config.php\n'
 ]]},
 'mode' : '000500',
 'owner' : 'root',
 'group' : 'root'
 }
 },
 'services' : {
 'sysvinit' : {
 'httpd'  : { 'enabled' : 'true', 'ensureRunning' : 'true' },
 'mysqld' : { 'enabled' : 'true', 'ensureRunning' : 'true' }
 }
 }
 },

 'configure_wordpress' : {
 'commands' : {
 '01_set_mysql_root_password' : {
 'command' : { 'Fn::Join' : ['', ['mysqladmin -u root password '', { 'Ref' : 'DBRootPassword' }, ''']]},
 'test' : { 'Fn::Join' : ['', ['$(mysql ', { 'Ref' : 'DBName' }, ' -u root --password='', { 'Ref' : 'DBRootPassword' }, '' >/dev/null 2>&1 </dev/null); (( $? != 0 ))']]}
 },
 '02_create_database' : {
 'command' : { 'Fn::Join' : ['', ['mysql -u root --password='', { 'Ref' : 'DBRootPassword' }, '' < /tmp/setup.mysql']]},
 'test' : { 'Fn::Join' : ['', ['$(mysql ', { 'Ref' : 'DBName' }, ' -u root --password='', { 'Ref' : 'DBRootPassword' }, '' >/dev/null 2>&1 </dev/null); (( $? != 0 ))']]}
 },
 '03_configure_wordpress' : {
 'command' : '/tmp/create-wp-config',
 'cwd' : '/var/www/html/wordpress'
 }
 }
 }
 }
 },
 'Properties': {
 'ImageId' : { 'Fn::FindInMap' : [ 'AWSRegionArch2AMI', { 'Ref' : 'AWS::Region' },
 { 'Fn::FindInMap' : [ 'AWSInstanceType2Arch', { 'Ref' : 'InstanceType' }, 'Arch' ] } ] },
 'InstanceType'   : { 'Ref' : 'InstanceType' },
 'SecurityGroups' : [ {'Ref' : 'WebServerSecurityGroup'} ],
 'KeyName'        : { 'Ref' : 'KeyName' },
 'UserData' : { 'Fn::Base64' : { 'Fn::Join' : ['', [
 '#!/bin/bash -xe\n',
 'yum update -y aws-cfn-bootstrap\n',

 '/opt/aws/bin/cfn-init -v ',
 '         --stack ', { 'Ref' : 'AWS::StackName' },
 '         --resource WebServer ',
 '         --configsets wordpress_install ',
 '         --region ', { 'Ref' : 'AWS::Region' }, '\n',

 '/opt/aws/bin/cfn-signal -e $? ',
 '         --stack ', { 'Ref' : 'AWS::StackName' },
 '         --resource WebServer ',
 '         --region ', { 'Ref' : 'AWS::Region' }, '\n'
 ]]}}
 },
 'CreationPolicy' : {
 'ResourceSignal' : {
 'Timeout' : 'PT15M'
 }
 }
 }
 },


 }
 */