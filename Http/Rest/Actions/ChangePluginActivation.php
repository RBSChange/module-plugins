<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\DocumentResult;
use Zend\Http\Response as HttpResponse;

/**
 * @name \Rbs\Plugins\Http\Rest\Actions\ChangePluginActivation
 */
class ChangePluginActivation
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
			$plugin = $pm->getPlugin($pluginInfos['type'], $pluginInfos['vendor'], $pluginInfos['name']);
			$plugin->setActivated($pluginInfos['activated']);
			$pm->update($plugin);
			$pm->compile();
		}

		$result = new DocumentResult();
		$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);

		$event->setResult($result);
	}
}