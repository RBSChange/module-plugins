<?php
namespace Rbs\Plugins\Commands;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Rbs\Plugins\Std\Signtool;

/**
 * @name \Rbs\Plugins\Commands\Verify
 */
class Verify extends \Change\Application\Console\ChangeCommand
{
	/**
	 */
	protected function configure()
	{
		$this->setDescription("Check signed plugin integrity");
		$this->addOption('type', 't', InputOption::VALUE_OPTIONAL, 'type of plugin', 'module');
		$this->addOption('vendor', 'e', InputOption::VALUE_OPTIONAL, 'vendor of the plugin', 'project');
		$this->addArgument('name', InputArgument::REQUIRED, 'short name of the plugin');
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

		$signtool = new Signtool($this->getChangeApplication());
		$result = $signtool->verify($plugin);
		if ($result)
		{
			$output->writeln("<info>Plugin is genuine!</info>");
		}
		else
		{
			$output->writeln("<error>Plugin is not genuine.</error>");
		}
	}
}