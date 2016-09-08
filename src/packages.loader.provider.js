(function () {
  'use strict';

  angular
    .module('scp.packages')
    .provider('PackagesLoader', makePackagesLoaderProvider);

  /**
   *  Service
   *
   * @ngInject
   */
  function makePackagesLoaderProvider () {
    var apiBase;
    var PackagesLoaderProvider = {
      $get: makePackagesLoaderService,
      getApiBase: getApiBase,
      setApiBase: setApiBase,
    };

    return PackagesLoaderProvider;

    function setApiBase(base) {
      apiBase = base;

      return PackagesLoaderProvider;
    }

    function getApiBase() {
      return apiBase;
    }

    /**
     * @ngInject
     */
    function makePackagesLoaderService() {
      return {
        getApiBase: getApiBaseOrFail,
      };

      function getApiBaseOrFail() {
        var value = PackagesLoaderProvider.getApiBase();

        if (!value) {
          throw new Error('ApiBase not set in PackagesLoaderProvider');
        }

        return value;
      }
    }

    //////////


  }
})();
