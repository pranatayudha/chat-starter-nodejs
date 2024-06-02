### Steps to showing a new message after sending a message

1.  In `postMessage` method, set this into `async` method, because `saveMessage` method returns Promise value which to use `await` when calling it.
2.  In `addNewConvo` method, call `setConversations` method and map the data from the `prevConversations` value.
3.  In `addMessageToConversation` method, when `sender` value is not `null`, set `latestMessageText` object and it's value inside `newConvo` object, otherwise call `setConversations` method and map the data from the `prevConversations` value.

### Steps to showing an oldest messages at the top and newest messages at the bottom

#### Inside `conversations` routes.

1. Change sort expression of `ORDER BY` clause into `ASC`.
2. Then using `slice` to gets last element of the `messages` array.
