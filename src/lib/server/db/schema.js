// import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// export const task = sqliteTable('task', {
// 	id: text('id')
// 		.primaryKey()
// 		.$defaultFn(() => crypto.randomUUID()),
// 	title: text('title').notNull(),
// 	priority: integer('priority').notNull().default(1)
// });

import {
	text,
	integer,
	real,
	sqliteTable
} from 'drizzle-orm/sqlite-core';



// User login 
export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	address: text('address'),
	phone: text('phone')
});

// Menu Items 
export const menuItems = sqliteTable('menu_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: text('name').notNull(),
	description: text('description'),
	price: real('price').notNull(),
	image: text('image'),
	category: text('category')
});

// Orders
export const orders = sqliteTable('orders', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	userId: text('user_id')
		.notNull()
		.references(() => users.id),

	totalPrice: real('total_price').notNull(),
	status: text('status').notNull().default('pending'),
	createdAt: text('created_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

// Order items 
export const orderItems = sqliteTable('order_items', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	orderId: text('order_id')
		.notNull()
		.references(() => orders.id),

	menuItemId: text('menu_item_id')
		.notNull()
		.references(() => menuItems.id),

	quantity: integer('quantity').notNull().default(1)
});

// Favourite items 
export const favourites = sqliteTable('favourites', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	userId: text('user_id')
		.notNull()
		.references(() => users.id),

	menuItemId: text('menu_item_id')
		.notNull()
		.references(() => menuItems.id)
});

// Restaraunt info 
export const restaurantInfo = sqliteTable('restaurant_info', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	name: text('name').notNull(),
	address: text('address').notNull(),
	phone: text('phone'),
	openingHours: text('opening_hours')
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
 