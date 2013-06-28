<?php
namespace Rbs\Plugins\Commands;

use Change\Commands\Events\Event;
use Rbs\Plugins\Std\Signtool;

/**
 * @name \Rbs\Plugins\Commands\Verify
 */
class Verify
{
	/**
	 * @param Event $event
	 */
	public function execute(Event $event)
	{
		$application = $event->getApplication();
		$applicationServices = new \Change\Application\ApplicationServices($application);

		$type = $event->getParam('type');
		$vendor = $event->getParam('vendor');
		$name = $event->getParam('name');
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
				$event->addErrorMessage("Plugin not found.");
				return;
			}

			$signTool = new Signtool($this->getChangeApplication());
			$result = $signTool->verify($plugin);
			if ($result)
			{
				$event->addInfoMessage('Plugin is genuine!');
			}
			else
			{
				$event->addErrorMessage('Plugin is not genuine.');
			}
		}
		catch (\Exception $e)
		{
			$applicationServices->getLogging()->exception($e);
			$event->addErrorMessage($e->getMessage());
		}
	}
}