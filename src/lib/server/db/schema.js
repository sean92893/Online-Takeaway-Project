import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const task = sqliteTable('task', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
 
export const giftVoucher = sqliteTable('gift_voucher', {
  id:             integer('id').primaryKey({ autoIncrement: true }),
  code:           text('code').notNull().unique(),
  amount:         integer('amount').notNull(),           // stored in cents: 1000 = €10
  recipientName:  text('recipient_name').notNull(),
  recipientEmail: text('recipient_email').notNull(),
  senderName:     text('sender_name').notNull(),
  message:        text('message'),
  redeemed:       integer('redeemed', { mode: 'boolean' }).notNull().default(false),
  redeemedAt:     integer('redeemed_at', { mode: 'timestamp' }),
  createdAt:      integer('created_at', { mode: 'timestamp' }).notNull()
});
 