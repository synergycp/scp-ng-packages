(function () {
  'use strict';

  angular
    .module('scp.packages')
    .factory('PackageLoader', PackageLoader)
    ;

  /**
   * @ngInject
   */
  function PackageLoader(Api, $ocLazyLoad) {
    var loader = this;
    var $api = Api.all('package/angular-admin');

    return makeLoadPackagesPromise();

    ///////////

    function makeLoadPackagesPromise() {
      return $api.getList()
        .then(makeLoadFilesPromise);
    }

    function makeLoadFilesPromise(packages) {
      var files = _(packages).map('files').flatten().value();

      return $ocLazyLoad.load(files);
    }
  }
})();
