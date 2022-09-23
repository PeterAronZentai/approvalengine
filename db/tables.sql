CREATE TABLE dbo.Client
(
  [CID] int IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED
  , ANumericalValue int null
  , GID int not null 
  , [Name] nvarchar(100) NOT NULL
  , [RealName] nvarchar(100) NOT NULL
  , [ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
  , [ValidTo] datetime2 GENERATED ALWAYS AS ROW END
  , PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.ClientHistory));



CREATE TABLE dbo.ClientGroup
(
  [GID] int IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED
  , [Name] nvarchar(100) NOT NULL
  , [ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
  , [ValidTo] datetime2 GENERATED ALWAYS AS ROW END
  , PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.ClientGroupHistory));

alter table Client add foreign key (GID) references ClientGroup(GID)

CREATE TABLE dbo.Address
(
  [AID] int IDENTITY(1,1) NOT NULL PRIMARY KEY CLUSTERED
  , CID int not null
  , [Text] nvarchar(100) NOT NULL
  , [ValidFrom] datetime2 GENERATED ALWAYS AS ROW START
  , [ValidTo] datetime2 GENERATED ALWAYS AS ROW END
  , PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
)
WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.AddressHistory));



create table ChangeRequest
(
    CRID int identity(1,1) not null primary KEY
    , ClientID int not null
    , ChangeArea nvarchar(20)
    , ChanteRequestPayload nvarchar(max)
)

create table ApprovalResponse
(
    ARID int identity(1,1) not null primary KEY
    , CRID int not null
    , ApprovalResponsePayload nvarchar(max)
)
