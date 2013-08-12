<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\ArrayResult;
use Change\Plugins\Plugin;
use Zend\Http\Response as HttpResponse;

/**
 * @name \Rbs\Plugins\Http\Rest\Actions\RegisterPlugin
 */
class RegisterPlugin
{

	/**
	 * @param \Change\Http\Event $event
	 */
	public function execute($event)
	{
		$result = new ArrayResult();

		if ($event->getRequest()->getPost('plugin'))
		{
			$pluginInfos = $event->getRequest()->getPost('plugin');
			$pm = $event->getApplicationServices()->getPluginManager();
			$plugin = new Plugin($pluginInfos['basePath'], $pluginInfos['type'], $pluginInfos['vendor'], $pluginInfos['shortName']);
			$plugin->setPackage($pluginInfos['package']);
			$pm->register($plugin);
			$pm->compile();
			$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);
		}
		else
		{
			$result->setHttpStatusCode(HttpResponse::STATUS_CODE_500);
		}

		$event->setResult($result);
	}
}