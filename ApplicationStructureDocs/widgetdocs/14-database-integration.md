# Database Integration

This guide explains how widgets should interact with database systems, including both server-side databases (MySQL, PostgreSQL) and client-side storage options (SQLite, IndexedDB).

## Core Principles

When integrating with databases, widgets should follow these principles:

1. **Backend API First**
   - Widgets should primarily interact with databases through the backend API
   - Direct database connections from widgets should be avoided for security reasons
   - Follow RESTful or GraphQL patterns for data operations

2. **Data Abstraction**
   - Abstract database interactions behind service/repository layers
   - Avoid exposing database details in widget components
   - Create clear data models that map to database schemas

3. **Offline Capabilities**
   - Implement client-side storage for offline functionality when needed
   - Synchronize with server when connectivity is restored
   - Manage conflicts appropriately

4. **Security Focus**
   - Never store sensitive data in client-side storage without encryption
   - Always validate data on the server side
   - Follow principle of least privilege for database operations

## Server-Side Database Integration

### API Service Pattern

The recommended pattern for interacting with server-side databases:

```tsx
// api/userService.ts
import axios from 'axios';
import { User, UserCreate, UserUpdate } from '../types';

const API_BASE = '/api/v1';

export const UserService = {
  // Get all users from MySQL database through API
  async getAll(): Promise<User[]> {
    const response = await axios.get(`${API_BASE}/users`);
    return response.data;
  },
  
  // Get single user by ID
  async getById(id: string): Promise<User> {
    const response = await axios.get(`${API_BASE}/users/${id}`);
    return response.data;
  },
  
  // Create new user
  async create(user: UserCreate): Promise<User> {
    const response = await axios.post(`${API_BASE}/users`, user);
    return response.data;
  },
  
  // Update existing user
  async update(id: string, changes: UserUpdate): Promise<User> {
    const response = await axios.patch(`${API_BASE}/users/${id}`, changes);
    return response.data;
  },
  
  // Delete user
  async delete(id: string): Promise<void> {
    await axios.delete(`${API_BASE}/users/${id}`);
  },
  
  // Custom query with filters that maps to a complex SQL query
  async search(params: UserSearchParams): Promise<User[]> {
    const response = await axios.get(`${API_BASE}/users/search`, { 
      params 
    });
    return response.data;
  }
};
```

### Data Repository Pattern

For more complex database interactions, implement a repository pattern:

```tsx
// repositories/userRepository.ts
import { UserService } from '../api/userService';
import { User, UserCreate, UserUpdate, UserSearchParams } from '../types';

export class UserRepository {
  // Cache for users
  private userCache: Record<string, User> = {};
  
  // Get all users with optional caching
  async getAll(useCache = true): Promise<User[]> {
    const users = await UserService.getAll();
    
    if (useCache) {
      // Update cache
      users.forEach(user => {
        this.userCache[user.id] = user;
      });
    }
    
    return users;
  }
  
  // Get user by ID with caching
  async getById(id: string, useCache = true): Promise<User> {
    // Check cache first
    if (useCache && this.userCache[id]) {
      return this.userCache[id];
    }
    
    const user = await UserService.getById(id);
    
    if (useCache) {
      this.userCache[id] = user;
    }
    
    return user;
  }
  
  // Create user and update cache
  async create(user: UserCreate): Promise<User> {
    const newUser = await UserService.create(user);
    this.userCache[newUser.id] = newUser;
    return newUser;
  }
  
  // Update user and cache
  async update(id: string, changes: UserUpdate): Promise<User> {
    const updatedUser = await UserService.update(id, changes);
    this.userCache[id] = updatedUser;
    return updatedUser;
  }
  
  // Delete user and update cache
  async delete(id: string): Promise<void> {
    await UserService.delete(id);
    delete this.userCache[id];
  }
  
  // Complex search
  async search(params: UserSearchParams): Promise<User[]> {
    return UserService.search(params);
  }
  
  // Clear cache
  clearCache(): void {
    this.userCache = {};
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
```

### Using Repositories in Widget Components

```tsx
// UserList.tsx
import React, { useEffect, useState } from 'react';
import { userRepository } from '../repositories/userRepository';
import { User } from '../types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await userRepository.getAll();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load users'));
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Component rendering logic
};
```

## Client-Side Database Integration

For offline capabilities or local data storage, widgets can use:

