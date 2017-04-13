SELECT  spid SPID,
        sp.[status] Status,
        loginame [Login],
        hostname HostName,
        blocked BlockedBy,
        sd.name DatabaseName,
        cmd Command,
        cpu CPUTime,
        physical_io DiskIO,
        last_batch LastBatch,
        [program_name] ProgramName
FROM master.dbo.sysprocesses sp
	JOIN master.dbo.sysdatabases sd ON sp.dbid = sd.dbid
WHERE
	sd.name = @sourceDbName
ORDER BY spid
