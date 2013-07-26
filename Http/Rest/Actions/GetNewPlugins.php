<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\ArrayResult;
use Zend\Http\Response as HttpResponse;

/**
 * @name \Rbs\Plugins\Http\Rest\Actions\GetNewPlugins
 */
class GetNewPlugins
{

	/**
	 * @param \Change\Http\Event $event
	 */
	public function execute($event)
	{
		$pm = $event->getApplicationServices()->getPluginManager();
		$array = array();
		foreach($pm->getUnregisteredPlugins() as $plugin)
		{
			$array[] = $plugin->toArray();
		}

		$result = new ArrayResult();
		$result->setArray($array);
		$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);

		$event->setResult($result);
	}
}