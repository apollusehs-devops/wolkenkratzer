'use strict'

const WKResource = require('./../resource').WKResource
const ResourceAttribute = require('./../resourceattribute').ResourceAttribute
const ResourceAttributeArray = require('./../resourceattribute').ResourceAttributeArray
const tag = require('./../tag')
const types = require('./../types')

/** @module EFS */

/** @memberof module:EFS
*   @extends WKResource
* @property {AmazonElasticFileSystemFileSystemFileSystemTags} FileSystemTags Required: No. Tags to associate with the file system.Update requires: No interruption
* @property {String} PerformanceMode Required: No. The performance mode of the file system. For valid values, see the PerformanceMode parameter for the CreateFileSystem action in the Amazon Elastic File System User Guide.For more information about performance modes, see Amazon EFS Performance in the Amazon Elastic File System User Guide.Update requires: Replacement
*/
class FileSystem extends WKResource {
  constructor (name, propertiesObject) {
    let resourceType = 'AWS::EFS::FileSystem'
    let properties = {
      FileSystemTags: new ResourceAttribute('FileSystemTags', types.AmazonElasticFileSystemFileSystemFileSystemTags, 'No', null),
      PerformanceMode: new ResourceAttribute('PerformanceMode', String, 'No', null)
    }
    super(name, resourceType, properties, propertiesObject)
  }
}

/** @memberof module:EFS
*   @extends WKResource
* @property {String} FileSystemId Required: Yes. The ID of the file system for which you want to create the mount target.Update requires: Replacement. Before updating this property, stop
                  EC2 instances that are using this mount target, and then
                  restart them after the update is complete. This allows the instances to unmount
                  the file system before the mount target is replaced. If you don't stop and restart
                  them, instances or applications that are using those mounts might be disrupted
                  when the mount target is deleted (uncommitted writes might be lost).
* @property {String} IpAddress Required: No. An IPv4 address that is within the address range of the subnet that is
                  specified in the SubnetId property. If you don't specify an IP
                  address, Amazon EFS automatically assigns an address that is within the range of the
                  subnet.Update requires: Replacement. Before updating this property, stop EC2 instances that
                  are using this mount target, and then restart them after the update is complete.
                  This allows the instances to unmount the file system before the mount target is
                  replaced. If you don't stop and restart them, instances or applications that are
                  using those mounts might be disrupted when the mount target is deleted
                  (uncommitted writes might be lost).
* @property {String} SecurityGroups Required: Yes. A maximum of five VPC security group IDs that are in the same VPC as the subnet
                  that is specified in the SubnetId property. For more information
                  about security groups and mount targets, see Security in the
                     Amazon Elastic File System User Guide.Update requires: No interruption
* @property {String} SubnetId Required: Yes. The ID of the subnet in which you want to add the mount target.NoteFor each file system, you can create only one mount target per Availability
                     Zone (AZ). All EC2 instances in an AZ share a single mount target for a file
                     system. If you create multiple mount targets for a single file system, do not
                     specify a subnet that is an AZ that already has a mount target associated with
                     the same file system.Update requires: Replacement. Before updating this property, stop EC2 instances that
                  are using this mount target and then restart them after the update is complete.
                  That way the instances can unmount the file system before the mount target is
                  replaced. If you don't stop and restart them, instances or applications that are
                  using those mounts might be disrupted when the mount target is deleted
                  (uncommitted writes might be lost).
*/
class MountTarget extends WKResource {
  constructor (name, propertiesObject) {
    let resourceType = 'AWS::EFS::MountTarget'
    let properties = {
      FileSystemId: new ResourceAttribute('FileSystemId', String, 'Yes', null),
      IpAddress: new ResourceAttribute('IpAddress', String, 'No', null),
      SecurityGroups: new ResourceAttributeArray('SecurityGroups', String, 'Yes', null),
      SubnetId: new ResourceAttribute('SubnetId', String, 'Yes', null)
    }
    super(name, resourceType, properties, propertiesObject)
  }
}

module.exports = {  FileSystem: FileSystem,
  MountTarget: MountTarget
}
