This resource handles creating, retrieving, updating and deleting forum messages on the system.

The following relationships are associated with this resource and can be retrieved by attaching a `relationships` array as a query param:

| Resource  | Description                                                     |
| --------- | --------------------------------------------------------------- |
| `creator` | User who sent the message                                       |
| `forum`   | Forum the message was sent to                                   |
| `parent`  | Conditional. Message the current message was sent as a reply to |
| `replies` | Replies to a message                                            |
