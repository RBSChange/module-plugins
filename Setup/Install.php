<?php
namespace Rbs\Plugins\Setup;

/**
 * @name \Rbs\Plugins\Setup\Install
 */
class Install
{
	/**
	 * @param \Change\Plugins\Plugin $plugin
	 * @param \Change\Application $application
	 * @throws \RuntimeException
	 */
	public function executeApplication($plugin, $application)
	{
		/* @var $config \Change\Configuration\EditableConfiguration */
		$config = $application->getConfiguration();
		$config->addPersistentEntry('Change/Events/Commands/Rbs_Plugins', '\\Rbs\\Plugins\\Commands\\ListenerAggregate');
	}
}
