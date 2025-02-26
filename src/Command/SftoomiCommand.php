<?php

namespace App\Command;

use Doctrine\DBAL\Connection;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Output\OutputInterface;

class SftoomiCommand extends Command
{
    public function __construct(protected readonly Connection $connection)
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setName('app:sftoomi')
            ->setHidden();
    }

    protected function createProgressBar(OutputInterface $output, int $count): ProgressBar
    {
        $progress = new ProgressBar($output, $count);
        $progress->setBarCharacter('<fg=magenta>=</>');
        $progress->setRedrawFrequency(floor($count / 100));
        $progress->start();

        return $progress;
    }
}
