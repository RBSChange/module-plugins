(function () {

	var app = angular.module('RbsChange');


	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider

		// Plugins

		. when(
			'/Rbs/Plugins',
			{
				templateUrl : 'Rbs/Plugins/Installed/list.twig',
				reloadOnSearch : false
			})

			. when(
			'/Rbs/Plugins/Installed',
			{
				templateUrl : 'Rbs/Plugins/Installed/list.twig',
				reloadOnSearch : false
			})

			. when(
			'/Rbs/Plugins/Registered',
			{
				templateUrl : 'Rbs/Plugins/Registered/list.twig',
				reloadOnSearch : false
			})

			. when(
			'/Rbs/Plugins/New',
			{
				templateUrl : 'Rbs/Plugins/New/list.twig',
				reloadOnSearch : false
			})

		;
	}]);

})();