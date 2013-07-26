<?php
namespace Rbs\Plugins\Http\Rest\Actions;

use Change\Http\Rest\Result\ArrayResult;
use Zend\Http\Response as HttpResponse;

/**
 * @name \Rbs\Plugins\Http\Rest\Actions\GetRegisteredPlugins
 */
class GetRegisteredPlugins
{

	/**
	 * @param \Change\Http\Event $event
	 */
	public function execute($event)
	{
		$pm = $event->getApplicationServices()->getPluginManager();
		$array = array();
		$i = 0;
		foreach($pm->getRegisteredPlugins() as $plugin)
		{
			$array[] = $plugin->toArray();
			$array[$i]['registrationDate'] = $array[$i]['registrationDate']->format(\DateTime::ISO8601);
			$i++;
		}

		$result = new ArrayResult();
		$result->setArray($array);
		$result->setHttpStatusCode(HttpResponse::STATUS_CODE_200);

		$event->setResult($result);
	}
}