1. **IndexedDB** - For complex structured data
2. **Web SQL / SQLite** - Through libraries or wrappers
3. **LocalStorage** - For simple key-value pairs
4. **Dexie.js** - A wrapper around IndexedDB with a cleaner API

### IndexedDB Integration

```tsx
// db/database.ts
import Dexie from 'dexie';
import { User, Task } from '../types';

class AppDatabase extends Dexie {
  users: Dexie.Table<User, string>;
  tasks: Dexie.Table<Task, string>;
  
  constructor() {
    super('WidgetDatabase');
    
    // Define tables and indices
    this.version(1).stores({
      users: 'id, name, email, [status+role]',
      tasks: 'id, userId, title, completed, dueDate'
    });
    
    // Type tables
    this.users = this.table('users');
    this.tasks = this.table('tasks');
  }
}

export const db = new AppDatabase();
```

### Local Data Repository

Create a repository that works with local database:

```tsx
// repositories/localUserRepository.ts
import { db } from '../db/database';
import { User, UserCreate, UserUpdate } from '../types';

export class LocalUserRepository {
  // Get all users
  async getAll(): Promise<User[]> {
    return db.users.toArray();
  }
  
  // Get user by ID
  async getById(id: string): Promise<User | undefined> {
    return db.users.get(id);
  }
  
  // Create user
  async create(user: UserCreate): Promise<User> {
    const newUser = {
      id: crypto.randomUUID(), // Generate client-side ID
      ...user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending' as const // Marked for server sync
    };
    
    await db.users.add(newUser);
    return newUser;
  }
  
  // Update user
  async update(id: string, changes: UserUpdate): Promise<User> {
    const user = await db.users.get(id);
    
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = {
      ...user,
      ...changes,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending' as const // Marked for server sync
    };
    
    await db.users.put(updatedUser);
    return updatedUser;
  }
  
  // Delete user
  async delete(id: string): Promise<void> {
    await db.users.delete(id);
  }
  
  // Search users
  async search(params: { name?: string, email?: string, status?: string }): Promise<User[]> {
    let collection = db.users.toCollection();
    
    if (params.name) {
      collection = collection.filter(user => 
        user.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }
    
    if (params.email) {
      collection = collection.filter(user => 
        user.email.toLowerCase().includes(params.email!.toLowerCase())
      );
    }
    
    if (params.status) {
      collection = collection.filter(user => user.status === params.status);
    }
    
    return collection.toArray();
  }
}

// Export singleton instance
export const localUserRepository = new LocalUserRepository();
```

### Synchronization with Server

Implement synchronization between local and server databases:

```tsx
// sync/syncService.ts
import { db } from '../db/database';
import { UserService } from '../api/userService';
import { networkStatus } from '../utils/network';

export class SyncService {
  // Sync all pending changes to server
  async syncPendingChanges(): Promise<void> {
    // Only sync when online
    if (!networkStatus.isOnline) {
      return;
    }
    
    // Find all users that need to be synced
    const pendingUsers = await db.users
      .where('syncStatus')
      .equals('pending')
      .toArray();
    
    // Process each pending user
    for (const user of pendingUsers) {
      try {
        // User has a temp ID (created offline)
        if (user.id.startsWith('local-')) {
          // Create on server and get real ID
          const serverUser = await UserService.create(user);
          
          // Replace local record with server record
          await db.users.delete(user.id);
          await db.users.add({
            ...serverUser,
            syncStatus: 'synced'
          });
          
          // Update related records (like tasks)
          await db.tasks
            .where('userId')
            .equals(user.id)
            .modify({ userId: serverUser.id });
        } 
        // Regular update
        else {
          await UserService.update(user.id, user);
          
          // Mark as synced
          await db.users.update(user.id, { 
            syncStatus: 'synced' 
          });
        }
      } catch (error) {
        console.error(`Failed to sync user ${user.id}`, error);
        
        // Mark as sync failed
        await db.users.update(user.id, { 
          syncStatus: 'failed',
          syncError: error.message 
        });
      }
    }
  }
  
  // Pull changes from server
  async pullChanges(): Promise<void> {
    // Only sync when online
    if (!networkStatus.isOnline) {
      return;
    }
    
    // Get all users from server
    const serverUsers = await UserService.getAll();
    
    // Get local users for comparison
    const localUsers = await db.users.toArray();
    const localUserMap = new Map(
      localUsers.map(user => [user.id, user])
    );
    
    // Process server users
    for (const serverUser of serverUsers) {
      const localUser = localUserMap.get(serverUser.id);
      
      // User doesn't exist locally
      if (!localUser) {
        await db.users.add({
          ...serverUser,
          syncStatus: 'synced'
        });
        continue;
      }
      
      // User exists but needs update (check timestamps)
      if (
        new Date(serverUser.updatedAt) > new Date(localUser.updatedAt) &&
        localUser.syncStatus !== 'pending'
      ) {
        await db.users.put({
          ...serverUser,
          syncStatus: 'synced'
        });
      }
    }
  }
  
  // Start periodic sync
  startPeriodicSync(intervalMs = 60000): () => void {
    const intervalId = setInterval(() => {
      this.syncPendingChanges();
      this.pullChanges();
    }, intervalMs);
    
    // Return function to stop sync
    return () => clearInterval(intervalId);
  }
}

// Export singleton instance
export const syncService = new SyncService();
```

