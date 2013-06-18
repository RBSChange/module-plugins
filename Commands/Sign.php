<?php
namespace Rbs\Plugins\Commands;

use Rbs\Plugins\Std\Signtool;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

/**
 * @name \Rbs\Plugins\Commands\Sign
 */
class Sign extends \Change\Application\Console\ChangeCommand
{
	/**
	 */
	protected function configure()
	{
		// Configure your command here
		$this->setDescription("Sign plugin for distribution");
		$this->addOption('key', 'k', InputOption::VALUE_REQUIRED, 'vendor private key');
		$this->addOption('cert', 'c', InputOption::VALUE_REQUIRED, 'vendor  certificate');
		$this->addOption('passphrase', 'p', InputOption::VALUE_OPTIONAL, 'vendor certificate passphrase', '');
		$this->addOption('type', 't', InputOption::VALUE_OPTIONAL, 'type of plugin', 'module');
		$this->addOption('vendor', 'e', InputOption::VALUE_OPTIONAL, 'vendor of the plugin', 'project');
		$this->addArgument('name', InputArgument::REQUIRED, 'short name of the plugin');
	}

	/**
	 * @return bool
	 */
	public function isDevCommand()
	{
		return true;
	}

	/**
	 * @param InputInterface $input
	 * @param OutputInterface $output
	 * @throws \LogicException
	 */
	protected function execute(InputInterface $input, OutputInterface $output)
	{
		// Code of you command here
		if ($input->getOption('type') === "theme")
		{
			$plugin = $this->getChangeApplicationServices()->getPluginManager()->getTheme($input->getOption('vendor'), $input->getArgument('name'));
		}
		else
		{
			$plugin = $this->getChangeApplicationServices()->getPluginManager()->getModule($input->getOption('vendor'), $input->getArgument('name'));
		}

		if ($plugin === null)
		{
			throw new \RuntimeException("Plugin not found");
		}
		else
		{
			$signtool = new Signtool($this->getChangeApplication());
			$result = $signtool->sign($plugin, $input->getOption('key'), $input->getOption('cert'), $input->getOption('passphrase'));
			if (!$result)
			{
				throw new \RuntimeException("Could not sign plugin");
			}
		}
		$output->writeln("<info>Plugin signed.</info>");
	}
}