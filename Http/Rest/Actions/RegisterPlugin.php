<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\DocumentResult;
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
		if ($event->getRequest()->getPost('plugin'))
		{
			$pluginInfos = $event->getRequest()->getPost('plugin');
			$pm = $event->getApplicationServices()->getPluginManager();
			$plugin = new Plugin($pluginInfos['basePath'], $pluginInfos['type'], $pluginInfos['vendor'], $pluginInfos['shortName']);
			$plugin->setPackage($pluginInfos['package']);
			$pm->register($plugin);
			$pm->compile();
		}

		$result = new DocumentResult();
		$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);

		$event->setResult($result);
	}
}