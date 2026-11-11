(function () {
  'use strict';

  angular
    .module('scp.packages')
    .service('PackageLoader', PackageLoaderService)
    ;

  /**
   * @ngInject
   */
  function PackageLoaderService(Api, $ocLazyLoad, PackagesLoader, versions) {
    var PackageLoader = this;
    var $api = Api.all(PackagesLoader.getApiBase());
    var loadPromise;

    PackageLoader.load = loadPackages;

    ///////////

    function loadPackages() {
      return (loadPromise = loadPromise ||
        $api
          .getList()
          .then(function (packages) {
            return loadFiles(packages).then(function (result) {
              addLangVersions(packages);
              return result;
            });
          })
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

    // After loadFiles so the served-file hash overrides a package's build-time version-manifest.
    function addLangVersions(packages) {
      _.each(packages, function (pkg) {
        versions.addForPackage(pkg.slug, pkg.versions || {});
      });
    }
  }
})();
