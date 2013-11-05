(function () {

	"use strict";

	var app = angular.module('RbsChange');

	app.config(['$provide', function ($provide)
	{
		$provide.decorator('RbsChange.UrlManager', ['$delegate', function ($delegate)
		{
			$delegate.model('Rbs_Plugins')
				.route('Installed', 'Rbs/Plugins/Installed/', { 'templateUrl': 'Rbs/Plugins/Installed/list.twig'})
				.route('Registered', 'Rbs/Plugins/Registered/', { 'templateUrl': 'Rbs/Plugins/Registered/list.twig'})
				.route('New', 'Rbs/Plugins/New/', { 'templateUrl': 'Rbs/Plugins/New/list.twig'});
			return $delegate;
		}]);
	}]);

	app.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
		. when(
			'/Rbs/Plugins/',
			{
				redirectTo : '/Rbs/Plugins/Installed/'
			})
		;
	}]);

})();