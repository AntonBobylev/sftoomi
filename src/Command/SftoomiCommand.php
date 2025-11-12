<?php

namespace App\Command;

use App\Class\Core\DB\Connection;
use Psr\Log\LogLevel;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\ProgressBar;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Filesystem\Filesystem;

abstract class SftoomiCommand extends Command
{
    public function __construct(
        protected readonly Connection $connection,
        protected readonly Filesystem $filesystem
    ) {
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
        $progress->setBarCharacter("<fg=magenta>=</>");
        $progress->setRedrawFrequency(floor($count / 100));
        $progress->start();

        return $progress;
    }

    protected function log(string $message, OutputInterface $output, string $level = LogLevel::INFO): void
    {
        $message = match($level) {
            LogLevel::ERROR   => sprintf("<fg=red>%s</>", $message),
            LogLevel::WARNING => sprintf("<fg=yellow>%s</>", $message),
            default           => $message
        };

        $output->writeln($message);
    }
}
