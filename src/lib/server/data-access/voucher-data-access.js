// X00224599

import { db } from '$lib/server/db';
import { giftVoucher } from '../schema.js';
import { eq } from 'drizzle-orm';

export const voucherDataAccess = {

  async create(data) {
    const inserted = await db
      .insert(giftVoucher)
      .values(data)
      .returning();
    return inserted[0] ?? null;
  },

  async findByCode(code) {
    const result = await db
      .select()
      .from(giftVoucher)
      .where(eq(giftVoucher.code, code))
      .limit(1);
    return result[0] ?? null;
  },

  async findAll() {
    return await db
      .select()
      .from(giftVoucher)
      .orderBy(giftVoucher.createdAt);
  },

  async markRedeemed(id) {
    const updated = await db
      .update(giftVoucher)
      .set({ redeemed: true, redeemedAt: new Date() })
      .where(eq(giftVoucher.id, id))
      .returning();
    return updated[0] ?? null;
  }

};