### Using Local Database in Components

```tsx
// UserList.tsx with offline support
import React, { useEffect, useState } from 'react';
import { localUserRepository } from '../repositories/localUserRepository';
import { syncService } from '../sync/syncService';
import { networkStatus } from '../utils/network';
import { User } from '../types';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!networkStatus.isOnline);
  
  // Load users from local DB
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await localUserRepository.getAll();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Start sync process
  useEffect(() => {
    // Initial sync when component mounts
    syncService.pullChanges();
    
    // Setup periodic sync
    const stopSync = syncService.startPeriodicSync();
    
    // Listen for network status changes
    const handleNetworkChange = (online: boolean) => {
      setIsOffline(!online);
      
      // Try to sync immediately when coming back online
      if (online) {
        syncService.syncPendingChanges();
        syncService.pullChanges();
      }
    };
    
    networkStatus.addListener(handleNetworkChange);
    
    // Cleanup
    return () => {
      stopSync();
      networkStatus.removeListener(handleNetworkChange);
    };
  }, []);
  
  // Handle creating a user (works offline)
  const handleCreateUser = async (userData) => {
    try {
      const newUser = await localUserRepository.create(userData);
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      // Try to sync immediately if online
      if (networkStatus.isOnline) {
        syncService.syncPendingChanges();
      }
    } catch (error) {
      console.error('Failed to create user', error);
    }
  };
  
  return (
    <div>
      {isOffline && (
        <div className="offline-banner">
          You are currently offline. Changes will sync when you reconnect.
        </div>
      )}
      
      <UserForm onSubmit={handleCreateUser} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="user-list">
          {users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              isPending={user.syncStatus === 'pending'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
```

## SQL Query Builder Pattern

For complex queries that need to be constructed on the client:

```tsx
// queryBuilder/sqlQueryBuilder.ts
export class SQLQueryBuilder {
  private table: string;
  private selects: string[] = ['*'];
  private whereConditions: string[] = [];
  private orderByColumns: string[] = [];
  private limitValue?: number;
  private offsetValue?: number;
  private params: any[] = [];
  
  constructor(table: string) {
    this.table = table;
  }
  
  select(columns: string[]): this {
    this.selects = columns;
    return this;
  }
  
  where(column: string, operator: string, value: any): this {
    this.whereConditions.push(`${column} ${operator} ?`);
    this.params.push(value);
    return this;
  }
  
  andWhere(column: string, operator: string, value: any): this {
    if (this.whereConditions.length === 0) {
      return this.where(column, operator, value);
    }
    
    this.whereConditions.push(`AND ${column} ${operator} ?`);
    this.params.push(value);
    return this;
  }
  
  orWhere(column: string, operator: string, value: any): this {
    if (this.whereConditions.length === 0) {
      return this.where(column, operator, value);
    }
    
    this.whereConditions.push(`OR ${column} ${operator} ?`);
    this.params.push(value);
    return this;
  }
  
  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderByColumns.push(`${column} ${direction}`);
    return this;
  }
  
  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }
  
  offset(offset: number): this {
    this.offsetValue = offset;
    return this;
  }
  
  buildQuery(): { sql: string, params: any[] } {
    let query = `SELECT ${this.selects.join(', ')} FROM ${this.table}`;
    
    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions[0]}`;
      
      for (let i = 1; i < this.whereConditions.length; i++) {
        query += ` ${this.whereConditions[i]}`;
      }
    }
    
    if (this.orderByColumns.length > 0) {
      query += ` ORDER BY ${this.orderByColumns.join(', ')}`;
    }
    
    if (this.limitValue !== undefined) {
      query += ` LIMIT ${this.limitValue}`;
    }
    
    if (this.offsetValue !== undefined) {
      query += ` OFFSET ${this.offsetValue}`;
    }
    
    return {
      sql: query,
      params: this.params
    };
  }
}
```

Usage with backend API:

```tsx
// Using query builder with API
import { SQLQueryBuilder } from '../queryBuilder/sqlQueryBuilder';
import axios from 'axios';

