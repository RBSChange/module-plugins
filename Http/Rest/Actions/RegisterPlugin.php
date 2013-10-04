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
			$tm = $event->getApplicationServices()->getTransactionManager();
			$plugin = new Plugin($pluginInfos['basePath'], $pluginInfos['type'], $pluginInfos['vendor'], $pluginInfos['shortName']);
			$plugin->setPackage($pluginInfos['package']);
			try
			{
				$tm->begin();
				$pm->register($plugin);
				$tm->commit();
			}
			catch (\Exception $e)
			{
				throw $tm->rollBack($e);
			}

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