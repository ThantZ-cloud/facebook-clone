# Create Prisma Model

## Purpose
Add a new model to the Prisma schema with proper relations and run migration.

## When to Use
- Adding new database tables
- Creating relations between models
- Updating existing schema

## Steps

### 1. Gather Requirements
Ask user:
- Model name
- Fields needed (with types)
- Relations to other models
- Unique constraints
- Default values

### 2. Add Model to Schema
```prisma
// prisma/schema.prisma

model {ModelName} {
  id        Int      @id @default(autoincrement())
  // Add fields here
  field1    String
  field2    Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  userId    Int
  user      User     @relation(fields: [userId], references: [id])

  // Indexes (if needed)
  @@index([userId])
}
```

### 3. Update Related Models
```prisma
// Add relation to User model
model User {
  // ... existing fields ...
  {modelName}s  {ModelName}[]
}
```

### 4. Run Migration
```bash
cd server
npx prisma migrate dev --name add_{model_name}
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

## Common Field Types
| Prisma | MySQL | Example |
|--------|-------|---------|
| `String` | VARCHAR(191) | `name String` |
| `String @db.Text` | TEXT | `content String @db.Text` |
| `Int` | INT | `age Int` |
| `Float` | DOUBLE | `price Float` |
| `Boolean` | BOOLEAN | `isActive Boolean` |
| `DateTime` | DATETIME | `createdAt DateTime` |
| `Json` | JSON | `metadata Json` |

## Common Attributes
| Attribute | Purpose |
|-----------|---------|
| `@id` | Primary key |
| `@default(autoincrement())` | Auto-increment |
| `@default(now())` | Current timestamp |
| `@unique` | Unique constraint |
| `@db.Text` | Long text field |
| `@relation(...)` | Foreign key relation |
| `@@unique([field1, field2])` | Composite unique |
| `@@index([field])` | Add index |

## Output
- Updated schema.prisma
- Migration file
- Updated Prisma client
