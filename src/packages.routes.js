(function () {
  angular.module("scp.packages").config(routeConfig);

  /**
   * @ngInject
   */
  function routeConfig(
    $futureStateProvider,
    $stateProvider,
    RouteHelpersProvider
  ) {
    var helper = RouteHelpersProvider;
    $stateProvider.state("app.pkg", {
      url: "/pkg",
      abstract: true,
      template: helper.dummyTemplate,
    });
    $futureStateProvider.addResolve(loadPackages);

    /**
     * @ngInject
     */
    function loadPackages(PackageLoader) {
      return PackageLoader.load().catch(function (error) {
        // Intentionally do not bubble up any package loading errors, as it kills the whole app!
        console.error("Error loading packages: ", error);
      });
    }
  }
})();
