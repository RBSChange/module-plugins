<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\DocumentResult;
use Zend\Http\Response as HttpResponse;
use Change\Plugins\PluginManager;
use Change\Plugins\Plugin;

/**
 * @name \Rbs\Plugins\Http\Rest\Actions\InstallPlugin
 */
class InstallPlugin
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
			$type = $pluginInfos['type'] == Plugin::TYPE_THEME ? PluginManager::EVENT_TYPE_THEME : PluginManager::EVENT_TYPE_MODULE;
			$pm->installPlugin($type, $pluginInfos['vendor'], $pluginInfos['shortName']);
			$pm->compile();
		}

		$result = new DocumentResult();
		$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);

		$event->setResult($result);
	}
}