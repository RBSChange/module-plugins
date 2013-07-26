<?php
namespace Rbs\Plugins\Http\Rest\Actions;

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
			if ($type === "theme")
			{
				$plugin = $applicationServices->getPluginManager()->getTheme($vendor, $name);
			}
			else
			{
				$plugin = $applicationServices->getPluginManager()->getModule($vendor, $name);
			}

			if ($plugin === null)
			{
				$signResult['errors'][] = 'Plugin not found.';
				return;
			}

			$signTool = new Signtool($application);
			$signResult = array_merge($signResult, $signTool->verify($plugin));
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