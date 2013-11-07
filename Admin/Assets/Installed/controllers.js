(function ()
{
	"use strict";

	var app = angular.module('RbsChange');

	/**
	 * Controller for list.
	 *
	 * @param $scope
	 * @param Breadcrumb
	 * @param MainMenu
	 * @param i18n
	 * @param Plugins
	 * @constructor
	 */
	function ListController($scope, Breadcrumb, MainMenu, i18n, Plugins)
	{
		Breadcrumb.resetLocation([
			[i18n.trans('m.rbs.plugins.admin.js.module-name | ucf'), "Rbs/Plugins/Installed"]
		]);

		$scope.reloadPlugins = function (){
			Plugins.getInstalled().then(function (data){
				$scope.plugins = data;
			});
		};

		$scope.reloadPlugins();

		$scope.verify = function (plugin){
			Plugins.verify(plugin).then(function (pluginInfos){
				$scope.pluginInfos = pluginInfos;
			}, function (pluginInfos){
			$scope.pluginInfos = pluginInfos;
		}); };

		$scope.activateChange = function (plugin){ Plugins.activateChange(plugin); };

		$scope.deinstall = function (plugin){ Plugins.deinstall(plugin).then(function (){
			$scope.reloadPlugins();
		}); };

		$scope.verifyAll = function (){
			Plugins.verifyAll($scope.plugins).then(function (pluginInfos) {
				$scope.pluginInfos = pluginInfos;
			} ) };

		//sort
		$scope.predicate = 'vendor';
		$scope.reverse = false;
		$scope.isSortedOn = function (column) { return column == $scope.predicate; };

		MainMenu.loadModuleMenu('Rbs_Plugins');
	}

	ListController.$inject = ['$scope', 'RbsChange.Breadcrumb', 'RbsChange.MainMenu', 'RbsChange.i18n', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_Installed_ListController', ListController);

})();