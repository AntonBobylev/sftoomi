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
                "skip-cpts-update",
                null,
                InputOption::VALUE_NONE,
                "Skip cpts update if this operation is not required"
            );
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $skipCptsUpdate = $input->getOption("skip-cpts-update");

        $output->writeln("Starting domain initialization...");

        if (!$skipCptsUpdate) {
            new UpdateCptCodes($this->connection, $this->filesystem)->execute($input, $output);
        }

        $output->writeln("Domain initialized");

        return Command::SUCCESS;
    }
}
