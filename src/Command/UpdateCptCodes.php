<?php

namespace App\Command;

use Doctrine\DBAL\Exception;
use RuntimeException;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class UpdateCptCodes extends SftoomiCommand
{
    private const string LAST_CPT_LIST_PATH = __DIR__ . "/../../data/lists/cpt/last.txt";
    private const string CPT_TABLE_NAME = "cpts";

    protected function configure(): void
    {
        $this
            ->setName("app:update-cpt-codes")
            ->setDescription("Update cpt codes list in database");
    }

    /**
     * @throws Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln("Loading CPTs dictionary...");
        $data = $this->loadCptsDictionary();
        $output->writeln("CPTs dictionary loaded");

        $sql = sprintf("show tables like '%s'", self::CPT_TABLE_NAME);
        $tableExists = !empty($this->connection->fetchCol($sql));

        if ($tableExists) {
            $this->connection->execute("drop table %s" . self::CPT_TABLE_NAME);
        }

        $sql = sprintf(
                "create table %s (
                    id int primary key auto_increment,
                    code varchar(10),
                    short_name varchar(100),
                    full_name varchar(255),
                    key code (code),
                    index cpt(id, code)
                )",
            self::CPT_TABLE_NAME
        );

        $this->connection->execute($sql);

        $output->writeln("Starting CPT codes filling in database...");
        $progress = $this->createProgressBar($output, count($data));

        foreach ($data as $cpt) {
            if (!$cpt["is_code"]) {
                $progress->advance();

                continue;
            }

            $this->connection->insert(
                self::CPT_TABLE_NAME,
                [
                    "id"         => $cpt["id"],
                    "code"       => $cpt["code"],
                    "short_name" => $cpt["short_name"],
                    "full_name"  => $cpt["full_name"]
                ]
            );

            $progress->advance();
        }

        $progress->finish();
        $output->writeln("\nOperation successfully completed");

        return Command::SUCCESS;
    }

    private function loadCptsDictionary(): array
    {
        $filePointer = @fopen(self::LAST_CPT_LIST_PATH, "r");
        if ($filePointer === false) {
            throw new RuntimeException("Unable to read CPTs file: " . self::LAST_CPT_LIST_PATH);
        }

        $columns = [
            [ "name" => "id",         "position" =>  0, "length" =>   5 ],
            [ "name" => "code",       "position" =>  6, "length" =>   7 ],
            [ "name" => "is_code",    "position" => 14, "length" =>   1 ],
            [ "name" => "short_name", "position" => 16, "length" =>  60 ],
            [ "name" => "full_name",  "position" => 77, "length" => 300 ]
        ];

        $records = [];
        while (!feof($filePointer)) {
            $line = fgets($filePointer, 1024);

            if (empty(trim($line))) {
                continue;
            }

            $record = [];
            foreach ($columns as $column) {
                $value = trim(substr($line, $column["position"], $column["length"]));
                $value = preg_replace('/\s\s+/', " ", $value); // remove multiple spaces
                $record[$column["name"]] = $value;
                if ($column["name"] == "code" && strlen($value) > 3) {
                    $record[$column["name"]] = substr_replace($record[$column["name"]], ".", 3, 0);
                }
            }
            $records[] = $record;
        }

        fclose($filePointer);

        return $records;
    }
}
