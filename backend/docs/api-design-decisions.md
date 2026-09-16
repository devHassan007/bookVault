## Ownership violations: 404 vs 403
When a user requests, updates, or deletes a book they don't own, we return `404 Not Found`
rather than `403 Forbidden`. This avoids confirming to an unauthorized caller that a given
book id exists at all — `loadBookAndVerifyOwnership` treats "not found" and "not yours"
identically.