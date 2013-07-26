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
		$config->addPersistentEntry('Change/Events/Rbs/Admin/Rbs_Plugins', '\\Rbs\\Plugins\\Admin\\Register');
		$config->addPersistentEntry('Change/Events/Http/Rest/Rbs_Plugins', '\\Rbs\\Plugins\\Http\\Rest\\ListenerAggregate');
	}

	/**
	 * @param \Change\Plugins\Plugin $plugin
	 */
	public function finalize($plugin)
	{
		$plugin->setConfigurationEntry('locked', true);
	}
}
