# Field Infrastructure v1

## Products
- FieldOS = shared platform foundation
- FieldRate = estimating and production intelligence
- FieldBuild = builder / tool creation
- Nebula = field intelligence / PM / alerts / decisions

## Shared Core
All products must share:
- projects
- tasks
- logs
- snapshots
- errors
- AI gateway
- Supabase connection

## Current Core Files
- src/core/types.ts
- src/core/constants.ts
- src/core/errors.ts
- src/core/supabase.ts
- src/core/storage.ts
- src/core/history.ts
- src/core/ai.ts
- src/core/index.ts

## Rules
- one feature at a time
- no unrelated edits
- no duplicated logic
- no product-specific logic inside core
- core is shared platform infrastructure
