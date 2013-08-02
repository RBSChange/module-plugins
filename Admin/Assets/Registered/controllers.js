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
	function ListController($scope,Breadcrumb, MainMenu, i18n, Plugins)
	{
		Breadcrumb.resetLocation([
			[i18n.trans('m.rbs.plugins.admin.js.module-name | ucf'), "Rbs/Plugins/Registered"]
		]);

		$scope.reloadPlugins = function (){
			Plugins.getRegistered().then(function (data){
				$scope.plugins = data;
			});
		};

		$scope.reloadPlugins();

		$scope.pluginList = {
			'verify': function (plugin){ Plugins.verify(plugin).then(function (pluginInfos){
				$scope.pluginInfos = pluginInfos;
			}, function (pluginInfos){
				$scope.pluginInfos = pluginInfos;
			}); },
			'install': function (plugin){ Plugins.install(plugin).then(function (){
				$scope.reloadPlugins();
			}); },
			'deregister': function (plugin){ Plugins.deregister(plugin).then(function (){
				$scope.reloadPlugins();
			}); }
		};

		$scope.verifyAll = function (){ Plugins.verifyAll($scope.plugins) };

		MainMenu.loadModuleMenu('Rbs_Plugins');
	}

	ListController.$inject = ['$scope', 'RbsChange.Breadcrumb', 'RbsChange.MainMenu', 'RbsChange.i18n', 'RbsChange.Plugins'];
	app.controller('Rbs_Plugins_New_ListController', ListController);

})();