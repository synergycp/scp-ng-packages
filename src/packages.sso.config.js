(function () {
  "use strict";

  angular.module("scp.packages").config(AddPackageLoaderToSsoResolves);

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
    return PackageLoader.load().catch(function (error) {
      // Intentionally do not bubble up any package loading errors, as it could kill the whole app!
      console.error("Error loading packages: ", error);
    });
  }
})();
