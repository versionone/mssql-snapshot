SELECT  spid SPID,
        RTRIM(sp.[status]) Status,
        RTRIM(loginame) [Login],
        RTRIM(hostname) HostName,
        RTRIM(blocked) BlockedBy,
        RTRIM(sd.name) DatabaseName,
        RTRIM(cmd) Command,
        cpu CPUTime,
        physical_io DiskIO,
        RTRIM(last_batch) LastBatch,
        RTRIM([program_name]) ProgramName
FROM master.dbo.sysprocesses sp
	JOIN master.dbo.sysdatabases sd ON sp.dbid = sd.dbid
WHERE
	sd.name = @sourceDbName
ORDER BY spid
