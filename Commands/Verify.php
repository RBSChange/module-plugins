<?php
/**
 * Copyright (C) 2014 Ready Business System
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
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
		$applicationServices = $event->getApplicationServices();

		$response = $event->getCommandResponse();

		$type = $event->getParam('type');
		$vendor = $event->getParam('vendor');
		$name = $event->getParam('name');

		$allPlugins = $applicationServices->getPluginManager()->scanPlugins();
		$plugins = array_filter($allPlugins, function(\Change\Plugins\Plugin $plugin) use ($type, $vendor, $name) {
			return $plugin->getType() === $type && $plugin->getVendor() === $vendor && $plugin->getShortName() === $name;
		});
		$plugin = array_pop($plugins);

		if ($plugin === null)
		{
			$response->addErrorMessage("Plugin not found.");
		}
		else
		{
			try
			{
				$signTool = new Signtool($application);
				$signToolResult = $signTool->verify($plugin);

				if ($signToolResult['valid'])
				{
					$response->addInfoMessage("Plugin is genuine!");
					$response->setData($signToolResult['parsing']['certificate']);
				}
				else
				{
					$response->addErrorMessage("Plugin is not genuine : " . $signToolResult['parsing']['error']['message']);
				}
			}
			catch (\RuntimeException $e)
			{
				$response->addErrorMessage("Plugin is not genuine : " . $e->getMessage());
			}
		}
	}
}