<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\DocumentResult;
use Zend\Http\Response as HttpResponse;

/**
 * @name \Rbs\Plugins\Http\Rest\Actions\DeinstallPlugin
 */
class DeinstallPlugin
{

	/**
	 * @param \Change\Http\Event $event
	 */
	public function execute($event)
	{
		$result = new DocumentResult();

		if ($event->getRequest()->getPost('plugin'))
		{
			$pluginInfos = $event->getRequest()->getPost('plugin');
			$pm = $event->getApplicationServices()->getPluginManager();
			$plugin = $pm->getPlugin($pluginInfos['type'], $pluginInfos['vendor'], $pluginInfos['shortName']);
			$pm->deinstall($plugin);
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