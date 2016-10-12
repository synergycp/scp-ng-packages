(function () {
  'use strict';

  angular
    .module('scp.packages')
    .service('PackageLoader', PackageLoaderService)
    ;

  /**
   * @ngInject
   */
  function PackageLoaderService(Api, $ocLazyLoad, PackagesLoaderProvider) {
    var PackageLoader = this;
    var $api = Api.all(PackagesLoaderProvider.getApiBase());
    var loadPromise;

    PackageLoader.load = loadPackages;

    ///////////

    function loadPackages() {
      return (loadPromise = loadPromise ||
        $api
          .getList()
          .then(loadFiles)
      );
    }

    function loadFiles(packages) {
      return $ocLazyLoad.load(
        _(packages)
          .map('files')
          .flatten()
          .value()
      );
    }
  }
})();
