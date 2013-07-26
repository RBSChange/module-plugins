(function ()
{
	"use strict";

	var app = angular.module('RbsChange');

	/**
	 * Controller for list.
	 *
	 * @param $scope
	 * @param REST
	 * @param $http
	 * @param Breadcrumb
	 * @param MainMenu
	 * @param i18n
	 * @param ArrayUtils
	 * @constructor
	 */
	function ListController($scope, REST, $http, Breadcrumb, MainMenu, i18n, ArrayUtils)
	{
		Breadcrumb.resetLocation([
			[i18n.trans('m.rbs.plugins.admin.js.module-name | ucf'), "Rbs/Plugins/Registered"]
		]);

		var url = REST.getBaseUrl('plugins/registeredPlugins');
		$http.get(url).success(function (data){
				$scope.plugins = data;
			}
		);

		$scope.verify = function (plugin){
			var url = REST.getBaseUrl('plugins/verifyPlugin?type=' + plugin.type + '&vendor=' + plugin.vendor +
				'&name=' + plugin.shortName);
			$http.get(url).success(function (data){
					if (data.errors.length == 0)
					{
						plugin.verified = data.valid;
					}
					else
					{
						var i18nData = {
							'name': plugin.shortName,
							'vendor': plugin.vendor,
							'type': plugin.type,
							'errors': data.errors.join('\n')
						};
						alert(i18n.trans('m.rbs.plugins.admin.js.invalid-signature | ucf', i18nData));
						plugin.invalid = true;
					}
				}
			);
		};

		$scope.verifyAll = function (){
			angular.forEach($scope.plugins, function(plugin){
				var url = REST.getBaseUrl('plugins/verifyPlugin?type=' + plugin.type + '&vendor=' + plugin.vendor +
					'&name=' + plugin.shortName);
				$http.get(url).success(function (data){
						if (data.errors.length == 0)
						{
							plugin.verified = data.valid;
						}
						else
						{
							plugin.invalid = true;
						}
					}
				);
			});
		};

		$scope.deregister = function (plugin){
			var url = REST.getBaseUrl('plugins/deregisterPlugin');
			$http.post(url, { 'plugin': plugin }).success(function (){
				ArrayUtils.removeValue($scope.plugins, plugin);
			});
		};

		$scope.install = function (plugin){
			plugin.onInstall = true;
			var url = REST.getBaseUrl('plugins/installPlugin');
			$http.post(url, { 'plugin': plugin }).success(function (){
				ArrayUtils.removeValue($scope.plugins, plugin);
			});
		};

		//sort
		$scope.predicate = 'vendor';
		$scope.reverse = false;
		$scope.isSortedOn = function (column) { return column == $scope.predicate; };

		MainMenu.loadModuleMenu('Rbs_Plugins');
	}

	ListController.$inject = ['$scope', 'RbsChange.REST', '$http', 'RbsChange.Breadcrumb', 'RbsChange.MainMenu', 'RbsChange.i18n', 'RbsChange.ArrayUtils'];
	app.controller('Rbs_Plugins_New_ListController', ListController);

})();