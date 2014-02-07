(function () {
	"use strict";

	var app = angular.module('RbsChange');

	/**
	 * Controller for list.
	 *
	 * @param $scope
	 * @param MainMenu
	 * @param Plugins
	 * @constructor
	 */
	function NewListController($scope, MainMenu, Plugins) {
		$scope.reloadPlugins = function () {
			Plugins.getNew()
				.then(function (data) {
					$scope.plugins = data;
				});
		};

		$scope.reloadPlugins();

		$scope.register = function (plugin) {
			Plugins.register(plugin)
				.then(function () {
					$scope.reloadPlugins();
				});
		};

		$scope.verify = function (plugin) {
			Plugins.verify(plugin);
		};

		$scope.verifyAll = function () {
			Plugins.verifyAll($scope.plugins)
		};

		//sort
		$scope.predicate = 'vendor';
		$scope.reverse = false;
		$scope.isSortedOn = function (column) {
			return column == $scope.predicate;
		};

		MainMenu.loadModuleMenu('Rbs_Plugins');
	}

	NewListController.$inject = ['$scope', 'RbsChange.MainMenu', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_New_ListController', NewListController);

	/**
	 * Controller for list.
	 *
	 * @param $scope
	 * @param MainMenu
	 * @param Plugins
	 * @constructor
	 */
	function RegisteredListController($scope, MainMenu, Plugins) {

		$scope.reloadPlugins = function () {
			Plugins.getRegistered()
				.then(function (data) {
					$scope.plugins = data;
				});
		};

		$scope.reloadPlugins();

		$scope.install = function (plugin) {
			Plugins.install(plugin)
				.then(function () {
					$scope.reloadPlugins();
				});
		};

		$scope.deregister = function (plugin) {
			Plugins.deregister(plugin)
				.then(function () {
					$scope.reloadPlugins();
				});
		};

		$scope.verify = function (plugin) {
			Plugins.verify(plugin);
		};

		$scope.verifyAll = function () {
			Plugins.verifyAll($scope.plugins)
		};

		//sort
		$scope.predicate = 'vendor';
		$scope.reverse = false;
		$scope.isSortedOn = function (column) {
			return column == $scope.predicate;
		};

		MainMenu.loadModuleMenu('Rbs_Plugins');
	}

	RegisteredListController.$inject =
		['$scope', 'RbsChange.MainMenu', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_Registered_ListController', RegisteredListController);

	/**
	 * Controller for list.
	 *
	 * @param $scope
	 * @param MainMenu
	 * @param Plugins
	 * @constructor
	 */
	function InstalledListController($scope, MainMenu, Plugins) {

		$scope.reloadPlugins = function () {
			Plugins.getInstalled().then(function (data) {
				$scope.plugins = data;
			});
		};

		$scope.reloadPlugins();

		$scope.activateChange = function (plugin) {
			Plugins.activateChange(plugin);
		};

		$scope.deinstall = function (plugin) {
			Plugins.deinstall(plugin)
				.then(function () {
					$scope.reloadPlugins();
				});
		};

		$scope.verify = function (plugin) {
			Plugins.verify(plugin);
		};

		$scope.verifyAll = function () {
			Plugins.verifyAll($scope.plugins)
		};

		//sort
		$scope.predicate = 'vendor';
		$scope.reverse = false;
		$scope.isSortedOn = function (column) {
			return column == $scope.predicate;
		};

		MainMenu.loadModuleMenu('Rbs_Plugins');
	}

	InstalledListController.$inject =
		['$scope', 'RbsChange.MainMenu', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_Installed_ListController', InstalledListController);

})();