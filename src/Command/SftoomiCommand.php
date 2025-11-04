<?php

namespace App\Command;

use App\Class\Core\DB\Connection;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Output\OutputInterface;

abstract class SftoomiCommand extends Command
{
    public function __construct(protected readonly Connection $connection)
    {
        parent::__construct();
    }

    /**
     * Create and return progress bar to output interface.
     *
     * @param OutputInterface $output
     * @param int             $count
     *
     * @return ProgressBar
     */
    protected function createProgressBar(OutputInterface $output, int $count): ProgressBar
    {
        $progress = new ProgressBar($output, $count);
        $progress->setBarCharacter('<fg=magenta>=</>');
        $progress->setRedrawFrequency(floor($count / 100));
        $progress->start();

        return $progress;
    }
}
