<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\ArrayResult;
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
		$result = new ArrayResult();

		if ($event->getRequest()->getPost('plugin'))
		{
			$pluginInfos = $event->getRequest()->getPost('plugin');
			$tm = $event->getApplicationServices()->getTransactionManager();
			$pm = $event->getApplicationServices()->getPluginManager();
			$plugin = $pm->getPlugin($pluginInfos['type'], $pluginInfos['vendor'], $pluginInfos['shortName']);
			if (isset($plugin->getConfiguration()['locked']) && $plugin->getConfiguration()['locked'] && !$pluginInfos['activated'])
			{
				throw new \InvalidArgumentException('Plugin is locked, unable to deactivate');
			}
			$plugin->setActivated($pluginInfos['activated']);
			try
			{
				$tm->begin();
				$pm->update($plugin);
				$tm->commit();
				$pm->compile();
				$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);
			}
			catch(\Exception $e)
			{
				$tm->rollBack($e);
				$result->setHttpStatusCode(HttpResponse::STATUS_CODE_500);
			}
		}
		else
		{
			$result->setHttpStatusCode(HttpResponse::STATUS_CODE_500);
		}

		$event->setResult($result);
	}
}