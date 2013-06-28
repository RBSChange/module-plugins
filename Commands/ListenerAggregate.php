<?php
namespace Rbs\Plugins\Commands;

use Change\Commands\Events\Event;
use Zend\EventManager\EventManagerInterface;
use Zend\Json\Json;

/**
* @name \Rbs\Plugins\Commands\ListenerAggregate
*/
class ListenerAggregate implements \Zend\EventManager\ListenerAggregateInterface
{

	/**
	 * Attach one or more listeners
	 * Implementors may add an optional $priority argument; the EventManager
	 * implementation will pass this to the aggregate.
	 * @param EventManagerInterface $events
	 * @return void
	 */
	public function attach(EventManagerInterface $events)
	{
		$callback = function (Event $event)
		{
			$commandConfigPath = __DIR__ . '/Assets/config.json';
			if (is_file($commandConfigPath))
			{
				return Json::decode(file_get_contents($commandConfigPath), Json::TYPE_ARRAY);
			}
		};
		$events->attach('config', $callback);

		$callback = function ($event)
		{
			$cmd = new Sign();
			$cmd->execute($event);
		};
		$events->attach('rbs_plugins:sign', $callback);

		$callback = function ($event)
		{
			$cmd = new Verify();
			$cmd->execute($event);
		};
		$events->attach('rbs_plugins:verify', $callback);
	}

	/**
	 * Detach all previously attached listeners
	 * @param EventManagerInterface $events
	 * @return void
	 */
	public function detach(EventManagerInterface $events)
	{
		// TODO: Implement detach() method.
	}
}