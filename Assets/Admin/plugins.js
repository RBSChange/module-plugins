(function ($)
{

	"use strict";

	var app = angular.module('RbsChange');

	function changePluginsServiceFn($http, $q, i18n, REST, $filter, NotificationCenter, ErrorFormatter)
	{

		this.getNew = function ()
		{
			var deferred = $q.defer();
			var url = REST.getBaseUrl('plugins/newPlugins');
			$http.get(url).success(function (data)
			{
				deferred.resolve(data);
			}).error(function (data)
				{
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.getRegistered = function ()
		{
			var deferred = $q.defer();
			var url = REST.getBaseUrl('plugins/registeredPlugins');
			$http.get(url).success(function (data)
			{
				deferred.resolve(data);
			}).error(function (data)
				{
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.getInstalled = function ()
		{
			var deferred = $q.defer();
			var url = REST.getBaseUrl('plugins/installedPlugins');
			$http.get(url).success(function (data)
			{
				deferred.resolve(data);
			}).error(function (data)
				{
					deferred.reject(data);
				});
			return deferred.promise;
		};

		this.verify = function (plugin)
		{
			plugin.verified = false;
			plugin.valid = false;

			var messages = new Array();
			var deferred = $q.defer();
			var url = REST.getBaseUrl('commands/rbs_plugins/verify');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName }).
				success(function (r)
				{
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
						messages.push(i18n.trans('m.rbs.plugins.adminjs.invalid_signature | ucf', i18nData));
						messages.push(result.error);
					}
					else
					{
						plugin.valid = true;

						i18nData['subject'] = result.data.subject.CN;
						i18nData['CN'] = result.data.issuer.CN;
						i18nData['emailAddress'] = result.data.issuer.emailAddress;
						i18nData['validFrom'] = $filter('date')(result.data.validFrom_time_t * 1000);
						i18nData['validTo'] = $filter('date')(result.data.validTo_time_t * 1000);

						messages.push(i18n.trans('m.rbs.plugins.adminjs.valid_signature | ucf', i18nData));
						messages.push(i18n.trans('m.rbs.plugins.adminjs.certificate_info | ucf', i18nData));
						messages.push(i18n.trans('m.rbs.plugins.adminjs.certificate_validity | ucf', i18nData));
					}

					if (plugin.valid)
					{
						NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.check_plugin_title | ucf'), messages,
							'rbs_plugin_check_one');
					}
					else
					{
						NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.check_plugin_title | ucf'), messages,
							'rbs_plugin_check_one');
					}

					deferred.resolve();
				}).
				error(function (r)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.impossible_to_check | ucf'));
					messages.push(ErrorFormatter.format(r));

					NotificationCenter.warning(i18n.trans('m.rbs.plugins.adminjs.check_plugin_title | ucf'),
						messages, 'rbs_plugin_check_one');

					deferred.reject();
				});
			return deferred.promise;

		};

		this.verifyAll = function (plugins)
		{
			var totalCount = 0,
				validCount = 0,
				invalidCount = 0,
				nocheckCount = 0,
				promises = [];

			var deferred = $q.defer();
			var url = REST.getBaseUrl('commands/rbs_plugins/verify');

			angular.forEach(plugins, function (plugin)
			{
				plugin.verified = false;

				var q = $q.defer();

				var p = $http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName });
				promises.push(q.promise);

				p.success(function (r)
				{
					++totalCount;
					plugin.verified = true;

					var result = r.result;

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
						++totalCount;
						q.resolve();
					});
			});

			function displayInfo()
			{
				var messages = new Array();

				if (invalidCount > 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.invalid_plugin_count_many | ucf', {'count': invalidCount}));
				}
				else if (invalidCount == 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.invalid_plugin_count_one | ucf', {'count': invalidCount}));
				}

				if (validCount > 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.valid_plugin_count_many | ucf', {'count': validCount}));
				}
				else if (validCount == 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.valid_plugin_count_one | ucf', {'count': validCount}));
				}

				if (nocheckCount > 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.impossible_to_check_count_many | ucf',
						{'count': nocheckCount}));
				}
				else if (nocheckCount == 1)
				{
					messages.push(i18n.trans('m.rbs.plugins.adminjs.impossible_to_check_count_one | ucf',
						{'count': nocheckCount}));
				}

				if (totalCount > 0)
				{

					if (invalidCount == 0)
					{
						if (validCount > 0)
						{
							NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.check_all_plugin_title | ucf'), messages,
								'rbs_plugin_check_all');
						}
						else
						{
							NotificationCenter.warning(i18n.trans('m.rbs.plugins.adminjs.check_all_plugin_title | ucf'), messages,
								'rbs_plugin_check_all');
						}
					}
					else
					{
						NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.check_all_plugin_title | ucf'), messages,
							'rbs_plugin_check_all');
					}

				}
				else
				{
					NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.check_all_plugin_title | ucf'),
						i18n.trans('m.rbs.plugins.adminjs.no_plugin_to_check | ucf'), 'rbs_plugin_check_all');
				}

				deferred.resolve();
			}

			$q.all(promises).then(displayInfo, displayInfo);

			return deferred.promise;
		};

		this.register = function (plugin)
		{
			var messages = new Array();

			var deferred = $q.defer();
			var url = REST.getBaseUrl('commands/change/register-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName })
				.success(function (r)
				{
					var result = r.result;

					var i18nData = {
						'name': plugin.shortName,
						'vendor': plugin.vendor,
						'type': plugin.type
					};

					if (result.error && result.error.length > 0)
					{
						messages.push(i18n.trans('m.rbs.plugins.adminjs.plugin_not_registered | ucf', i18nData));
						messages.push(result.error);
						NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.register_title | ucf'), messages,
							'rbs_plugin_register');
					}
					else
					{
						NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.register_title | ucf'),
							i18n.trans('m.rbs.plugins.adminjs.plugin_registered | ucf', i18nData), 'rbs_plugin_register', 5000);
					}

					deferred.resolve();
				})
				.error(function (r)
				{
					NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.register_title | ucf'), ErrorFormatter.format(r),
						'rbs_plugin_register');
					deferred.reject();
				}
			);
			return deferred.promise;
		};

		this.deregister = function (plugin)
		{
			var messages = new Array();

			var deferred = $q.defer();
			var url = REST.getBaseUrl('commands/change/deregister-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName })
				.success(function (r)
				{
					var result = r.result;

					var i18nData = {
						'name': plugin.shortName,
						'vendor': plugin.vendor,
						'type': plugin.type
					};

					if (result.error && result.error.length > 0)
					{
						messages.push(i18n.trans('m.rbs.plugins.adminjs.plugin_not_deregistered | ucf', i18nData));
						messages.push(result.error);
						NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.deregister_title | ucf'), messages,
							'rbs_plugin_deregister');
					}
					else
					{
						NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.deregister_title | ucf'),
							i18n.trans('m.rbs.plugins.adminjs.plugin_deregistered | ucf', i18nData), 'rbs_plugin_deregister',
							5000);
					}
					deferred.resolve();
				})
				.error(function (r)
				{
					NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.deregister_title | ucf'), ErrorFormatter.format(r),
						'rbs_plugin_deregister');
					deferred.reject();
				}
			);
			return deferred.promise;
		};

		this.install = function (plugin)
		{
			var messages = new Array();

			var deferred = $q.defer();
			plugin.onInstall = true;
			var url = REST.getBaseUrl('commands/change/install-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName })
				.success(function (r)
				{
					var result = r.result;

					var i18nData = {
						'name': plugin.shortName,
						'vendor': plugin.vendor,
						'type': plugin.type
					};

					if (result.error && result.error.length > 0)
					{
						messages.push(i18n.trans('m.rbs.plugins.adminjs.plugin_not_installed | ucf', i18nData));
						messages.push(result.error);
						NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.install_title | ucf'), messages,
							'rbs_plugin_install');
					}
					else
					{
						NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.install_title | ucf'),
							i18n.trans('m.rbs.plugins.adminjs.plugin_installed | ucf', i18nData), 'rbs_plugin_install',
							5000);
					}

					deferred.resolve();
				})
				.error(function (r)
				{
					NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.install_title | ucf'), ErrorFormatter.format(r),
						'rbs_plugin_install');
					deferred.reject();
				});
			return deferred.promise;
		};

		this.deinstall = function (plugin)
		{
			var messages = new Array();

			var deferred = $q.defer();
			var url = REST.getBaseUrl('commands/change/deinstall-plugin');
			$http.post(url, { 'type': plugin.type, 'vendor': plugin.vendor, 'name': plugin.shortName })
				.success(function (r)
				{
					var result = r.result;

					var i18nData = {
						'name': plugin.shortName,
						'vendor': plugin.vendor,
						'type': plugin.type
					};

					if (result.error && result.error.length > 0)
					{
						messages.push(i18n.trans('m.rbs.plugins.adminjs.plugin_not_deinstalled | ucf', i18nData));
						messages.push(result.error);
						NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.deinstall_title | ucf'), messages,
							'rbs_plugin_deinstall');
					}
					else
					{
						NotificationCenter.info(i18n.trans('m.rbs.plugins.adminjs.deinstall_title | ucf'),
							i18n.trans('m.rbs.plugins.adminjs.plugin_deinstalled | ucf', i18nData), 'rbs_plugin_deinstall',
							5000);
					}

					deferred.resolve();
				})
				.error(function (r)
				{
					NotificationCenter.error(i18n.trans('m.rbs.plugins.adminjs.deinstall_title | ucf'), ErrorFormatter.format(r),
						'rbs_plugin_deinstall');
					deferred.reject();
				});
			return deferred.promise;
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
		'$filter',
		'RbsChange.NotificationCenter',
		'RbsChange.ErrorFormatter'
	];

	app.service('RbsChange.Plugins', changePluginsServiceFn);

})(window.jQuery);