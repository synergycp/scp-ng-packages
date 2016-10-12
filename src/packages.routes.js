(function () {
  angular
    .module('scp.packages')
    .config(routeConfig);

  /**
   * @ngInject
   */
  function routeConfig($futureStateProvider, $stateProvider, RouteHelpersProvider, PackageLoaderProvider) {
    var helper = RouteHelpersProvider;
    $stateProvider.state('app.pkg', {
      url: '/pkg',
      abstract: true,
      template: helper.dummyTemplate,
    });
    $futureStateProvider.addResolve(loadPackages);

    function deprecated() {
      $futureStateProvider
        .futureState({
          stateName: 'app.pkg',
          url: '/pkg',
          type: 'package',
        });

      $futureStateProvider.stateFactory('package', packageStateFactory);
    }

    /**
     * @ngInject
     */
    function loadPackages(PackageLoader) {
      return PackageLoader.load();
    }

    /**
     * @ngInject
     */
    function packageStateFactory(futureState, PackageLoader) {
      return PackageLoader.load().then(function () {
        // If we return the files object here,
        // $futureStateProvider chokes.
      });
    }
  }
})();
