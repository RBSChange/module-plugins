<?php
/**
 * Copyright (C) 2014 Ready Business System
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
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