### A couple of common approaches to store read status in database:

#### 1. Store read status in `messages` table (_we used it_)

In this approach, each message has a field indicating whether it has been read or not.

**Schema example:**

```sql
CREATE TABLE public.messages (
	id serial4 NOT NULL,
	"text" varchar(255) NOT NULL,
	"senderId" int4 NOT NULL,
	"createdAt" timestamptz NOT NULL,
	"updatedAt" timestamptz NOT NULL,
	"conversationId" int4 NULL,
	"hasRead" bool DEFAULT false NULL
);
```

##### Benefits

1. Simplicity

   This approach is straightforward as it adds a single read column to the messages table, making it easy to query the read status of any message.

2. Direct Association

   Each message directly holds its read status, allowing for simple and efficient updates when a message is read.

##### Drawbacks

1. Scalability

   As the number of messages grows, queries that count unread messages or fetch unread messages may become slower, especially if the table grows very large.

2. Complex Queries

   To get the number of unread messages per conversation, you would need to aggregate data from the messages table, which could be complex and slow for large datasets.

#### 2. Separate read status table

In this approach, read statuses are stored in a separate table that tracks which users have read which messages.

**Schema example:**

```sql
CREATE TABLE read_statuses (
  id serial4 PRIMARY KEY NOT NULL,
  "userId" int4 NOT NULL,
  "messageId" int4 NOT NULL,
  read boolean DEFAULT FALSE NOT NULL,
  readedAt timestamptz NOT NULL
);
```

##### Benefits:

1. Flexibility

   This approach allows more flexibility in tracking read status, especially in group chats where multiple users might read the same message at different times.

2. Optimized Queries

   Queries to fetch unread messages or count unread messages can be optimized separately from the messages table, potentially improving performance.

##### Drawbacks:

1. Increased Complexity

   This approach requires joining tables more frequently, which can increase the complexity of queries.

2. Consistency Management

   Ensuring consistency between the messages and read_statuses tables can be challenging, especially under high load or in distributed systems.