async function searchUsers(filters) {
  const queryBuilder = new SQLQueryBuilder('users')
    .select(['id', 'name', 'email', 'status']);
  
  if (filters.name) {
    queryBuilder.where('name', 'LIKE', `%${filters.name}%`);
  }
  
  if (filters.status) {
    queryBuilder.andWhere('status', '=', filters.status);
  }
  
  if (filters.sortBy) {
    queryBuilder.orderBy(filters.sortBy, filters.sortDirection || 'ASC');
  }
  
  queryBuilder.limit(filters.limit || 25).offset(filters.offset || 0);
  
  const { sql, params } = queryBuilder.buildQuery();
  
  // Send the query to the backend
  const response = await axios.post('/api/v1/query', {
    query: sql,
    params
  });
  
  return response.data;
}
```

## SQLite Integration (React Native / Electron Apps)

For React Native or Electron applications that need direct SQLite access:

```tsx
// db/sqliteDatabase.ts (for Electron or React Native)
import SQLite from 'react-native-sqlite-storage'; // or electron-sqlite3

export class SQLiteDatabase {
  private db: SQLite.SQLiteDatabase | null = null;
  
  async open(name: string): Promise<void> {
    this.db = await SQLite.openDatabase({
      name,
      location: 'default'
    });
    
    // Initialize schema
    await this.initialize();
  }
  
  private async initialize(): Promise<void> {
    if (!this.db) throw new Error('Database not opened');
    
    // Create tables if not exists
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        status TEXT,
        role TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        syncStatus TEXT
      )
    `);
    
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        dueDate TEXT,
        createdAt TEXT,
        updatedAt TEXT,
        syncStatus TEXT,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);
  }
  
  async query<T>(
    sql: string, 
    params: any[] = []
  ): Promise<T[]> {
    if (!this.db) throw new Error('Database not opened');
    
    const [results] = await this.db.executeSql(sql, params);
    
    const rows: T[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      rows.push(results.rows.item(i));
    }
    
    return rows;
  }
  
  async execute(
    sql: string, 
    params: any[] = []
  ): Promise<{ rowsAffected: number, insertId?: number }> {
    if (!this.db) throw new Error('Database not opened');
    
    const [results] = await this.db.executeSql(sql, params);
    
    return {
      rowsAffected: results.rowsAffected,
      insertId: results.insertId
    };
  }
  
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const sqliteDatabase = new SQLiteDatabase();
```

## Best Practices for Database Integration

1. **Use Database Abstraction**
   - Always abstract database access behind repositories
   - Keep SQL queries out of components
   - Create data models that map cleanly to database tables

2. **Implement Proper Error Handling**
   - Handle connection errors gracefully
   - Provide clear error messages for database operations
   - Add retry logic for transient failures

3. **Optimize for Performance**
   - Use pagination for large datasets
   - Implement caching strategies
   - Minimize database operations in UI rendering

4. **Ensure Data Integrity**
   - Validate data before saving to database
   - Implement transactions for related operations
   - Handle concurrent modifications properly

5. **Secure Database Access**
   - Never expose database credentials in client code
   - Use parameterized queries to prevent SQL injection
   - Apply proper access controls in the API

6. **Plan for Offline First**
   - Design with offline capabilities in mind
   - Implement robust synchronization strategies
   - Handle conflict resolution properly

## Conclusion

By using these patterns for database integration, widgets can efficiently interact with both server-side and client-side databases while maintaining proper separation of concerns. The repository pattern provides a clean abstraction over database access, and the synchronization service enables offline capabilities.

For more information on API integration specifically, see the [Data and API Integration](./08-data-api.md) guide.
