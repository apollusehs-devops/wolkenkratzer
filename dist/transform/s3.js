

'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.





S3BucketTransform = S3BucketTransform;var _service = require('../service');const s3Service = (0, _service.Service)('S3');function S3BucketTransform(
bucketName,
logicalName,
awsObj)
{
  const s3Client = new awsObj.S3();
  return new Promise((resolve, reject) => {
    //let bucket = new s3Resource.Bucket(newName);
    const bucket = {};
    return (
      s3Client.
      getBucketVersioning({ Bucket: bucketName }).
      promise().
      then(versionData => {
        if (Object.keys(versionData)) {
          bucket.VersioningConfiguration = versionData;
        }
        // return s3Client.getBucketAcl({ Bucket: bucketName }).promise()
        return s3Client.getBucketCors({ Bucket: bucketName }).promise();
      })
      /* .then(function (aclData) {
         console.log('2')
         console.log(JSON.stringify(aclData))
         bucket.AccessControl = aclData
         })*/.
      then(corsData => {
        console.log('cors');
        bucket.CorsConfiguration = corsData;
        return s3Client.
        getBucketLifecycleConfiguration({ Bucket: bucketName }).
        promise();
      }).
      catch(e => {
        // Silently catch the NoSuchCORSConfiguration
        return s3Client.
        getBucketLifecycleConfiguration({ Bucket: bucketName }).
        promise();
      }).
      then(lifeData => {
        console.log('life');
        bucket.LifecycleConfiguration = lifeData;
        return s3Client.getBucketLogging({ Bucket: bucketName }).promise();
      }).
      catch(e => {
        // Silently catch the NoSuchLifecycleConfiguration
        return s3Client.getBucketLogging({ Bucket: bucketName }).promise();
      }).
      then(loggingData => {
        bucket.LoggingConfiguration = {
          DestinationBucketName: loggingData.LoggingEnabled.TargetBucket,
          LogFilePrefix: loggingData.LoggingEnabled.TargetPrefix };

        return s3Client.
        getBucketNotification({ Bucket: bucketName }).
        promise();
      }).
      then(notificationData => {
        if (Object.keys(notificationData).length > 0) {
          bucket.NotificationConfiguration = notificationData;
        }
        return s3Client.
        getBucketReplication({ Bucket: bucketName }).
        promise();
      }).
      then(replData => {
        bucket.ReplicationConfiguration = replData;
        return s3Client.getBucketTagging({ Bucket: bucketName }).promise();
      }).
      then(tagsData => {
        tagsData.TagSet.forEach(tag => {
          bucket.Tags.add(tag);
        });
        return s3Client.getBucketWebsite({ Bucket: bucketName }).promise();
      }).
      catch(e => {
        // Silently catch the NoSuchTagSet
        return s3Client.getBucketWebsite({ Bucket: bucketName }).promise();
      }).
      then(websiteData => {
        bucket.WebsiteConfiguration = new websiteData();
      }).
      catch(e => {
        // Silently catch the NoSuchWebsiteConfiguration
        return;
      }).
      then(() => {
        resolve(s3Service.Bucket(logicalName, bucket));
      }).
      catch(e => {
        // Silently catch the NoSuchWebsiteConfiguration
        reject(e);
      }));

  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFuc2Zvcm0vczMuanMiXSwibmFtZXMiOlsiUzNCdWNrZXRUcmFuc2Zvcm0iLCJzM1NlcnZpY2UiLCJidWNrZXROYW1lIiwibG9naWNhbE5hbWUiLCJhd3NPYmoiLCJzM0NsaWVudCIsIlMzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJidWNrZXQiLCJnZXRCdWNrZXRWZXJzaW9uaW5nIiwiQnVja2V0IiwicHJvbWlzZSIsInRoZW4iLCJ2ZXJzaW9uRGF0YSIsIk9iamVjdCIsImtleXMiLCJWZXJzaW9uaW5nQ29uZmlndXJhdGlvbiIsImdldEJ1Y2tldENvcnMiLCJjb3JzRGF0YSIsImNvbnNvbGUiLCJsb2ciLCJDb3JzQ29uZmlndXJhdGlvbiIsImdldEJ1Y2tldExpZmVjeWNsZUNvbmZpZ3VyYXRpb24iLCJjYXRjaCIsImUiLCJsaWZlRGF0YSIsIkxpZmVjeWNsZUNvbmZpZ3VyYXRpb24iLCJnZXRCdWNrZXRMb2dnaW5nIiwibG9nZ2luZ0RhdGEiLCJMb2dnaW5nQ29uZmlndXJhdGlvbiIsIkRlc3RpbmF0aW9uQnVja2V0TmFtZSIsIkxvZ2dpbmdFbmFibGVkIiwiVGFyZ2V0QnVja2V0IiwiTG9nRmlsZVByZWZpeCIsIlRhcmdldFByZWZpeCIsImdldEJ1Y2tldE5vdGlmaWNhdGlvbiIsIm5vdGlmaWNhdGlvbkRhdGEiLCJsZW5ndGgiLCJOb3RpZmljYXRpb25Db25maWd1cmF0aW9uIiwiZ2V0QnVja2V0UmVwbGljYXRpb24iLCJyZXBsRGF0YSIsIlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbiIsImdldEJ1Y2tldFRhZ2dpbmciLCJ0YWdzRGF0YSIsIlRhZ1NldCIsImZvckVhY2giLCJ0YWciLCJUYWdzIiwiYWRkIiwiZ2V0QnVja2V0V2Vic2l0ZSIsIndlYnNpdGVEYXRhIiwiV2Vic2l0ZUNvbmZpZ3VyYXRpb24iXSwibWFwcGluZ3MiOiI7O0FBRUEsYTs7Ozs7O0FBTWdCQSxpQixHQUFBQSxpQixDQUpoQixxQ0FFQSxNQUFNQyxZQUFpQixzQkFBUSxJQUFSLENBQXZCLENBRU8sU0FBU0QsaUJBQVQ7QUFDTEUsVUFESztBQUVMQyxXQUZLO0FBR0xDLE1BSEs7QUFJTDtBQUNBLFFBQU1DLFdBQVcsSUFBSUQsT0FBT0UsRUFBWCxFQUFqQjtBQUNBLFNBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QztBQUNBLFVBQU1DLFNBQWMsRUFBcEI7QUFDQTtBQUNFTDtBQUNHTSx5QkFESCxDQUN1QixFQUFFQyxRQUFRVixVQUFWLEVBRHZCO0FBRUdXLGFBRkg7QUFHR0MsVUFISCxDQUdRQyxlQUFlO0FBQ25CLFlBQUlDLE9BQU9DLElBQVAsQ0FBWUYsV0FBWixDQUFKLEVBQThCO0FBQzVCTCxpQkFBT1EsdUJBQVAsR0FBaUNILFdBQWpDO0FBQ0Q7QUFDRDtBQUNBLGVBQU9WLFNBQVNjLGFBQVQsQ0FBdUIsRUFBRVAsUUFBUVYsVUFBVixFQUF2QixFQUErQ1csT0FBL0MsRUFBUDtBQUNELE9BVEg7QUFVRTs7OzthQVZGO0FBZUdDLFVBZkgsQ0FlUU0sWUFBWTtBQUNoQkMsZ0JBQVFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0FaLGVBQU9hLGlCQUFQLEdBQTJCSCxRQUEzQjtBQUNBLGVBQU9mO0FBQ0ptQix1Q0FESSxDQUM0QixFQUFFWixRQUFRVixVQUFWLEVBRDVCO0FBRUpXLGVBRkksRUFBUDtBQUdELE9BckJIO0FBc0JHWSxXQXRCSCxDQXNCU0MsS0FBSztBQUNWO0FBQ0EsZUFBT3JCO0FBQ0ptQix1Q0FESSxDQUM0QixFQUFFWixRQUFRVixVQUFWLEVBRDVCO0FBRUpXLGVBRkksRUFBUDtBQUdELE9BM0JIO0FBNEJHQyxVQTVCSCxDQTRCUWEsWUFBWTtBQUNoQk4sZ0JBQVFDLEdBQVIsQ0FBWSxNQUFaO0FBQ0FaLGVBQU9rQixzQkFBUCxHQUFnQ0QsUUFBaEM7QUFDQSxlQUFPdEIsU0FBU3dCLGdCQUFULENBQTBCLEVBQUVqQixRQUFRVixVQUFWLEVBQTFCLEVBQWtEVyxPQUFsRCxFQUFQO0FBQ0QsT0FoQ0g7QUFpQ0dZLFdBakNILENBaUNTQyxLQUFLO0FBQ1Y7QUFDQSxlQUFPckIsU0FBU3dCLGdCQUFULENBQTBCLEVBQUVqQixRQUFRVixVQUFWLEVBQTFCLEVBQWtEVyxPQUFsRCxFQUFQO0FBQ0QsT0FwQ0g7QUFxQ0dDLFVBckNILENBcUNRZ0IsZUFBZTtBQUNuQnBCLGVBQU9xQixvQkFBUCxHQUE4QjtBQUM1QkMsaUNBQXVCRixZQUFZRyxjQUFaLENBQTJCQyxZQUR0QjtBQUU1QkMseUJBQWVMLFlBQVlHLGNBQVosQ0FBMkJHLFlBRmQsRUFBOUI7O0FBSUEsZUFBTy9CO0FBQ0pnQyw2QkFESSxDQUNrQixFQUFFekIsUUFBUVYsVUFBVixFQURsQjtBQUVKVyxlQUZJLEVBQVA7QUFHRCxPQTdDSDtBQThDR0MsVUE5Q0gsQ0E4Q1F3QixvQkFBb0I7QUFDeEIsWUFBSXRCLE9BQU9DLElBQVAsQ0FBWXFCLGdCQUFaLEVBQThCQyxNQUE5QixHQUF1QyxDQUEzQyxFQUE4QztBQUM1QzdCLGlCQUFPOEIseUJBQVAsR0FBbUNGLGdCQUFuQztBQUNEO0FBQ0QsZUFBT2pDO0FBQ0pvQyw0QkFESSxDQUNpQixFQUFFN0IsUUFBUVYsVUFBVixFQURqQjtBQUVKVyxlQUZJLEVBQVA7QUFHRCxPQXJESDtBQXNER0MsVUF0REgsQ0FzRFE0QixZQUFZO0FBQ2hCaEMsZUFBT2lDLHdCQUFQLEdBQWtDRCxRQUFsQztBQUNBLGVBQU9yQyxTQUFTdUMsZ0JBQVQsQ0FBMEIsRUFBRWhDLFFBQVFWLFVBQVYsRUFBMUIsRUFBa0RXLE9BQWxELEVBQVA7QUFDRCxPQXpESDtBQTBER0MsVUExREgsQ0EwRFErQixZQUFZO0FBQ2hCQSxpQkFBU0MsTUFBVCxDQUFnQkMsT0FBaEIsQ0FBeUJDLEdBQUQsSUFBYztBQUNwQ3RDLGlCQUFPdUMsSUFBUCxDQUFZQyxHQUFaLENBQWdCRixHQUFoQjtBQUNELFNBRkQ7QUFHQSxlQUFPM0MsU0FBUzhDLGdCQUFULENBQTBCLEVBQUV2QyxRQUFRVixVQUFWLEVBQTFCLEVBQWtEVyxPQUFsRCxFQUFQO0FBQ0QsT0EvREg7QUFnRUdZLFdBaEVILENBZ0VTQyxLQUFLO0FBQ1Y7QUFDQSxlQUFPckIsU0FBUzhDLGdCQUFULENBQTBCLEVBQUV2QyxRQUFRVixVQUFWLEVBQTFCLEVBQWtEVyxPQUFsRCxFQUFQO0FBQ0QsT0FuRUg7QUFvRUdDLFVBcEVILENBb0VRc0MsZUFBZTtBQUNuQjFDLGVBQU8yQyxvQkFBUCxHQUE4QixJQUFJRCxXQUFKLEVBQTlCO0FBQ0QsT0F0RUg7QUF1RUczQixXQXZFSCxDQXVFU0MsS0FBSztBQUNWO0FBQ0E7QUFDRCxPQTFFSDtBQTJFR1osVUEzRUgsQ0EyRVEsTUFBTTtBQUNWTixnQkFBUVAsVUFBVVcsTUFBVixDQUFpQlQsV0FBakIsRUFBOEJPLE1BQTlCLENBQVI7QUFDRCxPQTdFSDtBQThFR2UsV0E5RUgsQ0E4RVNDLEtBQUs7QUFDVjtBQUNBakIsZUFBT2lCLENBQVA7QUFDRCxPQWpGSCxDQURGOztBQW9GRCxHQXZGTSxDQUFQO0FBd0ZEIiwiZmlsZSI6InMzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgeyBTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZSc7XG5cbmNvbnN0IHMzU2VydmljZTogYW55ID0gU2VydmljZSgnUzMnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIFMzQnVja2V0VHJhbnNmb3JtKFxuICBidWNrZXROYW1lOiBzdHJpbmcsXG4gIGxvZ2ljYWxOYW1lOiBzdHJpbmcsXG4gIGF3c09iajogYW55XG4pIHtcbiAgY29uc3QgczNDbGllbnQgPSBuZXcgYXdzT2JqLlMzKCk7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgLy9sZXQgYnVja2V0ID0gbmV3IHMzUmVzb3VyY2UuQnVja2V0KG5ld05hbWUpO1xuICAgIGNvbnN0IGJ1Y2tldDogYW55ID0ge307XG4gICAgcmV0dXJuIChcbiAgICAgIHMzQ2xpZW50XG4gICAgICAgIC5nZXRCdWNrZXRWZXJzaW9uaW5nKHsgQnVja2V0OiBidWNrZXROYW1lIH0pXG4gICAgICAgIC5wcm9taXNlKClcbiAgICAgICAgLnRoZW4odmVyc2lvbkRhdGEgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh2ZXJzaW9uRGF0YSkpIHtcbiAgICAgICAgICAgIGJ1Y2tldC5WZXJzaW9uaW5nQ29uZmlndXJhdGlvbiA9IHZlcnNpb25EYXRhO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyByZXR1cm4gczNDbGllbnQuZ2V0QnVja2V0QWNsKHsgQnVja2V0OiBidWNrZXROYW1lIH0pLnByb21pc2UoKVxuICAgICAgICAgIHJldHVybiBzM0NsaWVudC5nZXRCdWNrZXRDb3JzKHsgQnVja2V0OiBidWNrZXROYW1lIH0pLnByb21pc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLyogLnRoZW4oZnVuY3Rpb24gKGFjbERhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKCcyJylcbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGFjbERhdGEpKVxuICAgICAgYnVja2V0LkFjY2Vzc0NvbnRyb2wgPSBhY2xEYXRhXG4gICAgfSkqL1xuICAgICAgICAudGhlbihjb3JzRGF0YSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2NvcnMnKTtcbiAgICAgICAgICBidWNrZXQuQ29yc0NvbmZpZ3VyYXRpb24gPSBjb3JzRGF0YTtcbiAgICAgICAgICByZXR1cm4gczNDbGllbnRcbiAgICAgICAgICAgIC5nZXRCdWNrZXRMaWZlY3ljbGVDb25maWd1cmF0aW9uKHsgQnVja2V0OiBidWNrZXROYW1lIH0pXG4gICAgICAgICAgICAucHJvbWlzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgLy8gU2lsZW50bHkgY2F0Y2ggdGhlIE5vU3VjaENPUlNDb25maWd1cmF0aW9uXG4gICAgICAgICAgcmV0dXJuIHMzQ2xpZW50XG4gICAgICAgICAgICAuZ2V0QnVja2V0TGlmZWN5Y2xlQ29uZmlndXJhdGlvbih7IEJ1Y2tldDogYnVja2V0TmFtZSB9KVxuICAgICAgICAgICAgLnByb21pc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4obGlmZURhdGEgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdsaWZlJyk7XG4gICAgICAgICAgYnVja2V0LkxpZmVjeWNsZUNvbmZpZ3VyYXRpb24gPSBsaWZlRGF0YTtcbiAgICAgICAgICByZXR1cm4gczNDbGllbnQuZ2V0QnVja2V0TG9nZ2luZyh7IEJ1Y2tldDogYnVja2V0TmFtZSB9KS5wcm9taXNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAvLyBTaWxlbnRseSBjYXRjaCB0aGUgTm9TdWNoTGlmZWN5Y2xlQ29uZmlndXJhdGlvblxuICAgICAgICAgIHJldHVybiBzM0NsaWVudC5nZXRCdWNrZXRMb2dnaW5nKHsgQnVja2V0OiBidWNrZXROYW1lIH0pLnByb21pc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4obG9nZ2luZ0RhdGEgPT4ge1xuICAgICAgICAgIGJ1Y2tldC5Mb2dnaW5nQ29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgICAgIERlc3RpbmF0aW9uQnVja2V0TmFtZTogbG9nZ2luZ0RhdGEuTG9nZ2luZ0VuYWJsZWQuVGFyZ2V0QnVja2V0LFxuICAgICAgICAgICAgTG9nRmlsZVByZWZpeDogbG9nZ2luZ0RhdGEuTG9nZ2luZ0VuYWJsZWQuVGFyZ2V0UHJlZml4XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gczNDbGllbnRcbiAgICAgICAgICAgIC5nZXRCdWNrZXROb3RpZmljYXRpb24oeyBCdWNrZXQ6IGJ1Y2tldE5hbWUgfSlcbiAgICAgICAgICAgIC5wcm9taXNlKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKG5vdGlmaWNhdGlvbkRhdGEgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhub3RpZmljYXRpb25EYXRhKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBidWNrZXQuTm90aWZpY2F0aW9uQ29uZmlndXJhdGlvbiA9IG5vdGlmaWNhdGlvbkRhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzM0NsaWVudFxuICAgICAgICAgICAgLmdldEJ1Y2tldFJlcGxpY2F0aW9uKHsgQnVja2V0OiBidWNrZXROYW1lIH0pXG4gICAgICAgICAgICAucHJvbWlzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXBsRGF0YSA9PiB7XG4gICAgICAgICAgYnVja2V0LlJlcGxpY2F0aW9uQ29uZmlndXJhdGlvbiA9IHJlcGxEYXRhO1xuICAgICAgICAgIHJldHVybiBzM0NsaWVudC5nZXRCdWNrZXRUYWdnaW5nKHsgQnVja2V0OiBidWNrZXROYW1lIH0pLnByb21pc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4odGFnc0RhdGEgPT4ge1xuICAgICAgICAgIHRhZ3NEYXRhLlRhZ1NldC5mb3JFYWNoKCh0YWc6IGFueSkgPT4ge1xuICAgICAgICAgICAgYnVja2V0LlRhZ3MuYWRkKHRhZyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIHMzQ2xpZW50LmdldEJ1Y2tldFdlYnNpdGUoeyBCdWNrZXQ6IGJ1Y2tldE5hbWUgfSkucHJvbWlzZSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgLy8gU2lsZW50bHkgY2F0Y2ggdGhlIE5vU3VjaFRhZ1NldFxuICAgICAgICAgIHJldHVybiBzM0NsaWVudC5nZXRCdWNrZXRXZWJzaXRlKHsgQnVja2V0OiBidWNrZXROYW1lIH0pLnByb21pc2UoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4od2Vic2l0ZURhdGEgPT4ge1xuICAgICAgICAgIGJ1Y2tldC5XZWJzaXRlQ29uZmlndXJhdGlvbiA9IG5ldyB3ZWJzaXRlRGF0YSgpO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZSA9PiB7XG4gICAgICAgICAgLy8gU2lsZW50bHkgY2F0Y2ggdGhlIE5vU3VjaFdlYnNpdGVDb25maWd1cmF0aW9uXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZShzM1NlcnZpY2UuQnVja2V0KGxvZ2ljYWxOYW1lLCBidWNrZXQpKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgIC8vIFNpbGVudGx5IGNhdGNoIHRoZSBOb1N1Y2hXZWJzaXRlQ29uZmlndXJhdGlvblxuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfSlcbiAgICApO1xuICB9KTtcbn1cbiJdfQ==