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
	function NewListController($scope,Breadcrumb, MainMenu, i18n, Plugins)
	{
		Breadcrumb.resetLocation([
			[i18n.trans('m.rbs.plugins.adminjs.module_name | ucf'), "Rbs/Plugins/Registered"]
		]);

		$scope.reloadPlugins = function (){
			Plugins.getRegistered().then(function (data){
				$scope.plugins = data;
			});
		};

		$scope.reloadPlugins();

		$scope.verify = function (plugin){ Plugins.verify(plugin).then(function (pluginInfos){
			$scope.pluginInfos = pluginInfos;
		}, function (pluginInfos){
			$scope.pluginInfos = pluginInfos;
		}); };

		$scope.install = function (plugin){ Plugins.install(plugin).then(function (){
			$scope.reloadPlugins();
		}); };

		$scope.deregister = function (plugin){ Plugins.deregister(plugin).then(function (){
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

	NewListController.$inject = ['$scope', 'RbsChange.Breadcrumb', 'RbsChange.MainMenu', 'RbsChange.i18n', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_New_ListController', NewListController);

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
	function RegisteredListController($scope, Breadcrumb, MainMenu, i18n, Plugins)
	{
		Breadcrumb.resetLocation([
			[i18n.trans('m.rbs.plugins.adminjs.module_name | ucf'), "Rbs/Plugins/Installed"]
		]);

		$scope.reloadPlugins = function (){
			Plugins.getNew().then(function (data){
				$scope.plugins = data;
			});
		};

		$scope.reloadPlugins();

		$scope.verify = function (plugin){ Plugins.verify(plugin).then(function (pluginInfos){
			$scope.pluginInfos = pluginInfos;
		}, function (pluginInfos){
			$scope.pluginInfos = pluginInfos;
		}); };

		$scope.install = function (plugin){ Plugins.install(plugin).then(function (){
			$scope.reloadPlugins();
		}); };

		$scope.register = function (plugin){ Plugins.register(plugin).then(function (){
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

	RegisteredListController.$inject = ['$scope', 'RbsChange.Breadcrumb', 'RbsChange.MainMenu', 'RbsChange.i18n', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_Registered_ListController', RegisteredListController);

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
	function InstalledListController($scope, Breadcrumb, MainMenu, i18n, Plugins)
	{
		Breadcrumb.resetLocation([
			[i18n.trans('m.rbs.plugins.adminjs.module_name | ucf'), "Rbs/Plugins/Installed"]
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

	InstalledListController.$inject = ['$scope', 'RbsChange.Breadcrumb', 'RbsChange.MainMenu', 'RbsChange.i18n', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_Installed_ListController', InstalledListController);

})();