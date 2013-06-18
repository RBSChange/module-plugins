<?php
/**
 * Created by JetBrains PhpStorm.
 * User: fstauffer
 * Date: 18/06/13
 * Time: 14:32
 * To change this template use File | Settings | File Templates.
 */

namespace Rbs\Plugins\Std;


use Change\Plugins\Plugin;
use Change\Stdlib\File;
use Zend\Json\Json;

class Signtool
{
	/**
	 * @var \Change\Application
	 */
	protected $application;

	/**
	 * @param \Change\Application $application
	 */
	function __construct(\Change\Application $application)
	{
		$this->application = $application;
		if (!function_exists('openssl_pkcs7_sign'))
		{
			throw new \RuntimeException("You need the openssl PHP extension to sign plugins");
		}
	}

	/**
	 * @param Plugin $plugin
	 * @param string $privateKeyPath
	 * @param string $certPath
	 * @param string $passPhrase
	 * @return bool
	 */
	public function sign(Plugin $plugin, $privateKeyPath, $certPath, $passPhrase = "")
	{
		$normalizedPrivateKeyPath = (DIRECTORY_SEPARATOR == '/' ? \Zend\Uri\File::fromUnixPath(realpath($privateKeyPath)) : \Zend\Uri\File::fromWindowsPath(realpath($privateKeyPath)));
		$normalizedCertPath = (DIRECTORY_SEPARATOR == '/' ? \Zend\Uri\File::fromUnixPath(realpath($certPath)) : \Zend\Uri\File::fromWindowsPath(realpath($certPath)));
		$path = $plugin->getBasePath();
		$manifestPath = tempnam($this->application->getWorkspace()->tmpPath(), 'manifest');
		$manifestInfo = $this->buildManifestInfo($path, $manifestInfo);
		File::write($manifestPath, Json::prettyPrint(Json::encode($manifestInfo)));
		return openssl_pkcs7_sign(
			$manifestPath,
			$plugin->getBasePath() . DIRECTORY_SEPARATOR . ".signature.smime",
			$normalizedCertPath->toString(),
			array($normalizedPrivateKeyPath->toString(), $passPhrase),
			array()
		);
	}

	/**
	 * @param Plugin $plugin
	 * @throws \RuntimeException
	 */
	public function verify(Plugin $plugin, &$parsingResult = array())
	{
		$signatureFilePath = $plugin->getBasePath() . DIRECTORY_SEPARATOR . ".signature.smime";
		if (!is_readable($signatureFilePath))
		{
			throw new \RuntimeException('Signature file not found (path = ' . $signatureFilePath . ')');
		}
		$pemPath = $this->application->getWorkspace()->pluginsModulesPath('Rbs', 'Plugins', 'Assets', 'rbschangeca.pem');
		$certificatePath = tempnam($this->application->getWorkspace()->tmpPath(), 'certificate');
		$manifestPath = tempnam($this->application->getWorkspace()->tmpPath(), 'manifest');
		$result = openssl_pkcs7_verify(
			$signatureFilePath,
			PKCS7_DETACHED,
			$certificatePath,
			array($pemPath),
			$pemPath,
			$manifestPath);
		if ($result !== true)
		{
			$parsingResult['error'] = array('code' => -1, 'message' => 'The plugin signature has been tampered');
		}
		$manifestInfo = $this->buildManifestInfo($plugin->getBasePath());
		$signedManifestInfo = Json::decode(file_get_contents($manifestPath), Json::TYPE_ARRAY);
		if ($result !== true)
		{
			$parsingResult['error'] = array('code' => -2, 'message' => 'The plugin has been tampered');
		}

		foreach ($signedManifestInfo as $relativePath => $checksum)
		{
			if ($manifestInfo[$relativePath] !== $checksum)
			{
				$parsingResult['error'] = array('code' => -2, 'message' => 'The plugin has been tampered');
			}
			unset($manifestInfo[$relativePath]);
		}
		if (count($manifestInfo) !== 0)
		{
			$parsingResult['error'] = array('code' => -2, 'message' => 'The plugin has been tampered');
		}
		$parsingResult['certificate'] = openssl_x509_parse(file_get_contents($certificatePath));
		return !isset($parsingResult['error']);
	}

	/**
	 * @param $path
	 * @param $manifestInfo
	 * @return mixed
	 */
	protected function buildManifestInfo($path)
	{
		$manifestInfo = array();
		$pathLength = strlen($path);
		$iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path));
		foreach ($iterator as $fileInfo)
		{
			/* @var $fileInfo \SplFileInfo */
			if ($fileInfo->isFile() && strpos($fileInfo->getFilename(), '.') !== 0)
			{
				$manifestInfo[substr($fileInfo->getPathname(), $pathLength + 1)] = sha1_file($fileInfo->getPathname());
			}
		}
		return $manifestInfo;
	}
}