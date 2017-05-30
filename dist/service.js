'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.





Service = Service;var _resource = require('./elements/resource');function Service(name) {
  const json = require(`../stubs/json/${name}.json`);
  const service = { json };
  Object.keys(json.Resources).map(r => {
    service[r] = _resource.Resource.bind({ json, name: r });
  });
  return service;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbIlNlcnZpY2UiLCJuYW1lIiwianNvbiIsInJlcXVpcmUiLCJzZXJ2aWNlIiwiT2JqZWN0Iiwia2V5cyIsIlJlc291cmNlcyIsIm1hcCIsInIiLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFNZ0JBLE8sR0FBQUEsTyxDQUpoQiwrQ0FJTyxTQUFTQSxPQUFULENBQWlCQyxJQUFqQixFQUF5QztBQUM5QyxRQUFNQyxPQUFPQyxRQUFTLGlCQUFnQkYsSUFBSyxPQUE5QixDQUFiO0FBQ0EsUUFBTUcsVUFBZSxFQUFFRixJQUFGLEVBQXJCO0FBQ0FHLFNBQU9DLElBQVAsQ0FBWUosS0FBS0ssU0FBakIsRUFBNEJDLEdBQTVCLENBQWdDQyxLQUFLO0FBQ25DTCxZQUFRSyxDQUFSLElBQWEsbUJBQVNDLElBQVQsQ0FBYyxFQUFFUixJQUFGLEVBQVFELE1BQU1RLENBQWQsRUFBZCxDQUFiO0FBQ0QsR0FGRDtBQUdBLFNBQU9MLE9BQVA7QUFDRCIsImZpbGUiOiJzZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHsgUmVzb3VyY2UgfSBmcm9tICcuL2VsZW1lbnRzL3Jlc291cmNlJztcblxuZXhwb3J0IGludGVyZmFjZSBJU2VydmljZSB7fVxuXG5leHBvcnQgZnVuY3Rpb24gU2VydmljZShuYW1lOiBzdHJpbmcpOiBJU2VydmljZSB7XG4gIGNvbnN0IGpzb24gPSByZXF1aXJlKGAuLi9zdHVicy9qc29uLyR7bmFtZX0uanNvbmApO1xuICBjb25zdCBzZXJ2aWNlOiBhbnkgPSB7IGpzb24gfTtcbiAgT2JqZWN0LmtleXMoanNvbi5SZXNvdXJjZXMpLm1hcChyID0+IHtcbiAgICBzZXJ2aWNlW3JdID0gUmVzb3VyY2UuYmluZCh7IGpzb24sIG5hbWU6IHIgfSk7XG4gIH0pO1xuICByZXR1cm4gc2VydmljZTtcbn1cbiJdfQ==