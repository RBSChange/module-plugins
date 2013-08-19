(function ($) {

	"use strict";

	var app = angular.module('RbsChange');

	function changePluginsServiceFn ($http, $q, i18n, REST, $filter) {

		this.getNew = function(){
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/newPlugins');
			$http.get(url).success(function (data){
				deffered.resolve(data);
			}).error(function (data){
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.getRegistered = function(){
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/registeredPlugins');
			$http.get(url).success(function (data){
				deffered.resolve(data);
			}).error(function (data){
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.getInstalled = function(){
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/installedPlugins');
			$http.get(url).success(function (data){
					deffered.resolve(data);
				}).error(function (data){
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.verify = function (plugin){
			plugin.verified = false;
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/verifyPlugin?type=' + plugin.type + '&vendor=' + plugin.vendor +
				'&name=' + plugin.shortName);
			$http.get(url).success(function (data){
					var pluginInfos = {};
					if (data.errors.length == 0 && data.valid)
					{
						plugin.verified = true;
						var i18nSuccessData = {
							'name': plugin.shortName,
							'vendor': plugin.vendor,
							'type': plugin.type,
							'subject': data.parsing.certificate.subject.CN,
							'CN': data.parsing.certificate.issuer.CN,
							'emailAddress': data.parsing.certificate.issuer.emailAddress,
							'validFrom': $filter('date')(data.parsing.certificate.validFrom_time_t * 1000),
							'validTo': $filter('date')(data.parsing.certificate.validTo_time_t * 1000)
						};
						pluginInfos.success = true;
						pluginInfos.errors = false;
						pluginInfos.message = i18n.trans('m.rbs.plugins.admin.js.valid-signature | ucf', i18nSuccessData);
						deffered.resolve(pluginInfos);
					}
					else
					{
						plugin.invalid = true;
						var i18nErrorData = {
							'name': plugin.shortName,
							'vendor': plugin.vendor,
							'type': plugin.type
						};
						pluginInfos.success = false;
						pluginInfos.errors = data.errors;
						pluginInfos.message = i18n.trans('m.rbs.plugins.admin.js.invalid-signature | ucf', i18nErrorData);
						deffered.reject(pluginInfos);
					}
				}
			).error(function(data){
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.verifyAll = function (plugins){
			angular.forEach(plugins, function(plugin){
				plugin.verified = false;
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

		this.register = function (plugin){
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/registerPlugin');
			$http.post(url, { 'plugin': plugin }).success(function (){
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.deregister = function (plugin){
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/deregisterPlugin');
			$http.post(url, { 'plugin': plugin }).success(function (){
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.install = function (plugin){
			var deffered = $q.defer();
			plugin.onInstall = true;
			var url = REST.getBaseUrl('plugins/installPlugin');
			$http.post(url, { 'plugin': plugin }).success(function (){
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.deinstall = function (plugin){
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/deinstallPlugin');
			$http.post(url, { 'plugin': plugin }).success(function (){
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.activateChange = function (plugin){
			var url = REST.getBaseUrl('plugins/changePluginActivation');
			$http.post(url, { 'plugin': plugin })
		};
	}

	changePluginsServiceFn.$inject = [
		'$http',
		'$q',
		'RbsChange.i18n',
		'RbsChange.REST',
		'$filter'
	];

	app.service('RbsChange.Plugins', changePluginsServiceFn);

})(window.jQuery);