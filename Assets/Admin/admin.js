(function () {

	"use strict";

	var app = angular.module('RbsChange');

	app.config(['$provide', function ($provide)
	{
		$provide.decorator('RbsChange.UrlManager', ['$delegate', function ($delegate)
		{
			$delegate.module('Rbs_Plugins')
				.route('Installed', 'Rbs/Plugins/Installed/', { 'templateUrl': 'Rbs/Plugins/installed-list.twig'})
				.route('Registered', 'Rbs/Plugins/Registered/', { 'templateUrl': 'Rbs/Plugins/registered-list.twig'})
				.route('New', 'Rbs/Plugins/New/', { 'templateUrl': 'Rbs/Plugins/new-list.twig'});
			return $delegate.module(null);
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