<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Plugins\Plugin;
use Rbs\Plugins\Std\Signtool;

use Change\Http\Rest\Result\ArrayResult;
use Zend\Http\Response as HttpResponse;

/**
 * @name \Rbs\Plugins\Commands\Verify
 */
class VerifyPlugin
{
	/**
	 * @param \Change\Http\Event $event
	 */
	public function execute(\Change\Http\Event $event)
	{
		$applicationServices = $event->getApplicationServices();
		$application = $applicationServices->getApplication();

		$type = $event->getRequest()->getQuery('type');
		$vendor = $event->getRequest()->getQuery('vendor');
		$name = $event->getRequest()->getQuery('name');

		$signResult = array('errors' => array());
		try
		{
			//search first on compiled plugins
			$plugin = $applicationServices->getPluginManager()->getPlugin($type, $vendor, $name);
			//if nothing match, search on unregistered plugins
			if ($plugin === null)
			{
				$unregisteredPlugins = $applicationServices->getPluginManager()->getUnregisteredPlugins();
				$result = array_filter($unregisteredPlugins, function(Plugin $plugin) use ($type, $vendor, $name) {
					return $plugin->getType() === $type && $plugin->getVendor() === $vendor && $plugin->getShortName() === $name;
				});
				$plugin = array_pop($result);
			}
			if ($plugin === null)
			{
				$signResult['errors'][] = 'Plugin not found.';
			}
			else
			{
				$signTool = new Signtool($application);
				$signResult = array_merge($signResult, $signTool->verify($plugin));
				if (isset($signResult['parsing']['error']['message']))
				{
					$signResult['errors'][] = $signResult['parsing']['error']['message'];
				}
			}
		}
		catch (\Exception $e)
		{
			$applicationServices->getLogging()->exception($e);
			$signResult['errors'][] = $e->getMessage();
		}

		$result = new ArrayResult();
		$result->setArray($signResult);
		$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);

		$event->setResult($result);
	}
}