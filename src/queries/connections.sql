SELECT  spid,
        sp.[status],
        loginame [Login],
        hostname,
        blocked BlkBy,
        sd.name DBName,
        cmd Command,
        cpu CPUTime,
        physical_io DiskIO,
        last_batch LastBatch,
        [program_name] ProgramName
FROM master.dbo.sysprocesses sp
	JOIN master.dbo.sysdatabases sd ON sp.dbid = sd.dbid
WHERE
	sd.name = @sourceDbName
		AND spid != @@SPID
ORDER BY spid