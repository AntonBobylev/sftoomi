<?php

namespace App\Command;

use Doctrine\DBAL\Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class InitDomain extends SftoomiCommand
{
    protected function configure(): void
    {
        $this
            ->setName("app:init-domain")
            ->setDescription("Initialize freshly added domain")
            ->addOption(
                "update-cpts",
                "-uc",
                InputOption::VALUE_NONE,
                "Update of cpts required"
            )
        ;
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $mustUpdateCpts = $input->getOption("update-cpts");

        $output->writeln("Starting domain initialization...");

        if ($mustUpdateCpts) {
            new UpdateCptCodes($this->connection)->execute($input, $output);
        }

        $output->writeln("Domain initialized");

        return Command::SUCCESS;
    }
}
