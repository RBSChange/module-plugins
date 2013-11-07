(function ($)
{

	"use strict";

	var app = angular.module('RbsChange');

	function changePluginsServiceFn($http, $q, i18n, REST, $filter)
	{

		this.getNew = function ()
		{
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/newPlugins');
			$http.get(url).success(function (data)
			{
				deffered.resolve(data);
			}).error(function (data)
				{
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.getRegistered = function ()
		{
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/registeredPlugins');
			$http.get(url).success(function (data)
			{
				deffered.resolve(data);
			}).error(function (data)
				{
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.getInstalled = function ()
		{
			var deffered = $q.defer();
			var url = REST.getBaseUrl('plugins/installedPlugins');
			$http.get(url).success(function (data)
			{
				deffered.resolve(data);
			}).error(function (data)
				{
					deffered.reject(data);
				});
			return deffered.promise;
		};

		this.verify = function (plugin)
		{
			plugin.verified = false;
			plugin.valid = false;

			var messages = new Array();
			var deffered = $q.defer();
			var url = REST.getBaseUrl('commands/rbs_plugins/verify');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName }).
				success(function (r)
				{
					var pluginInfos = {};
					var result = r.result;
					plugin.verified = true;

					var i18nData = {
						'name': plugin.shortName,
						'vendor': plugin.vendor,
						'type': plugin.type
					};

					if (result.error && result.error.length > 0)
					{
						plugin.valid = false;
						messages.push(i18n.trans('m.rbs.plugins.admin.js.invalid-signature | ucf', i18nData));
						pluginInfos.errors = result.error;
					}
					else
					{
						plugin.valid = true;

						i18nData['subject'] = result.data.subject.CN;
						i18nData['CN'] = result.data.issuer.CN;
						i18nData['emailAddress'] = result.data.issuer.emailAddress;
						i18nData['validFrom'] = $filter('date')(result.data.validFrom_time_t * 1000);
						i18nData['validTo'] = $filter('date')(result.data.validTo_time_t * 1000);

						messages.push(i18n.trans('m.rbs.plugins.admin.js.valid-signature | ucf', i18nData));
						messages.push(i18n.trans('m.rbs.plugins.admin.js.certificate-info | ucf', i18nData));
						messages.push(i18n.trans('m.rbs.plugins.admin.js.certificate-validity | ucf', i18nData));
					}

					pluginInfos.messages = messages;
					pluginInfos.valid = plugin.valid;
					pluginInfos.verified = plugin.verified;

					deffered.resolve(pluginInfos);
				}).
				error(function (r)
				{
					var pluginInfos = {};
					messages.push(i18n.trans('m.rbs.plugins.admin.js.impossible-to-check | ucf'));
					pluginInfos.messages = messages;
					pluginInfos.verified = plugin.verified;

					pluginInfos.errors = new Array(r.message);

					deffered.reject(pluginInfos);
				});
			return deffered.promise;

		};

		this.verifyAll = function (plugins)
		{
			var validCount = 0,
				invalidCount = 0,
				nocheckCount = 0,
				promises = [];

			var deffered = $q.defer();
			var url = REST.getBaseUrl('commands/rbs_plugins/verify');

			angular.forEach(plugins, function (plugin)
			{
				plugin.verified = false;

				var q = $q.defer();

				var p = $http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName });
				promises.push(q.promise);

				p.success(function (r)
				{
					plugin.verified = true;

					var result =  r.result;

					if (result.error)
					{
						plugin.valid = false;
						++invalidCount;
					}
					else
					{
						plugin.valid = true;
						++validCount;
					}

					q.resolve();
				}).error(function ()
				{
					++nocheckCount;
					q.resolve();
				});
			});

			function displayInfo()
			{
				var pluginInfos = {};
				pluginInfos.valid = true;
				pluginInfos.verified = false;

				var messages = new Array();

				if (invalidCount > 0 || validCount > 0)
				{
					pluginInfos.verified = true;
				}

				if (invalidCount > 1)
				{
					pluginInfos.valid = false;
					messages.push(i18n.trans('m.rbs.plugins.admin.js.invalid-plugin-count-many | ucf', {'count' : invalidCount}));
				}
				else
				{
					pluginInfos.valid = false;
					messages.push(i18n.trans('m.rbs.plugins.admin.js.invalid-plugin-count-one | ucf', {'count' : invalidCount}));
				}
				if (validCount > 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.admin.js.valid-plugin-count-many | ucf', {'count' : validCount}));
				}
				else
				{
					messages.push(i18n.trans('m.rbs.plugins.admin.js.valid-plugin-count-one | ucf', {'count' : validCount}));
				}
				if (nocheckCount > 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.admin.js.impossible-to-check-count-many | ucf', {'count' : nocheckCount}));
				}
				else if (nocheckCount == 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.admin.js.impossible-to-check-count-one | ucf', {'count' : nocheckCount}));
				}
				pluginInfos.messages = messages;

				deffered.resolve(pluginInfos);
			}

			$q.all(promises).then(displayInfo, displayInfo);

			return deffered.promise;
		};

		this.register = function (plugin)
		{
			var deffered = $q.defer();
			var url = REST.getBaseUrl('commands/change/register-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName }).success(function ()
			{
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.deregister = function (plugin)
		{
			var deffered = $q.defer();
			var url = REST.getBaseUrl('commands/change/deregister-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName }).success(function ()
			{
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.install = function (plugin)
		{
			var deffered = $q.defer();
			plugin.onInstall = true;
			var url = REST.getBaseUrl('commands/change/install-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName }).success(function ()
			{
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.deinstall = function (plugin)
		{
			var deffered = $q.defer();
			var url = REST.getBaseUrl('commands/change/deinstall-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName }).success(function ()
			{
				deffered.resolve();
			});
			return deffered.promise;
		};

		this.activateChange = function (plugin)
		{
			var base = !plugin.activated ? 'commands/change/disable-plugin' : 'commands/change/enable-plugin';
			var url = REST.getBaseUrl(base);
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName });
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