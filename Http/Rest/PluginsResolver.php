<?php
namespace Rbs\Plugins\Http\Rest;

use Change\Http\Rest\Actions\DiscoverNameSpace;
use Change\Http\Rest\Resolver;
use Change\Http\Rest\Request;
use Rbs\Plugins\Http\Rest\Actions\DeinstallPlugin;
use Rbs\Plugins\Http\Rest\Actions\DeregisterPlugin;
use Rbs\Plugins\Http\Rest\Actions\GetInstalledPlugins;
use Rbs\Plugins\Http\Rest\Actions\GetNewPlugins;
use Rbs\Plugins\Http\Rest\Actions\GetRegisteredPlugins;
use Rbs\Plugins\Http\Rest\Actions\InstallPlugin;
use Rbs\Plugins\Http\Rest\Actions\RegisterPlugin;
use Rbs\Plugins\Http\Rest\Actions\VerifyPlugin;
use Rbs\Plugins\Http\Rest\Actions\ChangePluginActivation;

/**
 * @name \Rbs\Plugins\Http\Rest\PluginsResolver
 */
class PluginsResolver
{
	/**
	 * @param \Change\Http\Rest\Resolver $resolver
	 */
	protected $resolver;

	/**
	 * @param \Change\Http\Rest\Resolver $resolver
	 */
	function __construct(Resolver $resolver)
	{
		$this->resolver = $resolver;
	}

	/**
	 * @param \Change\Http\Event $event
	 * @param string[] $namespaceParts
	 * @return string[]
	 */
	public function getNextNamespace($event, $namespaceParts)
	{
		return array('installedPlugins', 'registeredPlugins', 'newPlugins');
	}

	/**
	 * Set Event params: resourcesActionName, documentId, LCID
	 * @param \Change\Http\Event $event
	 * @param array $resourceParts
	 * @param $method
	 * @return void
	 */
	public function resolve($event, $resourceParts, $method)
	{
		$nbParts = count($resourceParts);
		if ($nbParts == 0 && $method === Request::METHOD_GET)
		{
			array_unshift($resourceParts, 'plugins');
			$event->setParam('namespace', implode('.', $resourceParts));
			$event->setParam('resolver', $this);
			$action = function ($event)
			{
				$action = new DiscoverNameSpace();
				$action->execute($event);
			};
			$event->setAction($action);
			return;
		}
		elseif ($nbParts == 1)
		{
			$actionName = $resourceParts[0];
			if ($actionName === 'installedPlugins')
			{
				$action = new GetInstalledPlugins();
				$event->setAction(function($event) use($action) {$action->execute($event);});
				$authorisation = function() use ($event)
				{
					return $event->getPermissionsManager()->isAllowed('Administrator');
				};
				$event->setAuthorization($authorisation);
			}
			else if ($actionName === 'registeredPlugins')
			{
				$action = new GetRegisteredPlugins();
				$event->setAction(function($event) use($action) {$action->execute($event);});
				$authorisation = function() use ($event)
				{
					return $event->getPermissionsManager()->isAllowed('Administrator');
				};
				$event->setAuthorization($authorisation);
			}
			else if ($actionName === 'newPlugins')
			{
				$action = new GetNewPlugins();
				$event->setAction(function($event) use($action) {$action->execute($event);});
				$authorisation = function() use ($event)
				{
					return $event->getPermissionsManager()->isAllowed('Administrator');
				};
				$event->setAuthorization($authorisation);
			}
		}
	}
}