(function () {
  'use strict';

  angular
    .module('scp.packages')
    .config(AddPackageLoaderToSsoResolves)
    ;

  /**
   * @ngInject
   */
  function AddPackageLoaderToSsoResolves(SsoUrlProvider) {
    SsoUrlProvider.resolve(PackageLoaderResolver);
  }

  /**
   * @ngInject
   */
  function PackageLoaderResolver(PackageLoader) {
    return PackageLoader.load();
  }
})();
