<?php

namespace App\Command;

use Doctrine\DBAL\Exception;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Exception\ExceptionInterface;
use Symfony\Component\Console\Input\ArrayInput;
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
     * @throws ExceptionInterface
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $skipCptsUpdate = $input->getOption("skip-cpts-update");

        $output->writeln("Starting domain initialization...");

        if (!$skipCptsUpdate) {
            $updateCptCodesCommand = $this->getApplication()->find("app:update-cpt-codes");
            $updateCptCodesCommand->run(new ArrayInput([]), $output);
        }

        $output->writeln("Initializing domain default groups...");
        $initDefaultGroupsCommand = $this->getApplication()->find("domain:init-default-groups");
        $initDefaultGroupsCommand->run(new ArrayInput([]), $output);

        $output->writeln("Initializing domain default users...");
        $initDefaultUsersCommand = $this->getApplication()->find("domain:init-default-users");
        $initDefaultUsersCommand->run(new ArrayInput([]), $output);

        $output->writeln("Domain initialized");

        return Command::SUCCESS;
    }
}
